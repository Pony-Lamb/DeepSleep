#!/usr/bin/env python3
"""
简化的PDF导出功能测试
"""

def test_pdf_generator():
    """测试PDF生成器"""
    print("=== 测试PDF生成器 ===")
    
    try:
        # 尝试导入PDF生成器
        from app.utils.pdf_generator import PortfolioPDFGenerator
        print("✅ PDF生成器导入成功")
        
        # 创建测试数据
        test_portfolio_data = {
            'summary': {
                'portfolio_name': 'Test Portfolio',
                'total_value': 50000.00,
                'today_change': 1250.50,
                'total_holdings': 3
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
        
        return True
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
        print("请确保已安装reportlab和Pillow:")
        print("pip install reportlab Pillow")
        return False
    except Exception as e:
        print(f"❌ PDF生成测试失败: {str(e)}")
        return False

def test_basic_pdf():
    """测试基本的PDF生成功能"""
    print("\n=== 测试基本PDF生成 ===")
    
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        import io
        from datetime import datetime
        
        # 创建内存缓冲区
        buffer = io.BytesIO()
        
        # 创建PDF文档
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, 
                              topMargin=72, bottomMargin=72)
        
        # 获取样式
        styles = getSampleStyleSheet()
        
        # 创建内容
        story = []
        story.append(Paragraph("Portfolio Test Report", styles['Heading1']))
        story.append(Spacer(1, 20))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        story.append(Spacer(1, 20))
        story.append(Paragraph("This is a test PDF for portfolio export feature.", styles['Normal']))
        
        # 构建PDF
        doc.build(story)
        buffer.seek(0)
        
        # 保存测试文件
        with open('test_basic.pdf', 'wb') as f:
            f.write(buffer.getvalue())
        
        print("✅ 基本PDF生成成功")
        print(f"📄 文件大小: {len(buffer.getvalue())} bytes")
        print(f"📁 保存为: test_basic.pdf")
        
        return True
        
    except ImportError as e:
        print(f"❌ 缺少依赖包: {e}")
        print("请运行: pip install reportlab Pillow")
        return False
    except Exception as e:
        print(f"❌ PDF生成失败: {e}")
        return False

def main():
    """主测试函数"""
    print("🚀 开始PDF导出功能测试")
    print("=" * 50)
    
    # 运行所有测试
    tests = [
        ("基本PDF生成", test_basic_pdf),
        ("PDF生成器", test_pdf_generator)
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