#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
数据库连接测试脚本
"""

from app import create_app, db
from app.models.user import User
from app.models.asset import Asset
from app.models.portfolio import Portfolio

def test_database():
    app = create_app()
    with app.app_context():
        try:
            # 测试数据库连接
            db.create_all()
            print("数据库连接成功！")
            
            # 检查是否有用户数据
            users = User.query.all()
            print(f"用户数量: {len(users)}")
            
            # 检查是否有资产数据
            assets = Asset.query.all()
            print(f"资产数量: {len(assets)}")
            
            # 检查是否有投资组合数据
            portfolios = Portfolio.query.all()
            print(f"投资组合数量: {len(portfolios)}")
            
            if len(users) == 0:
                print("没有用户数据，需要初始化测试数据")
            else:
                print("数据库已有数据")
                
        except Exception as e:
            print(f"数据库连接失败: {e}")

if __name__ == '__main__':
    test_database() 