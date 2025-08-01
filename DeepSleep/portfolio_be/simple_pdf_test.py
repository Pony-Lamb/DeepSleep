#!/usr/bin/env python3
"""
简单的PDF导出功能测试
"""

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import inch
    import io
    from datetime import datetime
    
    def test_basic_pdf():
        """测试基本的PDF生成功能"""
        print("=== 测试基本PDF生成 ===")
        
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

if __name__ == "__main__":
    test_basic_pdf() 