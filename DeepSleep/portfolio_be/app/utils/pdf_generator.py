import os
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor


class PortfolioPDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """设置自定义样式"""
        # 标题样式
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=HexColor('#1f2937')
        ))
        
        # 副标题样式
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=20,
            textColor=HexColor('#374151')
        ))
        
        # 正文样式
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=12,
            textColor=HexColor('#4b5563')
        ))
        
        # 表格标题样式
        self.styles.add(ParagraphStyle(
            name='TableHeader',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            textColor=HexColor('#ffffff'),
            alignment=TA_CENTER
        ))
        
        # 表格内容样式
        self.styles.add(ParagraphStyle(
            name='TableContent',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            textColor=HexColor('#374151'),
            alignment=TA_LEFT
        ))
    
    def generate_portfolio_report(self, portfolio_data, user_info=None):
        """
        生成portfolio PDF报告
        
        Args:
            portfolio_data (dict): 包含portfolio信息的字典
            user_info (dict): 用户信息
            
        Returns:
            bytes: PDF文件的字节数据
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, 
                              topMargin=72, bottomMargin=72)
        
        story = []
        
        # 添加报告标题
        story.append(Paragraph("Portfolio Investment Report", self.styles['CustomTitle']))
        story.append(Spacer(1, 20))
        
        # 添加生成时间
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        story.append(Paragraph(f"Generated on: {current_time}", self.styles['CustomBody']))
        story.append(Spacer(1, 30))
        
        # 添加用户信息
        if user_info:
            story.append(Paragraph("User Information", self.styles['CustomSubtitle']))
            user_table_data = [
                ['User ID', str(user_info.get('user_id', 'N/A'))],
                ['Available Funds', f"${user_info.get('available_funds', 0):,.2f}"],
                ['Total Assets', f"${user_info.get('total_assets', 0):,.2f}"]
            ]
            user_table = Table(user_table_data, colWidths=[2*inch, 3*inch])
            user_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),
                ('GRID', (0, 0), (-1, -1), 1, colors.white),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ]))
            story.append(user_table)
            story.append(Spacer(1, 20))
        
        # 添加Portfolio摘要信息
        if 'summary' in portfolio_data:
            story.append(Paragraph("Portfolio Summary", self.styles['CustomSubtitle']))
            summary = portfolio_data['summary']
            summary_table_data = [
                ['Portfolio Name', summary.get('portfolio_name', 'N/A')],
                ['Total Value', f"${summary.get('total_value', 0):,.2f}"],
                ['Today\'s Change', f"${summary.get('today_change', 0):,.2f}"],
                ['Total Holdings', str(summary.get('total_holdings', 0))]
            ]
            summary_table = Table(summary_table_data, colWidths=[2*inch, 3*inch])
            summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#10b981')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f0fdf4')),
                ('GRID', (0, 0), (-1, -1), 1, colors.white),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ]))
            story.append(summary_table)
            story.append(Spacer(1, 20))
        
        # 添加持仓详情
        if 'holdings' in portfolio_data and portfolio_data['holdings']:
            story.append(Paragraph("Current Holdings", self.styles['CustomSubtitle']))
            
            # 创建持仓表格
            holdings_data = [['Asset', 'Quantity', 'Current Price', 'Market Value', 'Daily Change']]
            
            for holding in portfolio_data['holdings']:
                holdings_data.append([
                    f"{holding.get('asset_name', 'N/A')} ({holding.get('asset_id', 'N/A')})",
                    str(holding.get('quantity', 0)),
                    f"${holding.get('current_price', 0):,.2f}",
                    f"${holding.get('market_value', 0):,.2f}",
                    f"{holding.get('daily_change_percent', 0):.2f}%"
                ])
            
            holdings_table = Table(holdings_data, colWidths=[1.5*inch, 0.8*inch, 1*inch, 1.2*inch, 1*inch])
            holdings_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#6366f1')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),
                ('GRID', (0, 0), (-1, -1), 1, colors.white),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 1), (1, -1), 'CENTER'),  # Quantity列居中
                ('ALIGN', (2, 1), (4, -1), 'RIGHT'),     # 价格相关列右对齐
                ('TOPPADDING', (0, 1), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ]))
            story.append(holdings_table)
            story.append(Spacer(1, 20))
        
        # 添加资产配置分析
        if 'allocation' in portfolio_data and portfolio_data['allocation']:
            story.append(Paragraph("Asset Allocation", self.styles['CustomSubtitle']))
            
            allocation_data = [['Asset Type', 'Percentage', 'Value']]
            for allocation in portfolio_data['allocation']:
                allocation_data.append([
                    allocation.get('asset_type', 'N/A'),
                    f"{allocation.get('percentage', 0):.2f}%",
                    f"${allocation.get('value', 0):,.2f}"
                ])
            
            allocation_table = Table(allocation_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
            allocation_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#f59e0b')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), HexColor('#fffbeb')),
                ('GRID', (0, 0), (-1, -1), 1, colors.white),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 1), (2, -1), 'RIGHT'),
                ('TOPPADDING', (0, 1), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ]))
            story.append(allocation_table)
            story.append(Spacer(1, 20))
        
        # 添加投资组合分析
        if 'analysis' in portfolio_data and portfolio_data['analysis']:
            story.append(Paragraph("Portfolio Analysis", self.styles['CustomSubtitle']))
            
            analysis = portfolio_data['analysis']
            
            # 多样化评分
            story.append(Paragraph(f"Diversification Score: {analysis.get('diversification_score', 0)}/100", self.styles['CustomBody']))
            
            # 风险等级
            risk_level = analysis.get('risk_level', 'Low')
            risk_color = 'red' if risk_level == 'High' else 'orange' if risk_level == 'Medium' else 'green'
            story.append(Paragraph(f"Risk Level: {risk_level}", self.styles['CustomBody']))
            
            # 集中度风险
            concentration_risk = analysis.get('concentration_risk', 'Low')
            story.append(Paragraph(f"Concentration Risk: {concentration_risk}", self.styles['CustomBody']))
            
            # 前5大持仓
            if analysis.get('top_holdings'):
                story.append(Paragraph("Top 5 Holdings:", self.styles['CustomBody']))
                for holding in analysis['top_holdings']:
                    story.append(Paragraph(
                        f"• {holding['asset_name']}: {holding['percentage']}% (${holding['market_value']:,.2f})", 
                        self.styles['CustomBody']
                    ))
            
            # 表现指标
            if analysis.get('performance_metrics'):
                metrics = analysis['performance_metrics']
                story.append(Paragraph("Performance Metrics:", self.styles['CustomBody']))
                story.append(Paragraph(f"• Total Return Today: {metrics.get('total_return_today', 0):.2f}%", self.styles['CustomBody']))
                story.append(Paragraph(f"• Average Daily Change: {metrics.get('average_daily_change', 0):.2f}%", self.styles['CustomBody']))
                story.append(Paragraph(f"• Best Performer: {metrics.get('best_performer', 'N/A')}", self.styles['CustomBody']))
                story.append(Paragraph(f"• Worst Performer: {metrics.get('worst_performer', 'N/A')}", self.styles['CustomBody']))
            
            story.append(Spacer(1, 20))
        else:
            # 添加风险分析
            story.append(Paragraph("Risk Analysis", self.styles['CustomSubtitle']))
            risk_analysis = [
                "• Portfolio diversification analysis",
                "• Market volatility assessment", 
                "• Investment horizon considerations",
                "• Risk tolerance evaluation"
            ]
            
            for risk_item in risk_analysis:
                story.append(Paragraph(risk_item, self.styles['CustomBody']))
            
            story.append(Spacer(1, 20))
        
        # 添加免责声明
        story.append(Paragraph("Disclaimer", self.styles['CustomSubtitle']))
        disclaimer_text = """
        This report is generated for informational purposes only. The information contained herein 
        should not be considered as investment advice. Past performance does not guarantee future results. 
        Please consult with a qualified financial advisor before making any investment decisions.
        """
        story.append(Paragraph(disclaimer_text, self.styles['CustomBody']))
        
        # 构建PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def generate_simple_report(self, portfolio_name, holdings_data, total_value=0):
        """
        生成简单的portfolio报告
        
        Args:
            portfolio_name (str): 投资组合名称
            holdings_data (list): 持仓数据列表
            total_value (float): 总价值
            
        Returns:
            bytes: PDF文件的字节数据
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, 
                              topMargin=72, bottomMargin=72)
        
        story = []
        
        # 添加报告标题
        story.append(Paragraph(f"Portfolio Report: {portfolio_name}", self.styles['CustomTitle']))
        story.append(Spacer(1, 20))
        
        # 添加生成时间
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        story.append(Paragraph(f"Generated on: {current_time}", self.styles['CustomBody']))
        story.append(Spacer(1, 30))
        
        # 添加总价值
        story.append(Paragraph(f"Total Portfolio Value: ${total_value:,.2f}", self.styles['CustomSubtitle']))
        story.append(Spacer(1, 20))
        
        # 添加持仓表格
        if holdings_data:
            story.append(Paragraph("Current Holdings", self.styles['CustomSubtitle']))
            
            holdings_table_data = [['Asset', 'Quantity', 'Current Price', 'Market Value']]
            for holding in holdings_data:
                holdings_table_data.append([
                    holding.get('asset_name', 'N/A'),
                    str(holding.get('quantity', 0)),
                    f"${holding.get('current_price', 0):,.2f}",
                    f"${holding.get('market_value', 0):,.2f}"
                ])
            
            holdings_table = Table(holdings_table_data, colWidths=[2*inch, 1*inch, 1.5*inch, 1.5*inch])
            holdings_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8fafc')),
                ('GRID', (0, 0), (-1, -1), 1, colors.white),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 1), (3, -1), 'RIGHT'),
                ('TOPPADDING', (0, 1), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ]))
            story.append(holdings_table)
        
        # 构建PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue() 