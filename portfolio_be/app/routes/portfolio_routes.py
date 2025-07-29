from flask import Blueprint, request, jsonify
from app.models.portfolio import UserPortfolios
from app import db

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
