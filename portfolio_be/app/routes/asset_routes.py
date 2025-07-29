from flask import Blueprint, request, jsonify
from sqlalchemy import or_

from app.models.asset import Asset, PortfolioDailyValue
from app import db

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
        return jsonify({"code": 404, "message": "Invalid user or date."}), 404

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved total asset!",
        "data": {
            "total_asset": f"{total_asset:.2f}"
        }
    }), 200


@asset_bp.route("/search", methods=["POST"])
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
