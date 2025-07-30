from collections import defaultdict
from decimal import Decimal

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


@profit_bp.route("/prev/<int:user_id>", methods=["GET"])  # API 3.5
def get_previous_profit(user_id):
    fromDate = request.args.get("fromDate")
    toDate = request.args.get("toDate")

    if not fromDate and not toDate:
        return jsonify({"code": 400, "message": "Invalid date."}), 400

    try:
        sql = load_sql("app/sql/prev_total_profit.sql")
        sql_text = text(sql)
        params = {
            "from_date": fromDate,
            "to_date": toDate,
            "user_id": user_id
        }

        result = db.session.execute(sql_text, params).mappings().all()
        daily_profit = defaultdict(Decimal)
        for row in result:
            date = str(row['data_date'])
            profit = Decimal(row['profit'])
            daily_profit[date] += profit

        sorted_dates = sorted(daily_profit.keys())
        dates = []
        profits = []
        for d in sorted_dates:
            dates.append(d)
            profits.append(f"{daily_profit[d]:.2f}")

        return jsonify({
            "code": 200,
            "message": "Successfully retrieved profit!",
            "data": {
                "dates": dates,
                "profits": profits
            }
        })
    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500
