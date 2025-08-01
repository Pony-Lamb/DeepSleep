# Portfolio Analysis & Value Fix - 功能说明

## 问题修复

### 1. Portfolio Value 数字获取问题

**问题描述：**
- 导出报告中portfolio value部分数字没有获取成功
- 使用了固定的默认价格（100.0）而不是实际价格

**修复方案：**
- 从Asset表的`close_price`字段获取当前价格
- 如果`close_price`为空，则使用默认价格100.0
- 计算真实的市值和总价值

**修复代码：**
```python
# 修复前
current_price = 100.0  # 默认价格

# 修复后
current_price = asset.close_price if asset.close_price else 100.0
```

### 2. 日变化计算

**新增功能：**
- 使用`open_price`和`close_price`计算日变化百分比
- 计算总变化金额
- 为每个持仓添加日变化数据

**计算逻辑：**
```python
if asset.open_price and asset.close_price:
    daily_change = ((asset.close_price - asset.open_price) / asset.open_price) * 100
    total_change += (asset.close_price - asset.open_price) * portfolio.quantity
```

## Portfolio Analysis 实现

### 1. 资产配置分析 (`calculate_portfolio_allocation`)

**功能：**
- 根据资产名称自动分类资产类型
- 计算各类资产的百分比和价值
- 按百分比排序显示

**资产分类规则：**
- **Technology**: 包含 'TECH', 'SOFTWARE', 'APPLE', 'GOOGLE', 'MICROSOFT'
- **Finance**: 包含 'BANK', 'FINANCE', 'INSURANCE'
- **Healthcare**: 包含 'HEALTH', 'MEDICAL', 'PHARMA'
- **Energy**: 包含 'ENERGY', 'OIL', 'GAS'
- **Other**: 其他类型

**输出示例：**
```
Technology: 45.2% ($67,500.00)
Finance: 32.1% ($48,000.00)
Healthcare: 22.7% ($34,000.00)
```

### 2. 投资组合分析 (`calculate_portfolio_analysis`)

**分析指标：**

#### 多样化评分
- 基于持仓数量计算
- 公式：`min(100, num_holdings * 10)`
- 评分范围：0-100

#### 风险等级
- **Low**: 平均日变化 < 2%
- **Medium**: 平均日变化 2-5%
- **High**: 平均日变化 > 5%

#### 集中度风险
- **Low**: 最大持仓 < 30%
- **Medium**: 最大持仓 30-50%
- **High**: 最大持仓 > 50%

#### 前5大持仓
- 按市值排序
- 显示资产名称、百分比、市值

#### 表现指标
- **今日总回报**: 所有持仓日变化的总和
- **平均日变化**: 所有持仓日变化的平均值
- **最佳表现**: 日变化最大的资产
- **最差表现**: 日变化最小的资产

## PDF报告更新

### 新增内容

#### Portfolio Analysis 部分
```
Portfolio Analysis
Diversification Score: 40/100
Risk Level: Medium
Concentration Risk: Low

Top 5 Holdings:
• Google Finance: 45.2% ($67,500.00)
• Apple Inc.: 32.1% ($48,000.00)
• Microsoft Technology: 22.7% ($34,000.00)

Performance Metrics:
• Total Return Today: 1.05%
• Average Daily Change: 0.53%
• Best Performer: Apple Inc.
• Worst Performer: Google Finance
```

## 使用方法

### 1. 运行测试
```bash
cd portfolio_be
python test_portfolio_analysis.py
```

### 2. API调用
```bash
# 导出完整报告（包含分析）
curl -X GET "http://localhost:5000/api/v1/portfolio/export/1/My%20Portfolio"

# 导出简化报告
curl -X GET "http://localhost:5000/api/v1/portfolio/export/simple/1/My%20Portfolio"
```

### 3. 前端使用
```javascript
// 导出完整报告
await apiService.exportPortfolioPDF(portfolioName, userId);

// 导出简化报告
await apiService.exportSimplePortfolioPDF(portfolioName, userId);
```

## 技术实现

### 1. 价格获取逻辑
```python
def get_current_price(asset):
    """获取当前价格"""
    if asset.close_price:
        return asset.close_price
    elif asset.open_price:
        return asset.open_price
    else:
        return 100.0  # 默认价格
```

### 2. 分析计算逻辑
```python
def calculate_portfolio_analysis(holdings_data, total_value):
    """计算投资组合分析"""
    # 多样化评分
    diversification_score = min(100, len(holdings_data) * 10)
    
    # 风险等级
    avg_daily_change = sum(abs(h['daily_change_percent']) for h in holdings_data) / len(holdings_data)
    risk_level = 'High' if avg_daily_change > 5 else 'Medium' if avg_daily_change > 2 else 'Low'
    
    # 集中度风险
    max_holding_percentage = max(h['market_value'] for h in holdings_data) / total_value * 100
    concentration_risk = 'High' if max_holding_percentage > 50 else 'Medium' if max_holding_percentage > 30 else 'Low'
    
    return {
        'diversification_score': diversification_score,
        'risk_level': risk_level,
        'concentration_risk': concentration_risk,
        # ... 其他指标
    }
```

## 数据要求

### 1. Asset表数据
确保Asset表包含以下字段的有效数据：
- `close_price`: 收盘价（用于当前价格）
- `open_price`: 开盘价（用于计算日变化）
- `asset_name`: 资产名称（用于分类）

### 2. Portfolio表数据
确保Portfolio表包含：
- `asset_id`: 资产ID
- `quantity`: 持仓数量
- `portfolio_name`: 投资组合名称
- `user_id`: 用户ID

## 测试验证

### 1. 价格获取测试
```python
# 测试价格获取
assets = Asset.query.limit(5).all()
for asset in assets:
    current_price = asset.close_price if asset.close_price else 100.0
    print(f"{asset.asset_name}: ${current_price}")
```

### 2. 分析功能测试
```python
# 测试分析计算
allocation = calculate_portfolio_allocation(test_holdings)
analysis = calculate_portfolio_analysis(test_holdings, total_value)
print(f"多样化评分: {analysis['diversification_score']}")
print(f"风险等级: {analysis['risk_level']}")
```

## 未来扩展

### 1. 更复杂的分析
- 夏普比率计算
- 贝塔系数分析
- 相关性分析
- 历史表现分析

### 2. 可视化增强
- 饼图显示资产配置
- 柱状图显示持仓分布
- 趋势图显示历史表现

### 3. 风险管理
- VaR (Value at Risk) 计算
- 压力测试
- 情景分析

## 总结

已成功修复portfolio value获取问题并实现了简单的portfolio analysis功能：

✅ **价格获取修复**: 从Asset表获取真实价格数据
✅ **日变化计算**: 基于开盘价和收盘价计算日变化
✅ **资产配置分析**: 自动分类和百分比计算
✅ **投资组合分析**: 多样化评分、风险等级、集中度风险
✅ **表现指标**: 今日回报、平均变化、最佳/最差表现
✅ **PDF报告更新**: 包含完整的分析内容

该功能现在可以提供更准确和有价值的投资组合分析报告。 