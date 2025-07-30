from flask import Blueprint, request, jsonify
from sqlalchemy import text
from app import db
from app.utils.load_sql_file import load_sql

profit_bp = Blueprint('profit', __name__)


@profit_bp.route("/<int:user_id>", methods=["GET"])
def get_profit(user_id):
    date = request.args.get("date")
    portfolio_name = request.args.get("portfolio_name")

    if not date:
        return jsonify({"code": 400, "message": "Invalid date."}), 400

    try:
        if not portfolio_name:
            sql = load_sql("app/sql/total_profit.sql")
            sql_text = text(sql)
            params = {
                "date": date,
                "user_id": user_id
            }
        else:
            sql = load_sql("app/sql/portfolio_profit.sql")
            sql_text = text(sql)
            params = {
                "date": date,
                "user_id": user_id,
                "portfolio_name": portfolio_name
            }

        result = db.session.execute(sql_text, params).fetchall()
        total_profit = 0.00
        if result:
            total_profit = sum(float(row.profit) for row in result)

        return jsonify({
            "code": 200,
            "message": "Successfully retrieved profit!",
            "data": {"total_profit": f"{total_profit:.2f}"}
        })
    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500
