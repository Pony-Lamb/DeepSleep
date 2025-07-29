from flask import Blueprint, jsonify
from app.models.user import User

user_bp = Blueprint('user', __name__)


@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user_info(user_id):
    user_info = User.query.get(user_id)
    if not user_info:
        return jsonify({"message": "Invalid user."}), 404

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved user information!",
        "data": {
            "user_id": user_info.user_id,
            "name": user_info.user_name,
            "available_funds": user_info.available_funds
        }
    }), 200
