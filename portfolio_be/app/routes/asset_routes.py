from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy import or_

from app.models.asset import Asset, PortfolioDailyValue
from app import db
from app.models.portfolio import Portfolio
from app.models.user import User

asset_bp = Blueprint('asset', __name__)


@asset_bp.route("/total/<int:user_id>", methods=["GET"])  # API 3.2
def get_total_asset(user_id):
    date_str = request.args.get("date")
    if not date_str or not user_id:
        return jsonify({"code": 400, "message": "Invalid user or date."}), 400

    try:
        total_asset = (
            db.session.query(db.func.sum(PortfolioDailyValue.asset_value))
            .filter(PortfolioDailyValue.user_id == user_id)
            .filter(PortfolioDailyValue.data_date == date_str)
            .scalar()
        )
    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500

    if total_asset is None:
        return jsonify({"code": 404, "message": "Total asset is not found."}), 404

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved total asset!",
        "data": {
            "total_asset": f"{total_asset:.2f}"
        }
    }), 200


@asset_bp.route("/search", methods=["POST"])    # API 3.6
def search_assets():
    content = request.args.get("content", "").strip()
    date_str = request.args.get("date")
    if not date_str:
        return jsonify({"code": 400, "message": "Invalid date."}), 400

    try:
        query = db.session.query(Asset).filter(Asset.data_date == date_str)
        if content:
            like_pattern = f"%{content}%"
            query = query.filter(or_(
                Asset.asset_name.ilike(like_pattern),
                Asset.asset_id.ilike(like_pattern)
            ))
        results = query.all()

        data = []
        for asset in results:
            data.append({
                "asset_id": asset.asset_id,
                "name": asset.asset_name,
                "category": asset.category,
                "high_price": f"{asset.high_price:.2f}",
                "low_price": f"{asset.low_price:.2f}",
                "open_price": f"{asset.open_price:.2f}",
                "close_price": f"{asset.close_price:.2f}",
                "data_date": asset.data_date.strftime("%Y-%m-%d")
            })

        return jsonify({
            "code": 200,
            "message": "Successfully searched!",
            "data": data
        }), 200

    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500


@asset_bp.route("/buy/<int:user_id>", methods=["POST"])  # API 3.7
def buy_asset(user_id):
    try:
        asset_id = request.args.get("asset_id")
        portfolio_name = request.args.get("portfolio_name")
        today = request.args.get("date")
        num = request.args.get("num")
        num = int(num)
        if num is None or num <= 0:
            return jsonify({"code": 400, "message": "Invalid number of assets."}), 400

        asset = Asset.query.filter_by(asset_id=asset_id, data_date=today).first()
        if not asset:
            return jsonify({"code": 404, "message": "Asset not found."}), 404

        cost = asset.open_price * num
        user = User.query.filter_by(user_id=user_id).first()
        if not user or user.available_funds < cost:
            return jsonify({"code": 400, "message": "Insufficient funds."}), 400

        existing = Portfolio.query.filter_by(
            portfolio_name=portfolio_name,
            user_id=user_id,
            asset_id=asset_id
        ).first()

        if existing:
            existing.quantity += num
        else:
            new_record = Portfolio(
                portfolio_name=portfolio_name,
                user_id=user_id,
                asset_id=asset_id,
                quantity=num
            )
            db.session.add(new_record)

        user.available_funds -= cost
        db.session.commit()

        return jsonify({"code": 200, "message": "Successfully buy assets!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500


@asset_bp.route("/<string:asset_id>", methods=["GET"])  # API 3.8
def get_asset_detail(asset_id):
    if not asset_id:
        return jsonify({"code": 400, "message": "Invalid asset ID."}), 400

    try:
        result = (
            db.session.query(Asset)
            .filter(Asset.asset_id == asset_id)
            .order_by(Asset.data_date.desc())
            .first()
        )
    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved asset information!",
        "data": {
            "asset_id": result.asset_id,
            "name": result.asset_name,
            "category": result.category
        }
    }), 200


@asset_bp.route('/prev/<string:asset_id>', methods=['GET'])    # API 3.9
def get_previous_asset_prices(asset_id):
    from_date_str = request.args.get("fromDate")
    to_date_str = request.args.get("toDate")

    if not asset_id or not from_date_str or not to_date_str:
        return jsonify({"code": 400, "message": "Invalid asset ID or date.."}), 400

    try:
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"code": 400, "message": "Invalid date format. Use YYYY-MM-DD."}), 400

    assets = Asset.query.filter(
        Asset.asset_id == asset_id,
        Asset.data_date >= from_date,
        Asset.data_date <= to_date
    ).order_by(Asset.data_date).all()

    if not assets:
        return jsonify({"code": 404, "message": "No asset data found."}), 404

    data = {
        "dates": [a.data_date.strftime("%Y-%m-%d") for a in assets],
        "high_prices": [f"{a.high_price:.2f}" for a in assets],
        "low_prices": [f"{a.low_price:.2f}" for a in assets],
        "close_prices": [f"{a.close_price:.2f}" for a in assets],
        "open_prices": [f"{a.open_price:.2f}" for a in assets],
    }

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved previous asset price!",
        "data": data
    }), 200


@asset_bp.route("/sell/<int:user_id>", methods=["POST"])  # API 3.13
def sell_asset(user_id):
    try:
        asset_id = request.args.get("asset_id")
        num = request.args.get("num")
        num = int(num)
        today = request.args.get("date")
        if num is None or num <= 0:
            return jsonify({"code": 400, "message": "Invalid number of assets."}), 400

        asset = Asset.query.filter_by(asset_id=asset_id, data_date=today).first()
        if not asset:
            return jsonify({"code": 404, "message": "Asset not found."}), 404

        holding = Portfolio.query.filter_by(user_id=user_id, asset_id=asset_id).first()
        if not holding:
            return jsonify({"code": 404, "message": "No such asset in your portfolio."}), 404

        if holding.quantity < num:
            return jsonify({"code": 400, "message": "Not enough quantity to sell."}), 400

        if holding.quantity == num:
            db.session.delete(holding)
        else:
            holding.quantity -= num

        revenue = asset.close_price * num
        user = User.query.filter_by(user_id=user_id).first()
        user.available_funds += revenue

        db.session.commit()

        return jsonify({"code": 200, "message": "Successfully sell assets!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500

