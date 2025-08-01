# Portfolio PDF Export Feature

## 功能概述

Portfolio PDF导出功能允许用户将投资组合的详细信息导出为PDF报告，包含完整的投资组合分析、持仓详情、资产配置等信息。

## 功能特性

### 1. 完整报告 (Full Report)
- **用户信息**: 用户ID、可用资金、总资产
- **投资组合摘要**: 投资组合名称、总价值、今日变化、持仓数量
- **持仓详情**: 资产名称、数量、当前价格、市值、日变化百分比
- **资产配置分析**: 按资产类型分类的配置比例
- **风险分析**: 投资组合多样化分析、市场波动性评估等
- **免责声明**: 投资风险提示

### 2. 简化报告 (Simple Report)
- **投资组合基本信息**: 名称、总价值
- **持仓详情**: 资产名称、数量、当前价格、市值
- **生成时间戳**: 报告生成时间

## 技术实现

### 后端实现

#### 1. PDF生成器 (`app/utils/pdf_generator.py`)
```python
class PortfolioPDFGenerator:
    def generate_portfolio_report(self, portfolio_data, user_info)
    def generate_simple_report(self, portfolio_name, holdings_data, total_value)
```

#### 2. API端点
- `GET /api/v1/portfolio/export/{user_id}/{portfolio_name}` - 导出完整报告
- `GET /api/v1/portfolio/export/simple/{user_id}/{portfolio_name}` - 导出简化报告

#### 3. 依赖包
```
reportlab  # PDF生成
Pillow     # 图像处理
```

### 前端实现

#### 1. API服务 (`fe/js/api-service.js`)
```javascript
async exportPortfolioPDF(portfolioName, userId)
async exportSimplePortfolioPDF(portfolioName, userId)
```

#### 2. Portfolio面板 (`fe/js/portfolio-panel.js`)
```javascript
async exportPortfolioPDF()
async exportSimplePortfolioPDF()
showExportOptionsModal()
```

## 使用方法

### 1. 用户界面操作
1. 进入Portfolio页面
2. 选择要导出的投资组合
3. 点击"Export Report"按钮
4. 在弹出的模态框中选择报告类型：
   - **完整报告**: 包含详细分析信息
   - **简化报告**: 包含基本信息

### 2. API调用示例

#### 导出完整报告
```bash
curl -X GET "http://localhost:5000/api/v1/portfolio/export/1/My%20Portfolio" \
     -H "Content-Type: application/json" \
     --output portfolio_report.pdf
```

#### 导出简化报告
```bash
curl -X GET "http://localhost:5000/api/v1/portfolio/export/simple/1/My%20Portfolio" \
     -H "Content-Type: application/json" \
     --output portfolio_simple.pdf
```

## 文件结构

```
portfolio_be/
├── app/
│   ├── utils/
│   │   └── pdf_generator.py          # PDF生成器
│   └── routes/
│       └── portfolio_routes.py       # 包含导出路由
├── requirements.txt                   # 包含reportlab和Pillow
└── test_pdf_export.py               # 测试脚本

fe/
├── js/
│   ├── api-service.js               # 包含导出API方法
│   └── portfolio-panel.js           # 包含导出UI逻辑
└── components/
    └── portfolio-panel.html         # 包含导出按钮
```

## 测试

### 运行测试脚本
```bash
cd portfolio_be
python test_pdf_export.py
```

### 测试内容
1. **PDF生成器测试**: 验证PDF文件生成功能
2. **数据库集成测试**: 验证数据库连接和数据查询
3. **API端点测试**: 验证API端点响应

## 配置要求

### 1. 安装依赖
```bash
pip install reportlab Pillow
```

### 2. 数据库要求
- 确保用户表、资产表、投资组合表存在
- 确保有测试数据可用于生成报告

### 3. 文件权限
- 确保应用有写入临时文件的权限
- 确保生成的PDF文件可以正常下载

## 错误处理

### 常见错误及解决方案

1. **PDF生成失败**
   - 检查reportlab是否正确安装
   - 检查数据格式是否正确

2. **文件下载失败**
   - 检查浏览器下载设置
   - 检查网络连接

3. **数据库连接错误**
   - 检查数据库配置
   - 检查数据库服务状态

## 性能优化

### 1. 大文件处理
- 使用流式处理避免内存溢出
- 实现分页生成大型报告

### 2. 缓存机制
- 缓存常用的报告模板
- 实现报告生成队列

### 3. 异步处理
- 对于大型报告使用异步生成
- 实现进度通知机制

## 安全考虑

1. **数据验证**: 确保用户只能导出自己的投资组合
2. **文件安全**: 生成的PDF文件不包含敏感信息
3. **访问控制**: 实现适当的权限检查

## 未来扩展

1. **自定义模板**: 允许用户自定义报告模板
2. **图表支持**: 在PDF中添加图表和可视化
3. **多语言支持**: 支持多种语言的报告生成
4. **邮件发送**: 支持通过邮件发送PDF报告
5. **定时报告**: 支持定时生成和发送报告

## 维护说明

### 1. 日志记录
- 记录PDF生成的成功/失败事件
- 记录文件下载统计信息

### 2. 监控指标
- PDF生成时间
- 文件大小统计
- 用户使用频率

### 3. 定期维护
- 清理临时文件
- 更新依赖包
- 检查磁盘空间 