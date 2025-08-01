from flask import Blueprint, request, jsonify, send_file
from app.models.portfolio import UserPortfolios, Portfolio
from app import db
from app.models.user import User
from app.models.asset import Asset
from app.utils.pdf_generator import PortfolioPDFGenerator
import io
from datetime import datetime
from collections import defaultdict
import math

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

    # 过滤掉asset_id为null的记录
    data = [{"asset_id": p.asset_id, "quantity": p.quantity} for p in portfolios if p.asset_id is not None]

    return jsonify({
        "code": 200,
        "message": "Successfully retrieved portfolio information!",
        "data": data,
        "len": len(data)
    }), 200


@portfolio_bp.route('/export/<int:user_id>/<portfolio_name>', methods=['GET'])  # API 3.13
def export_portfolio_pdf(user_id, portfolio_name):
    """
    导出portfolio的PDF报告
    """
    try:
        # 验证用户和portfolio
        user = User.query.get(user_id)
        if not user:
            return jsonify({"code": 400, "message": "Invalid user ID."}), 400

        # 获取portfolio持仓
        portfolios = Portfolio.query.filter_by(
            portfolio_name=portfolio_name, 
            user_id=user_id
        ).all()

        if not portfolios:
            return jsonify({"code": 400, "message": "Portfolio not found or empty."}), 400

        # 收集持仓数据
        holdings_data = []
        total_value = 0
        total_change = 0

        for portfolio in portfolios:
            if portfolio.asset_id and portfolio.quantity:
                # 获取资产信息
                asset = Asset.query.get(portfolio.asset_id)
                if asset:
                    # 获取当前价格 - 从Asset表获取close_price作为当前价格
                    current_price = asset.close_price if asset.close_price else 100.0
                    market_value = current_price * portfolio.quantity
                    total_value += market_value

                    # 计算日变化（如果有open_price）
                    daily_change = 0.0
                    if asset.open_price and asset.close_price:
                        daily_change = ((asset.close_price - asset.open_price) / asset.open_price) * 100
                        total_change += (asset.close_price - asset.open_price) * portfolio.quantity

                    holdings_data.append({
                        'asset_id': portfolio.asset_id,
                        'asset_name': asset.name,
                        'quantity': portfolio.quantity,
                        'current_price': current_price,
                        'market_value': market_value,
                        'daily_change_percent': daily_change
                    })

        # 计算资产配置分析
        allocation_data = calculate_portfolio_allocation(holdings_data)
        
        # 计算投资组合分析
        analysis_data = calculate_portfolio_analysis(holdings_data, total_value)

        # 获取用户信息
        user_info = {
            'user_id': user.user_id,
            'available_funds': user.available_funds,
            'total_assets': total_value + user.available_funds
        }

        # 构建portfolio数据
        portfolio_data = {
            'summary': {
                'portfolio_name': portfolio_name,
                'total_value': total_value,
                'today_change': total_change,
                'total_holdings': len(holdings_data)
            },
            'holdings': holdings_data,
            'allocation': allocation_data,
            'analysis': analysis_data
        }

        # 生成PDF
        pdf_generator = PortfolioPDFGenerator()
        pdf_data = pdf_generator.generate_portfolio_report(portfolio_data, user_info)

        # 创建内存文件对象
        pdf_buffer = io.BytesIO(pdf_data)
        pdf_buffer.seek(0)

        # 生成文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"portfolio_report_{portfolio_name}_{timestamp}.pdf"

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500


@portfolio_bp.route('/export/simple/<int:user_id>/<portfolio_name>', methods=['GET'])  # API 3.14
def export_simple_portfolio_pdf(user_id, portfolio_name):
    """
    导出简化版portfolio的PDF报告
    """
    try:
        # 验证用户和portfolio
        user = User.query.get(user_id)
        if not user:
            return jsonify({"code": 400, "message": "Invalid user ID."}), 400

        # 获取portfolio持仓
        portfolios = Portfolio.query.filter_by(
            portfolio_name=portfolio_name, 
            user_id=user_id
        ).all()

        if not portfolios:
            return jsonify({"code": 400, "message": "Portfolio not found or empty."}), 400

        # 收集持仓数据
        holdings_data = []
        total_value = 0

        for portfolio in portfolios:
            if portfolio.asset_id and portfolio.quantity:
                # 获取资产信息
                asset = Asset.query.get(portfolio.asset_id)
                if asset:
                    # 获取当前价格 - 从Asset表获取close_price作为当前价格
                    current_price = asset.close_price if asset.close_price else 100.0
                    market_value = current_price * portfolio.quantity
                    total_value += market_value

                    holdings_data.append({
                        'asset_name': asset.name,
                        'quantity': portfolio.quantity,
                        'current_price': current_price,
                        'market_value': market_value
                    })

        # 生成PDF
        pdf_generator = PortfolioPDFGenerator()
        pdf_data = pdf_generator.generate_simple_report(portfolio_name, holdings_data, total_value)

        # 创建内存文件对象
        pdf_buffer = io.BytesIO(pdf_data)
        pdf_buffer.seek(0)

        # 生成文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"portfolio_simple_{portfolio_name}_{timestamp}.pdf"

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

    except Exception as e:
        return jsonify({"code": 500, "message": f"Internal Server Error: {str(e)}"}), 500


