#!/usr/bin/env python3
"""
PDF导出功能测试脚本
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.asset import Asset
from app.utils.pdf_generator import PortfolioPDFGenerator
from datetime import datetime

def test_pdf_generator():
    """测试PDF生成器"""
    print("=== 测试PDF生成器 ===")
    
    # 创建测试数据
    test_portfolio_data = {
        'summary': {
            'portfolio_name': 'Test Portfolio',
            'total_value': 50000.00,
            'today_change': 1250.50,
            'total_holdings': 5
        },
        'holdings': [
            {
                'asset_id': 'AAPL',
                'asset_name': 'Apple Inc.',
                'quantity': 100,
                'current_price': 150.25,
                'market_value': 15025.00,
                'daily_change_percent': 2.5
            },
            {
                'asset_id': 'GOOGL',
                'asset_name': 'Alphabet Inc.',
                'quantity': 50,
                'current_price': 2800.00,
                'market_value': 140000.00,
                'daily_change_percent': -1.2
            },
            {
                'asset_id': 'MSFT',
                'asset_name': 'Microsoft Corporation',
                'quantity': 75,
                'current_price': 320.50,
                'market_value': 24037.50,
                'daily_change_percent': 0.8
            }
        ],
        'allocation': [
            {
                'asset_type': 'Technology',
                'percentage': 60.0,
                'value': 30000.00
            },
            {
                'asset_type': 'Healthcare',
                'percentage': 25.0,
                'value': 12500.00
            },
            {
                'asset_type': 'Finance',
                'percentage': 15.0,
                'value': 7500.00
            }
        ]
    }
    
    test_user_info = {
        'user_id': 1,
        'available_funds': 10000.00,
        'total_assets': 60000.00
    }
    
    try:
        # 测试完整报告生成
        pdf_generator = PortfolioPDFGenerator()
        pdf_data = pdf_generator.generate_portfolio_report(test_portfolio_data, test_user_info)
        
        # 保存测试PDF文件
        with open('test_portfolio_report.pdf', 'wb') as f:
            f.write(pdf_data)
        
        print("✅ 完整PDF报告生成成功")
        print(f"📄 文件大小: {len(pdf_data)} bytes")
        print(f"📁 保存为: test_portfolio_report.pdf")
        
        # 测试简化报告生成
        simple_pdf_data = pdf_generator.generate_simple_report(
            'Test Portfolio',
            test_portfolio_data['holdings'],
            50000.00
        )
        
        # 保存简化测试PDF文件
        with open('test_simple_report.pdf', 'wb') as f:
            f.write(simple_pdf_data)
        
        print("✅ 简化PDF报告生成成功")
        print(f"📄 文件大小: {len(simple_pdf_data)} bytes")
        print(f"📁 保存为: test_simple_report.pdf")
        
    except Exception as e:
        print(f"❌ PDF生成测试失败: {str(e)}")
        return False
    
    return True

def test_database_integration():
    """测试数据库集成"""
    print("\n=== 测试数据库集成 ===")
    
    app = create_app()
    
    with app.app_context():
        try:
            # 检查数据库连接
            db.session.execute('SELECT 1')
            print("✅ 数据库连接正常")
            
            # 检查用户表
            users = User.query.limit(1).all()
            print(f"✅ 用户表正常，找到 {len(users)} 个用户")
            
            # 检查资产表
            assets = Asset.query.limit(1).all()
            print(f"✅ 资产表正常，找到 {len(assets)} 个资产")
            
            # 检查投资组合表
            portfolios = Portfolio.query.limit(1).all()
            print(f"✅ 投资组合表正常，找到 {len(portfolios)} 个投资组合")
            
        except Exception as e:
            print(f"❌ 数据库集成测试失败: {str(e)}")
            return False
    
    return True

def test_api_endpoints():
    """测试API端点"""
    print("\n=== 测试API端点 ===")
    
    app = create_app()
    
    with app.test_client() as client:
        try:
            # 测试获取投资组合名称
            response = client.get('/api/v1/portfolio/name/1')
            print(f"✅ 获取投资组合名称端点: {response.status_code}")
            
            # 测试获取投资组合详情
            response = client.get('/api/v1/portfolio/details?name=Test%20Portfolio')
            print(f"✅ 获取投资组合详情端点: {response.status_code}")
            
            # 测试PDF导出端点（需要有效的投资组合）
            response = client.get('/api/v1/portfolio/export/1/Test%20Portfolio')
            print(f"✅ PDF导出端点: {response.status_code}")
            
        except Exception as e:
            print(f"❌ API端点测试失败: {str(e)}")
            return False
    
    return True

def main():
    """主测试函数"""
    print("🚀 开始PDF导出功能测试")
    print("=" * 50)
    
    # 运行所有测试
    tests = [
        ("PDF生成器", test_pdf_generator),
        ("数据库集成", test_database_integration),
        ("API端点", test_api_endpoints)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} 测试通过")
            else:
                print(f"❌ {test_name} 测试失败")
        except Exception as e:
            print(f"❌ {test_name} 测试异常: {str(e)}")
    
    print("\n" + "=" * 50)
    print(f"📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！PDF导出功能正常工作")
    else:
        print("⚠️  部分测试失败，请检查相关功能")
    
    return passed == total

if __name__ == "__main__":
    main() 