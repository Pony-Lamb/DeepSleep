#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
初始化测试数据脚本
用于为前端API测试提供基础数据
"""

from app import create_app, db
from app.models.user import User
from app.models.asset import Asset
from app.models.portfolio import Portfolio, UserPortfolios
from datetime import datetime, date

def init_test_data():
    app = create_app()
    with app.app_context():
        db.create_all()
        
        # 创建测试用户
        test_user = User(
            user_id=1,
            user_name="testuser",
            available_funds=10000.0
        )
        
        # 创建测试资产
        assets = [
            Asset(
                asset_id="AAPL",
                asset_name="Apple Inc.",
                category="Technology",
                data_date=date.today(),
                open_price=150.0,
                close_price=155.0,
                high_price=157.0,
                low_price=149.0
            ),
            Asset(
                asset_id="GOOGL",
                asset_name="Alphabet Inc.",
                category="Technology",
                data_date=date.today(),
                open_price=2800.0,
                close_price=2850.0,
                high_price=2870.0,
                low_price=2790.0
            ),
            Asset(
                asset_id="MSFT",
                asset_name="Microsoft Corporation",
                category="Technology",
                data_date=date.today(),
                open_price=300.0,
                close_price=310.0,
                high_price=312.0,
                low_price=298.0
            ),
            Asset(
                asset_id="TSLA",
                asset_name="Tesla Inc.",
                category="Automotive",
                data_date=date.today(),
                open_price=800.0,
                close_price=820.0,
                high_price=825.0,
                low_price=795.0
            )
        ]
        
        # 创建投资组合
        portfolios = [
            Portfolio(
                portfolio_name="US Stocks",
                user_id=1,
                asset_id="AAPL",
                quantity=10
            ),
            Portfolio(
                portfolio_name="US Stocks",
                user_id=1,
                asset_id="GOOGL",
                quantity=5
            ),
            Portfolio(
                portfolio_name="Tech Portfolio",
                user_id=1,
                asset_id="MSFT",
                quantity=15
            ),
            Portfolio(
                portfolio_name="Tech Portfolio",
                user_id=1,
                asset_id="TSLA",
                quantity=8
            )
        ]
        
        try:
            # 添加用户
            db.session.add(test_user)
            
            # 添加资产
            for asset in assets:
                db.session.add(asset)
            
            # 添加投资组合
            for portfolio in portfolios:
                db.session.add(portfolio)
            
            db.session.commit()
            print("测试数据初始化成功！")
            print(f"用户: {test_user.username}")
            print(f"资产数量: {len(assets)}")
            print(f"投资组合记录: {len(portfolios)}")
            
        except Exception as e:
            db.session.rollback()
            print(f"初始化数据时出错: {e}")

if __name__ == '__main__':
    init_test_data() 