def calculate_portfolio_allocation(holdings_data):
    """
    计算投资组合的资产配置
    """
    if not holdings_data:
        return []
    
    # 按资产类型分组
    allocation_by_category = defaultdict(float)
    total_value = sum(holding['market_value'] for holding in holdings_data)
    
    for holding in holdings_data:
        # 这里可以根据asset_id或asset_name来判断资产类型
        # 简化处理：根据资产名称的前几个字符来判断类型
        asset_name = holding['asset_name'].upper()
        if any(keyword in asset_name for keyword in ['TECH', 'SOFTWARE', 'APPLE', 'GOOGLE', 'MICROSOFT']):
            category = 'Technology'
        elif any(keyword in asset_name for keyword in ['BANK', 'FINANCE', 'INSURANCE']):
            category = 'Finance'
        elif any(keyword in asset_name for keyword in ['HEALTH', 'MEDICAL', 'PHARMA']):
            category = 'Healthcare'
        elif any(keyword in asset_name for keyword in ['ENERGY', 'OIL', 'GAS']):
            category = 'Energy'
        else:
            category = 'Other'
        
        allocation_by_category[category] += holding['market_value']
    
    # 转换为百分比
    allocation_data = []
    for category, value in allocation_by_category.items():
        percentage = (value / total_value) * 100 if total_value > 0 else 0
        allocation_data.append({
            'asset_type': category,
            'percentage': round(percentage, 2),
            'value': round(value, 2)
        })
    
    # 按百分比排序
    allocation_data.sort(key=lambda x: x['percentage'], reverse=True)
    return allocation_data


def calculate_portfolio_analysis(holdings_data, total_value):
    """
    计算投资组合分析
    """
    if not holdings_data:
        return {
            'diversification_score': 0,
            'risk_level': 'Low',
            'concentration_risk': 'Low',
            'top_holdings': [],
            'performance_metrics': {}
        }
    
    # 计算多样化评分
    num_holdings = len(holdings_data)
    diversification_score = min(100, num_holdings * 10)  # 简单评分
    
    # 计算集中度风险
    sorted_holdings = sorted(holdings_data, key=lambda x: x['market_value'], reverse=True)
    top_holding_percentage = (sorted_holdings[0]['market_value'] / total_value) * 100 if total_value > 0 else 0
    
    if top_holding_percentage > 50:
        concentration_risk = 'High'
    elif top_holding_percentage > 30:
        concentration_risk = 'Medium'
    else:
        concentration_risk = 'Low'
    
    # 计算风险等级
    avg_daily_change = sum(abs(holding['daily_change_percent']) for holding in holdings_data) / len(holdings_data)
    if avg_daily_change > 5:
        risk_level = 'High'
    elif avg_daily_change > 2:
        risk_level = 'Medium'
    else:
        risk_level = 'Low'
    
    # 获取前5大持仓
    top_holdings = sorted_holdings[:5]
    top_holdings_data = []
    for holding in top_holdings:
        percentage = (holding['market_value'] / total_value) * 100 if total_value > 0 else 0
        top_holdings_data.append({
            'asset_name': holding['asset_name'],
            'percentage': round(percentage, 2),
            'market_value': round(holding['market_value'], 2)
        })
    
    # 计算表现指标
    total_daily_change = sum(holding['daily_change_percent'] for holding in holdings_data)
    avg_daily_change = total_daily_change / len(holdings_data) if holdings_data else 0
    
    performance_metrics = {
        'total_return_today': round(total_daily_change, 2),
        'average_daily_change': round(avg_daily_change, 2),
        'best_performer': max(holdings_data, key=lambda x: x['daily_change_percent'])['asset_name'] if holdings_data else 'N/A',
        'worst_performer': min(holdings_data, key=lambda x: x['daily_change_percent'])['asset_name'] if holdings_data else 'N/A'
    }
    
    return {
        'diversification_score': diversification_score,
        'risk_level': risk_level,
        'concentration_risk': concentration_risk,
        'top_holdings': top_holdings_data,
        'performance_metrics': performance_metrics
    }


