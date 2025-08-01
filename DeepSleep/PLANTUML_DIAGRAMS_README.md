# DeepSleep Investment Management System - PlantUML Diagrams

本项目包含DeepSleep投资组合管理系统的完整系统流程图和架构图，使用PlantUML绘制。

## 📊 图表说明

### 1. 系统流程图 (`system_flow.puml`)
展示了用户与系统交互的完整流程，包括：
- **用户认证和首页仪表板**：用户登录、获取用户信息、显示总资产
- **资产交易**：搜索资产、购买资产
- **投资组合管理**：查看投资组合、查看持仓详情、卖出资产
- **资产详情和分析**：查看资产详情、查看价格历史
- **利润跟踪**：获取利润数据、资产配置分析

### 2. 系统架构图 (`system_architecture.puml`)
展示了系统的整体架构和组件关系，包括：
- **前端层 (fe/)**：HTML组件、JavaScript模块、样式文件
- **后端层 (portfolio_be/)**：Flask应用、路由、模型、工具类
- **数据库层 (Data/)**：MySQL数据库、数据管理脚本
- **外部库**：TailwindCSS、ECharts、Font Awesome、Flask、MySQL

### 3. 数据库关系图 (`database_schema.puml`)
展示了数据库的表结构和关系：
- **assets表**：存储股票、债券、现金的历史价格数据
- **portfolio表**：跟踪用户在不同投资组合中的持仓
- **user_info表**：存储用户账户信息和可用资金
- **表关系**：用户与投资组合的一对多关系，资产与投资组合的多对多关系

### 4. API接口图 (`api_interfaces.puml`)
展示了系统的所有API端点和功能：
- **用户管理API**：获取用户信息
- **资产管理API**：总资产、资产配置、资产详情、搜索、买卖
- **投资组合管理API**：获取投资组合名称、创建投资组合、获取详情
- **利润跟踪API**：获取利润、历史利润

## 🚀 如何使用

### 在线查看
1. 访问 [PlantUML在线编辑器](http://www.plantuml.com/plantuml/uml/)
2. 复制对应的`.puml`文件内容
3. 粘贴到编辑器中查看图表

### 本地生成
1. 安装PlantUML：
   ```bash
   # 需要Java环境
   java -jar plantuml.jar system_flow.puml
   ```

2. 使用VS Code插件：
   - 安装PlantUML插件
   - 打开`.puml`文件
   - 按`Alt+Shift+P`选择"PlantUML: Preview Current Diagram"

## 📋 系统功能概述

### 前端功能
- **首页仪表板**：显示用户信息、总资产、利润、资产配置
- **交易界面**：搜索资产、购买资产
- **投资组合管理**：查看投资组合、管理持仓
- **资产详情**：查看资产信息和价格历史
- **响应式设计**：使用TailwindCSS实现现代化UI

### 后端功能
- **用户管理**：用户信息查询
- **资产管理**：资产搜索、买卖、详情查询
- **投资组合管理**：投资组合创建、查询、持仓管理
- **利润计算**：实时利润计算和历史利润查询
- **数据持久化**：MySQL数据库存储

### 数据库设计
- **assets表**：存储股票、债券、现金的OHLC价格数据
- **portfolio表**：记录用户在不同投资组合中的持仓数量
- **user_info表**：存储用户基本信息和可用资金

## 🔧 技术栈

### 前端
- HTML5 + CSS3 + JavaScript
- TailwindCSS (样式框架)
- ECharts (图表库)
- Font Awesome (图标库)

### 后端
- Python Flask (Web框架)
- MySQL (数据库)
- SQLAlchemy (ORM，可选)

### 开发工具
- PlantUML (图表绘制)
- Git (版本控制)

## 📝 使用说明

1. **启动后端服务**：
   ```bash
   cd portfolio_be
   python run.py
   ```

2. **访问前端**：
   - 打开`fe/index.html`文件
   - 或使用本地服务器

3. **查看图表**：
   - 使用PlantUML工具查看`.puml`文件
   - 或在线查看生成的图表

## 🤝 贡献

如需修改或添加新的图表，请：
1. 编辑对应的`.puml`文件
2. 更新此README文件
3. 确保图表清晰易懂

## 📄 许可证

本项目采用MIT许可证。 