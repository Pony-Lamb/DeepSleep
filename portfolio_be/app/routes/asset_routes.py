from flask import Blueprint, request, jsonify
from app.models.asset import PortfolioDailyValue
from app import db

asset_bp = Blueprint('asset', __name__)


@asset_bp.route("/total/<int:user_id>", methods=["GET"])
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
