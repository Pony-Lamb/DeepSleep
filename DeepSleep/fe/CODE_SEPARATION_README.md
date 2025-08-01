# 代码分离重构说明

## 概述

本次重构将原本集中在 `main.js` 中的代码按功能模块分离到不同的JS文件中，提高了代码的可维护性和模块化程度。

## 分离后的文件结构

### 1. `home-panel.js` - 首页面板功能
**功能**：
- 首页环形图（资产分配）
- 首页折线图（收益趋势）
- 图表可见性切换
- 时间周期切换

**主要类**：`HomePanel`
**全局实例**：`homePanel`

### 2. `trading-panel.js` - 交易面板功能
**功能**：
- 股票搜索
- 股票卡片展示
- 买入交易逻辑
- 股票详情跳转

**主要类**：`TradingPanel`
**全局实例**：`tradingPanel`

### 3. `portfolio-panel.js` - 投资组合面板功能
**功能**：
- 投资组合管理
- 持仓展示
- 卖出交易
- 投资组合切换

**主要类**：`PortfolioPanel`
**全局实例**：`portfolioPanel`

### 4. `stock-detail-panel.js` - 股票详情面板功能
**功能**：
- 股票详情展示
- K线图表
- 布林带指标
- 返回交易面板

**主要类**：`StockDetailPanel`
**全局实例**：`stockDetailPanel`

### 5. `modal-handlers.js` - 模态框处理功能
**功能**：
- 交易模态框
- 新建投资组合模态框
- 新增持仓模态框
- 模态框状态管理

**主要类**：`ModalHandlers`
**全局实例**：`modalHandlers`

### 6. `main.js` - 核心功能（保留）
**功能**：
- 面板切换逻辑
- 应用初始化
- 全局事件绑定
- 投资组合按钮管理

## 文件加载顺序

在 `index.html` 中的加载顺序：

```html
<script src="js/api-service.js"></script>
<script src="js/home-panel.js"></script>
<script src="js/trading-panel.js"></script>
<script src="js/portfolio-panel.js"></script>
<script src="js/stock-detail-panel.js"></script>
<script src="js/modal-handlers.js"></script>
<script src="js/main.js"></script>
```

## 模块间通信

### 1. 全局函数调用
各模块通过全局函数进行通信：
- `showStockDetail(symbol)` - 显示股票详情
- `backToTradingPanel()` - 返回交易面板
- `switchPanel(panelId)` - 切换面板
- `showTradeModal(assetId, price)` - 显示交易模态框

### 2. 实例访问
模块间可以通过全局实例访问：
- `homePanel` - 首页面板实例
- `tradingPanel` - 交易面板实例
- `portfolioPanel` - 投资组合面板实例
- `stockDetailPanel` - 股票详情面板实例
- `modalHandlers` - 模态框处理实例

## 初始化流程

1. **DOM加载完成** → 各模块开始初始化
2. **组件加载完成** → `appInit()` 被调用
3. **面板切换** → 默认显示首页面板
4. **图表初始化** → 各模块的图表开始初始化

## 优势

### 1. 模块化
- 每个功能模块独立管理
- 代码职责清晰
- 便于维护和扩展

### 2. 可维护性
- 代码结构清晰
- 减少文件大小
- 便于定位问题

### 3. 可扩展性
- 新增功能只需添加新模块
- 不影响现有功能
- 便于团队协作

### 4. 性能优化
- 按需加载模块
- 减少内存占用
- 提高加载速度

## 注意事项

### 1. 依赖关系
- `main.js` 最后加载，确保其他模块已初始化
- 各模块间通过全局函数通信
- 避免循环依赖

### 2. 函数冲突处理
- 避免不同模块中定义相同名称的全局函数
- 如果出现冲突，后加载的模块会覆盖先加载的模块
- 例如：`modal-handlers.js` 和 `trading-panel.js` 都定义了 `confirmTrade()` 函数
- 解决方案：在 `modal-handlers.js` 中移除重复的函数定义

### 3. 错误处理
- 各模块独立处理错误
- 提供友好的错误提示
- 保持应用稳定性

### 4. 兼容性
- 保持原有的HTML调用方式
- 确保向后兼容
- 避免破坏现有功能

## 测试建议

### 1. 功能测试
- 测试各面板切换
- 测试交易功能
- 测试图表显示

### 2. 性能测试
- 测试页面加载速度
- 测试内存使用情况
- 测试响应时间

### 3. 兼容性测试
- 测试不同浏览器
- 测试不同设备
- 测试网络环境

## 修复记录

### 买入功能修复 (2024-01-XX)
**问题**：代码分离后，买入功能无法正常工作
**原因**：`modal-handlers.js` 和 `trading-panel.js` 都定义了 `confirmTrade()` 函数，导致函数冲突
**解决方案**：
1. 移除 `modal-handlers.js` 中的 `confirmTrade()` 方法
2. 移除 `modal-handlers.js` 中的全局 `confirmTrade()` 函数
3. 更新 `modal-handlers.js` 中的 `showTradeModalFromTrade()` 方法，正确设置模态框数据
4. 确保 `trading-panel.js` 中的 `confirmTrade()` 函数被正确调用

### 投资组合选项修复 (2024-01-XX)
**问题**：买入弹窗中的投资组合选项显示的是硬编码的列表，而不是用户实际持有的投资组合
**原因**：`modal-handlers.js` 中的 `showTradeModalFromTrade()` 方法使用硬编码的 `this.portfolioList`，没有调用后端API
**解决方案**：
1. 修改 `showTradeModalFromTrade()` 方法为异步方法，调用 `apiService.getPortfolioNames()` 获取真实数据
2. 添加错误处理和后备方案，如果API调用失败则使用默认列表
3. 更新 `createNewPortfolioFromTrade()` 方法，调用 `apiService.createPortfolio()` 创建投资组合
4. 添加 `reloadPortfolioOptions()` 方法，用于重新加载投资组合列表
5. 更新相关函数为异步函数，确保正确的异步调用链

## 后续优化

### 1. 进一步模块化
- 将API调用进一步分离
- 创建通用工具模块
- 添加状态管理

### 2. 性能优化
- 实现懒加载
- 优化图表渲染
- 减少DOM操作

### 3. 代码质量
- 添加TypeScript支持
- 完善错误处理
- 添加单元测试 