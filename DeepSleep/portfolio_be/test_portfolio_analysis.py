#!/usr/bin/env python3
"""
Portfolio Analysis 测试脚本
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_portfolio_analysis():
    """测试投资组合分析功能"""
    print("=== 测试投资组合分析功能 ===")
    
    try:
        from app.routes.portfolio_routes import calculate_portfolio_allocation, calculate_portfolio_analysis
        
        # 创建测试数据
        test_holdings = [
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
                'asset_name': 'Google Finance',
                'quantity': 50,
                'current_price': 2800.00,
                'market_value': 140000.00,
                'daily_change_percent': -1.2
            },
            {
                'asset_id': 'MSFT',
                'asset_name': 'Microsoft Technology',
                'quantity': 75,
                'current_price': 320.50,
                'market_value': 24037.50,
                'daily_change_percent': 0.8
            },
            {
                'asset_id': 'JNJ',
                'asset_name': 'Johnson & Johnson Healthcare',
                'quantity': 200,
                'current_price': 165.75,
                'market_value': 33150.00,
                'daily_change_percent': 1.5
            }
        ]
        
        total_value = sum(holding['market_value'] for holding in test_holdings)
        
        print(f"总价值: ${total_value:,.2f}")
        print(f"持仓数量: {len(test_holdings)}")
        
        # 测试资产配置分析
        print("\n--- 资产配置分析 ---")
        allocation = calculate_portfolio_allocation(test_holdings)
        for item in allocation:
            print(f"{item['asset_type']}: {item['percentage']}% (${item['value']:,.2f})")
        
        # 测试投资组合分析
        print("\n--- 投资组合分析 ---")
        analysis = calculate_portfolio_analysis(test_holdings, total_value)
        
        print(f"多样化评分: {analysis['diversification_score']}/100")
        print(f"风险等级: {analysis['risk_level']}")
        print(f"集中度风险: {analysis['concentration_risk']}")
        
        print("\n前5大持仓:")
        for holding in analysis['top_holdings']:
            print(f"• {holding['asset_name']}: {holding['percentage']}% (${holding['market_value']:,.2f})")
        
        print("\n表现指标:")
        metrics = analysis['performance_metrics']
        print(f"• 今日总回报: {metrics['total_return_today']:.2f}%")
        print(f"• 平均日变化: {metrics['average_daily_change']:.2f}%")
        print(f"• 最佳表现: {metrics['best_performer']}")
        print(f"• 最差表现: {metrics['worst_performer']}")
        
        return True
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
        return False
    except Exception as e:
        print(f"❌ 分析测试失败: {str(e)}")
        return False

def test_price_calculation():
    """测试价格计算功能"""
    print("\n=== 测试价格计算功能 ===")
    
    try:
        from app.models.asset import Asset
        from app.models.portfolio import Portfolio
        from app import create_app, db
        
        app = create_app()
        
        with app.app_context():
            # 检查数据库中的资产数据
            assets = Asset.query.limit(5).all()
            print(f"找到 {len(assets)} 个资产")
            
            for asset in assets:
                print(f"资产: {asset.asset_name} ({asset.asset_id})")
                print(f"  开盘价: ${asset.open_price or 'N/A'}")
                print(f"  收盘价: ${asset.close_price or 'N/A'}")
                print(f"  最高价: ${asset.high_price or 'N/A'}")
                print(f"  最低价: ${asset.low_price or 'N/A'}")
                print()
            
            # 检查投资组合数据
            portfolios = Portfolio.query.limit(5).all()
            print(f"找到 {len(portfolios)} 个投资组合记录")
            
            for portfolio in portfolios:
                print(f"投资组合: {portfolio.portfolio_name}")
                print(f"  用户ID: {portfolio.user_id}")
                print(f"  资产ID: {portfolio.asset_id}")
                print(f"  数量: {portfolio.quantity}")
                print()
        
        return True
        
    except Exception as e:
        print(f"❌ 价格计算测试失败: {str(e)}")
        return False

def test_pdf_generation_with_analysis():
    """测试包含分析的PDF生成"""
    print("\n=== 测试包含分析的PDF生成 ===")
    
    try:
        from app.utils.pdf_generator import PortfolioPDFGenerator
        
        # 创建测试数据
        test_holdings = [
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
                'asset_name': 'Google Finance',
                'quantity': 50,
                'current_price': 2800.00,
                'market_value': 140000.00,
                'daily_change_percent': -1.2
            }
        ]
        
        total_value = sum(holding['market_value'] for holding in test_holdings)
        
        # 计算分析数据
        from app.routes.portfolio_routes import calculate_portfolio_allocation, calculate_portfolio_analysis
        
        allocation_data = calculate_portfolio_allocation(test_holdings)
        analysis_data = calculate_portfolio_analysis(test_holdings, total_value)
        
        # 构建portfolio数据
        portfolio_data = {
            'summary': {
                'portfolio_name': 'Test Portfolio',
                'total_value': total_value,
                'today_change': 1250.50,
                'total_holdings': len(test_holdings)
            },
            'holdings': test_holdings,
            'allocation': allocation_data,
            'analysis': analysis_data
        }
        
        user_info = {
            'user_id': 1,
            'available_funds': 10000.00,
            'total_assets': total_value + 10000.00
        }
        
        # 生成PDF
        pdf_generator = PortfolioPDFGenerator()
        pdf_data = pdf_generator.generate_portfolio_report(portfolio_data, user_info)
        
        # 保存测试PDF文件
        with open('test_portfolio_analysis.pdf', 'wb') as f:
            f.write(pdf_data)
        
        print("✅ 包含分析的PDF报告生成成功")
        print(f"📄 文件大小: {len(pdf_data)} bytes")
        print(f"📁 保存为: test_portfolio_analysis.pdf")
        
        return True
        
    except Exception as e:
        print(f"❌ PDF生成测试失败: {str(e)}")
        return False

def main():
    """主测试函数"""
    print("🚀 开始Portfolio Analysis测试")
    print("=" * 50)
    
    # 运行所有测试
    tests = [
        ("投资组合分析", test_portfolio_analysis),
        ("价格计算", test_price_calculation),
        ("PDF生成", test_pdf_generation_with_analysis)
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
        print("🎉 所有测试通过！Portfolio Analysis功能正常工作")
    else:
        print("⚠️  部分测试失败，请检查相关功能")
    
    return passed == total

if __name__ == "__main__":
    main() 