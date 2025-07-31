from flask import Blueprint, request, jsonify
from app.models.portfolio import UserPortfolios, Portfolio
from app import db
from app.models.user import User

portfolio_bp = Blueprint('portfolio', __name__)


@portfolio_bp.route("/name/<int:user_id>", methods=["GET"])  # API 3.10
def get_portfolio_names(user_id):
    if not user_id:
        return jsonify({"code": 400, "message": "Invalid user."}), 400

    try:
        results = (
            db.session.query(UserPortfolios.portfolio_name)
            .filter(UserPortfolios.user_id == user_id)
            .distinct()
            .all()
        )

        portfolios = [row.portfolio_name for row in results]

        return jsonify({
            "code": 200,
            "message": "Successfully retrieved portfolio names!",
            "data": {
                "portfolios": portfolios
            }
        })
    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500


@portfolio_bp.route("/create/<int:user_id>", methods=["POST"])  # API 3.11
def create_portfolio(user_id):
    try:
        portfolio_name = request.args.get("name", "")

        user = User.query.get(user_id)
        if not portfolio_name or not user:
            return jsonify({"code": 400, "message": "Invalid user ID or portfolio name."}), 400

        existing = Portfolio.query.filter_by(portfolio_name=portfolio_name, user_id=user_id).first()
        if existing:
            return jsonify({"code": 400, "message": "Portfolio with this name already exists for the user."}), 400

        new_portfolio = Portfolio(
            portfolio_name=portfolio_name,
            user_id=user_id,
            asset_id=None,
            quantity=None
        )
        db.session.add(new_portfolio)
        db.session.commit()

        return jsonify({"code": 200, "message": "Successfully created a portfolio!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500


@portfolio_bp.route('/details', methods=['GET'])  # API 3.12
def get_portfolio_details():
    portfolio_name = request.args.get("name", "")
    portfolios = Portfolio.query.filter_by(portfolio_name=portfolio_name).all()

    if not portfolios:
        return jsonify({"code": 400, "message": "Invalid portfolio name."}), 400

    data = [{"asset_id": p.asset_id, "quantity": p.quantity} for p in portfolios]

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved portfolio information!",
        "data": data,
        "len": len(portfolios)
    }), 200


