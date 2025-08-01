#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
检查和初始化数据库脚本
"""

from app import create_app, db
from app.models.user import User
from app.models.asset import Asset
from app.models.portfolio import Portfolio
from datetime import date

def check_and_init_database():
    app = create_app()
    with app.app_context():
        try:
            # 创建表
            db.create_all()
            print("数据库表创建成功！")
            
            # 检查用户数据
            users = User.query.all()
            print(f"用户数量: {len(users)}")
            
            if len(users) == 0:
                print("创建测试用户...")
                test_user = User(
                    user_id=1,
                    user_name="testuser",
                    available_funds=100000.0  # 增加资金
                )
                db.session.add(test_user)
                db.session.commit()
                print("测试用户创建成功！")
            else:
                print("用户已存在")
                for user in users:
                    print(f"用户ID: {user.user_id}, 名称: {user.user_name}, 资金: {user.available_funds}")
            
            # 检查资产数据
            assets = Asset.query.all()
            print(f"资产数量: {len(assets)}")
            
            if len(assets) == 0:
                print("创建测试资产...")
                today = date.today()
                test_assets = [
                    Asset(
                        asset_id="AAPL",
                        asset_name="Apple Inc.",
                        category="Technology",
                        data_date=today,
                        open_price=150.0,
                        close_price=155.0,
                        high_price=157.0,
                        low_price=149.0
                    ),
                    Asset(
                        asset_id="GOOGL",
                        asset_name="Alphabet Inc.",
                        category="Technology",
                        data_date=today,
                        open_price=2800.0,
                        close_price=2850.0,
                        high_price=2870.0,
                        low_price=2790.0
                    ),
                    Asset(
                        asset_id="GOOG",  # 添加GOOG资产
                        asset_name="Alphabet Inc. (GOOG)",
                        category="Technology",
                        data_date=today,
                        open_price=140.0,
                        close_price=145.0,
                        high_price=147.0,
                        low_price=139.0
                    ),
                    Asset(
                        asset_id="MSFT",
                        asset_name="Microsoft Corporation",
                        category="Technology",
                        data_date=today,
                        open_price=300.0,
                        close_price=310.0,
                        high_price=312.0,
                        low_price=298.0
                    ),
                    Asset(
                        asset_id="TSLA",
                        asset_name="Tesla Inc.",
                        category="Automotive",
                        data_date=today,
                        open_price=800.0,
                        close_price=820.0,
                        high_price=825.0,
                        low_price=795.0
                    )
                ]
                
                for asset in test_assets:
                    db.session.add(asset)
                db.session.commit()
                print("测试资产创建成功！")
            else:
                print("资产已存在")
                for asset in assets:
                    print(f"资产: {asset.asset_id} - {asset.asset_name}, 价格: {asset.open_price}")
            
            # 检查投资组合数据
            portfolios = Portfolio.query.all()
            print(f"投资组合数量: {len(portfolios)}")
            
            if len(portfolios) == 0:
                print("创建测试投资组合...")
                test_portfolios = [
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
                    )
                ]
                
                for portfolio in test_portfolios:
                    db.session.add(portfolio)
                db.session.commit()
                print("测试投资组合创建成功！")
            else:
                print("投资组合已存在")
                for portfolio in portfolios:
                    print(f"投资组合: {portfolio.portfolio_name}, 资产: {portfolio.asset_id}, 数量: {portfolio.quantity}")
            
            print("\n数据库检查和初始化完成！")
            
        except Exception as e:
            db.session.rollback()
            print(f"数据库操作失败: {e}")

if __name__ == '__main__':
    check_and_init_database() 