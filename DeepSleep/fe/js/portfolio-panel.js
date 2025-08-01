// Portfolio Panel 功能模块
class PortfolioPanel {
  constructor() {
    this.currentPortfolios = [];
    this.currentHoldings = [];
    this.selectedPortfolio = null;
    this.isLoading = false;
    this.init();
  }

  // 初始化
  async init() {
    console.log('PortfolioPanel 初始化开始');
    await this.loadPortfolioData();
    console.log('PortfolioPanel 初始化完成');
  }

  // 设置投资组合按钮监听器
  setupPortfolioButtons() {
    const portfolioButtons = document.querySelectorAll('.portfolio-btn');
    console.log(`setupPortfolioButtons: 找到 ${portfolioButtons.length} 个投资组合按钮`);

    portfolioButtons.forEach((btn, index) => {
      console.log(`绑定按钮 ${index}:`, btn.textContent, btn.dataset.portfolio);

      // 移除之前的事件监听器（如果有的话）
      if (this._handleButtonClick) {
        btn.removeEventListener('click', this._handleButtonClick);
      }

      // 保存this引用
      const self = this;

      // 创建事件处理函数，使用箭头函数保持this上下文
      this._handleButtonClick = (e) => {
        try {
          console.log('=== 按钮点击事件开始 ===');
          console.log('按钮点击事件触发:', e.target);
          console.log('this上下文:', this);
          console.log('self引用:', self);
          console.log('this类型:', typeof this);
          console.log('this是否为PortfolioPanel实例:', this instanceof PortfolioPanel);

          // 确保传递的是按钮元素本身
          const button = e.target.closest('.portfolio-btn') || e.target;
          console.log('处理按钮:', button.textContent, button.dataset.portfolio);

          // 添加简单的测试
          if (button && button.dataset.portfolio) {
            console.log('✅ 按钮数据有效，调用handlePortfolioSelection');
            // 使用self而不是this
            self.handlePortfolioSelection(button);
          } else {
            console.error('❌ 按钮数据无效:', button);
          }
          console.log('=== 按钮点击事件结束 ===');
        } catch (error) {
          console.error('按钮点击处理出错:', error);
          console.error('错误堆栈:', error.stack);
        }
      };

      btn.addEventListener('click', this._handleButtonClick);

      // 添加一个简单的测试点击
      console.log(`为按钮 ${index} 添加了点击监听器`);
    });
  }

  // 处理投资组合选择
  async handlePortfolioSelection(button) {
    console.log('=== 投资组合选择开始 ===');
    console.log('投资组合选择按钮被点击:', button.textContent);
    console.log('按钮元素:', button);
    console.log('按钮dataset:', button.dataset);
    console.log('this对象:', this);
    console.log('当前选中的投资组合:', this.selectedPortfolio);

    // 更新按钮状态
    document.querySelectorAll('.portfolio-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-blue-600', 'text-white');
      btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    button.classList.add('active', 'bg-blue-600', 'text-white');
    button.classList.remove('bg-gray-100', 'text-gray-700');

    // 获取选中的投资组合名称
    const portfolioName = button.dataset.portfolio;
    this.selectedPortfolio = portfolioName;
    console.log('选中的投资组合:', portfolioName);

    // 更新当前投资组合名称显示
    const currentPortfolioNameElement = document.getElementById('currentPortfolioName');
    if (currentPortfolioNameElement) {
      currentPortfolioNameElement.textContent = portfolioName;
    }

    // 加载该投资组合的持仓数据
    console.log('开始加载持仓数据...');
    await this.loadPortfolioHoldings(portfolioName);
    console.log('持仓数据加载完成');
    console.log('=== 投资组合选择完成 ===');
  }

  // 加载投资组合数据
  async loadPortfolioData() {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      console.log('开始加载投资组合数据...');
      console.log('当前用户ID:', apiService.currentUserId);

      // 获取用户的所有投资组合
      const response = await apiService.getPortfolioNames();

      console.log('投资组合API响应:', response);

      if (response.code === 200 && response.data && response.data.portfolios) {
        const oldPortfolios = this.currentPortfolios;
        this.currentPortfolios = response.data.portfolios;
        console.log('当前投资组合:', this.currentPortfolios);

        // 检查是否有新的投资组合
        const newPortfolio = this.currentPortfolios.find(p => !oldPortfolios.includes(p));
        if (newPortfolio) {
          console.log(`发现新投资组合: ${newPortfolio}`);
          this.selectedPortfolio = newPortfolio;
        } else if (this.currentPortfolios.length > 0 && !this.selectedPortfolio) {
          // 如果没有选中的投资组合，选择第一个
          this.selectedPortfolio = this.currentPortfolios[0];
        }

        this.renderPortfolioButtons();

        // 加载选中的投资组合数据
        if (this.selectedPortfolio) {
          await this.loadPortfolioHoldings(this.selectedPortfolio);
        } else {
          console.log('没有找到投资组合数据');
          this.showError('没有找到投资组合数据');
        }
      } else {
        console.error('API响应格式错误:', response);
        this.showError('无法加载投资组合数据');
      }
    } catch (error) {
      console.error('加载投资组合数据出错:', error);
      this.showError('加载投资组合数据时发生错误');
    } finally {
      this.isLoading = false;
    }
  }

  // 渲染投资组合按钮
  renderPortfolioButtons() {
    // 尝试多个选择器来找到按钮容器
    let buttonsContainer = document.querySelector('#portfolioPanel .flex.gap-4.mb-6.overflow-x-auto.py-2');
    if (!buttonsContainer) {
      buttonsContainer = document.querySelector('#portfolioPanel .flex.gap-4.mb-6.overflow-x-auto');
    }
    if (!buttonsContainer) {
      buttonsContainer = document.querySelector('#portfolioPanel .flex.gap-4.mb-6');
    }

    if (!buttonsContainer) {
      console.error('找不到投资组合按钮容器');
      return;
    }

    console.log('渲染投资组合按钮，当前投资组合:', this.currentPortfolios);
    console.log('选中的投资组合:', this.selectedPortfolio);

    let buttonsHTML = '';
    this.currentPortfolios.forEach((portfolio, index) => {
      // 如果有选中的投资组合，使用它；否则使用第一个
      const isActive = (this.selectedPortfolio && portfolio === this.selectedPortfolio) ||
        (!this.selectedPortfolio && index === 0) ?
        'active bg-blue-600 text-white' : 'bg-gray-100 text-gray-700';

      console.log(`按钮 ${index}: ${portfolio}, 活跃状态: ${isActive}`);

      buttonsHTML += `
                <button class="px-5 py-2.5 rounded-xl font-medium portfolio-btn ${isActive}" 
                        data-portfolio="${portfolio}"
                        onclick="console.log('内联点击事件触发:', '${portfolio}'); portfolioPanel && portfolioPanel.handlePortfolioSelection(this);">${portfolio}</button>
            `;
    });

    buttonsContainer.innerHTML = buttonsHTML;
    console.log('按钮HTML已设置，开始绑定事件监听器');

    // 重新绑定事件监听器
    this.setupPortfolioButtons();

    // 测试事件绑定
    setTimeout(() => {
      const testButtons = document.querySelectorAll('.portfolio-btn');
      console.log(`测试：找到 ${testButtons.length} 个投资组合按钮`);
      testButtons.forEach((btn, index) => {
        console.log(`测试按钮 ${index}:`, btn.textContent, btn.dataset.portfolio);
      });
    }, 100);
  }

  // 加载投资组合持仓数据
  async loadPortfolioHoldings(portfolioName) {
    if (!portfolioName) return;

    // 清空当前持仓数据，避免显示旧数据
    this.currentHoldings = [];
    await this.renderHoldingsTable();

    try {
      console.log(`开始加载投资组合持仓: ${portfolioName}`);
      const response = await apiService.getPortfolioDetails(portfolioName);

      console.log('持仓API响应:', response);

      if (response.code === 200) {
        this.currentHoldings = response.data || [];
        console.log('当前持仓:', this.currentHoldings);
        await this.renderHoldingsTable();
        await this.updatePortfolioSummary();
      } else {
        console.error('持仓API返回错误:', response);
        this.showHoldingsError('无法加载持仓数据');
      }
    } catch (error) {
      console.error('加载持仓数据出错:', error);
      this.showHoldingsError('加载持仓数据时发生错误');
    }
  }

  // 渲染持仓表格
  async renderHoldingsTable() {
    const tbody = document.querySelector('#portfolioPanel tbody');
    if (!tbody) return;

    if (!this.currentHoldings || this.currentHoldings.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        该投资组合暂无持仓
                    </td>
                </tr>
            `;
      return;
    }

    let holdingsHTML = '';

    for (const holding of this.currentHoldings) {
      try {
        console.log(`处理持仓: ${holding.asset_id}, 数量: ${holding.quantity}`);

        // 检查asset_id是否有效
        if (!holding.asset_id || holding.asset_id === 'null' || holding.asset_id === 'undefined') {
          console.warn(`跳过无效的asset_id: ${holding.asset_id}`);
          continue;
        }

        // 获取资产详情和当前价格
        const assetResponse = await apiService.getAssetDetail(holding.asset_id);
        if (assetResponse.code === 200) {
          const asset = assetResponse.data;
          console.log(`资产详情:`, asset);

          // 获取当前价格数据
          const currentDate = apiService.getCurrentDate();
          console.log(`获取价格数据，日期: ${currentDate}, 资产: ${holding.asset_id}`);
          const priceResponse = await apiService.searchAssets(holding.asset_id, currentDate);
          console.log(`价格响应:`, priceResponse);

          let currentPrice = 0;
          let openPrice = 0;
          let closePrice = 0;

          if (priceResponse.code === 200 && priceResponse.data && priceResponse.data.length > 0) {
            const priceData = priceResponse.data[0];
            currentPrice = parseFloat(priceData.close_price);
            openPrice = parseFloat(priceData.open_price);
            closePrice = parseFloat(priceData.close_price);
            console.log(`价格数据: 当前=${currentPrice}, 开盘=${openPrice}, 收盘=${closePrice}`);
          } else {
            console.warn(`未找到资产 ${holding.asset_id} 的价格数据`);
          }

          // 计算市值和变化
          const marketValue = currentPrice * holding.quantity;
          const change = this.calculatePriceChange(closePrice, openPrice);
          const changeClass = change.percentage >= 0 ? 'positive-change' : 'negative-change';

          holdingsHTML += `
                        <tr class="border-b border-gray-100">
                            <td class="py-4">
                                <div class="flex items-center">
                                    <div>
                                        <p class="font-semibold text-gray-800">${asset.name}</p>
                                        <p class="text-sm text-gray-500">${asset.asset_id}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="text-right align-middle py-4 font-medium">${holding.quantity}</td>
                            <td class="text-right align-middle py-4 font-bold">$${apiService.formatPrice(currentPrice)}</td>
                            <td class="text-right align-middle py-4 font-bold">$${apiService.formatPrice(marketValue)}</td>
                            <td class="text-right align-middle py-4 font-medium ${changeClass}">${apiService.formatPercentage(change.percentage)}</td>
                            <td class="text-right align-middle py-4">
                                <button class="px-3 py-1 bg-red-500 text-white rounded-md" 
                                        onclick="portfolioPanel.showSellModal('${asset.asset_id}', ${currentPrice})">
                                    Sell
                                </button>
                            </td>
                        </tr>
                    `;
        }
      } catch (error) {
        console.error(`获取资产 ${holding.asset_id} 详情出错:`, error);
      }
    }

    tbody.innerHTML = holdingsHTML;
  }

  // 更新投资组合摘要
  async updatePortfolioSummary() {
    if (!this.currentHoldings || this.currentHoldings.length === 0) {
      this.updateSummaryCards(0, 0);
      return;
    }

    let totalValue = 0;
    let totalChange = 0;

    for (const holding of this.currentHoldings) {
      try {
        console.log(`计算摘要 - 资产: ${holding.asset_id}`);
        // 获取当前价格数据
        const currentDate = apiService.getCurrentDate();
        const priceResponse = await apiService.searchAssets(holding.asset_id, currentDate);

        if (priceResponse.code === 200 && priceResponse.data && priceResponse.data.length > 0) {
          const priceData = priceResponse.data[0];
          const currentPrice = parseFloat(priceData.close_price);
          const openPrice = parseFloat(priceData.open_price);

          const marketValue = currentPrice * holding.quantity;
          const dailyChange = (currentPrice - openPrice) * holding.quantity;

          totalValue += marketValue;
          totalChange += dailyChange;

          console.log(`资产 ${holding.asset_id}: 市值=${marketValue}, 日变化=${dailyChange}`);
        } else {
          console.warn(`摘要计算 - 未找到资产 ${holding.asset_id} 的价格数据`);
        }
      } catch (error) {
        console.error(`获取资产 ${holding.asset_id} 价格出错:`, error);
      }
    }

    this.updateSummaryCards(totalValue, totalChange);
  }

  // 更新摘要卡片
  updateSummaryCards(totalValue, totalChange) {
    // 更新总价值
    const totalValueElement = document.getElementById('total-value');
    if (totalValueElement) {
      totalValueElement.textContent = `$${apiService.formatPrice(totalValue)}`;
    }

    // 更新今日变化
    const todayChangeElement = document.getElementById('today-change');
    if (todayChangeElement) {
      const changeClass = totalChange >= 0 ? 'text-green-500' : 'text-red-500';
      const changeIcon = totalChange >= 0 ? 'mdi:trending-up' : 'mdi:trending-down';
      todayChangeElement.innerHTML = `
                 <iconify-icon icon="${changeIcon}" class="text-xl ${changeClass} mr-1"></iconify-icon>
                 <span class="text-2xl font-bold text-gray-900">$${apiService.formatPrice(totalChange)}</span>
             `;
    }

    // 更新总回报率 - 暂时注释掉
    // const returnElement = document.getElementById('total-return');
    // if (returnElement) {
    //   const returnClass = totalChangePercent >= 0 ? 'text-green-500' : 'text-red-500';
    //   const returnIcon = totalChangePercent >= 0 ? 'mdi:arrow-top-right-thick' : 'mdi:arrow-bottom-right-thick';
    //   returnElement.innerHTML = `
    //             <iconify-icon icon="${returnIcon}" class="text-xl ${returnClass} mr-1"></iconify-icon>
    //             <span class="text-2xl font-bold text-gray-900">${apiService.formatPercentage(totalChangePercent)}</span>
    //         `;
    // }
  }

  // 计算价格变化
  calculatePriceChange(currentPrice, previousPrice) {
    const current = parseFloat(currentPrice);
    const previous = parseFloat(previousPrice);
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: change,
      absolute: current - previous
    };
  }

  // 显示卖出模态框
  async showSellModal(assetId, price) {
    // 获取当前持仓信息
    const holding = this.currentHoldings.find(h => h.asset_id === assetId);
    if (!holding) {
      alert('未找到该资产的持仓信息');
      return;
    }

    // 显示卖出模态框
    const modal = document.getElementById('sellModal');
    if (modal) {
      modal.classList.add('show');

      // 存储交易信息
      modal.dataset.assetId = assetId;
      modal.dataset.price = price;
      modal.dataset.quantity = holding.quantity;
      modal.dataset.portfolioName = this.selectedPortfolio;

      // 更新模态框信息
      await this.updateSellModalInfo(assetId, price, holding.quantity);

      // 添加数量输入监听器，实时计算预估价值
      this.setupSellQuantityListener();
    }
  }

  // 更新卖出模态框信息
  async updateSellModalInfo(assetId, price, maxQuantity) {
    const modal = document.getElementById('sellModal');
    if (!modal) return;

    // 获取资产详细信息
    try {
      const assetResponse = await apiService.getAssetDetail(assetId);
      if (assetResponse.code === 200 && assetResponse.data) {
        const asset = assetResponse.data;

        // 更新标题
        const title = modal.querySelector('#modal-sell-name');
        if (title) {
          title.textContent = `${asset.name} (${assetId})`;
        }
      }
    } catch (error) {
      console.error('获取资产详情失败:', error);
      // 如果获取详情失败，使用资产ID作为标题
      const title = modal.querySelector('#modal-sell-name');
      if (title) {
        title.textContent = `${assetId}`;
      }
    }

    // 更新价格显示
    const priceElement = modal.querySelector('#modal-sell-price');
    if (priceElement) {
      priceElement.textContent = apiService.formatPrice(price);
    }

    // 设置最大可卖数量
    const quantityInput = modal.querySelector('#sell-quantity-input');
    if (quantityInput) {
      quantityInput.max = maxQuantity;
      quantityInput.value = maxQuantity;
      quantityInput.min = 1;
    }

    // 显示持仓信息
    const holdingInfo = modal.querySelector('#holding-info');
    if (holdingInfo) {
      holdingInfo.textContent = `当前持仓: ${maxQuantity} 股`;
    }

    // 更新预估价值
    this.updateSellEstimatedValue(price, maxQuantity);
  }

  // 设置卖出数量监听器
  setupSellQuantityListener() {
    const quantityInput = document.getElementById('sell-quantity-input');
    const modal = document.getElementById('sellModal');

    if (quantityInput && modal) {
      const price = parseFloat(modal.dataset.price);
      const maxQuantity = parseInt(modal.dataset.quantity);

      // 移除之前的监听器
      quantityInput.removeEventListener('input', this._sellQuantityHandler);

      // 创建新的监听器
      this._sellQuantityHandler = (e) => {
        let quantity = parseInt(e.target.value);

        // 验证数量
        if (quantity > maxQuantity) {
          quantity = maxQuantity;
          e.target.value = maxQuantity;
        } else if (quantity < 1) {
          quantity = 1;
          e.target.value = 1;
        }

        // 更新预估价值
        this.updateSellEstimatedValue(price, quantity);
      };

      quantityInput.addEventListener('input', this._sellQuantityHandler);

      // 添加快速选择按钮事件
      this.setupQuickSelectButtons(maxQuantity);
    }
  }

  // 设置快速选择按钮
  setupQuickSelectButtons(maxQuantity) {
    // 添加快速选择按钮到模态框
    const quantityContainer = document.querySelector('#sellModal .relative');
    if (quantityContainer && !document.getElementById('quick-select-buttons')) {
      const quickSelectDiv = document.createElement('div');
      quickSelectDiv.id = 'quick-select-buttons';
      quickSelectDiv.className = 'flex gap-2 mt-2';

      const percentages = [25, 50, 75, 100];
      percentages.forEach(percent => {
        const quantity = Math.floor(maxQuantity * percent / 100);
        if (quantity > 0) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200';
          button.textContent = `${percent}%`;
          button.onclick = () => {
            const input = document.getElementById('sell-quantity-input');
            if (input) {
              input.value = quantity;
              input.dispatchEvent(new Event('input'));
            }
          };
          quickSelectDiv.appendChild(button);
        }
      });

      quantityContainer.appendChild(quickSelectDiv);
    }
  }

  // 验证卖出交易
  validateSellTransaction(assetId, price, maxQuantity, portfolioName, quantityInput) {
    // 检查基本信息
    if (!assetId || !price || !maxQuantity || !portfolioName || !quantityInput) {
      return {
        isValid: false,
        message: '交易信息不完整',
        quantity: 0
      };
    }

    // 检查价格
    if (price <= 0) {
      return {
        isValid: false,
        message: '价格信息无效',
        quantity: 0
      };
    }

    // 检查数量
    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity <= 0) {
      return {
        isValid: false,
        message: '请输入有效的卖出数量',
        quantity: 0
      };
    }

    if (quantity > maxQuantity) {
      return {
        isValid: false,
        message: `卖出数量不能超过当前持仓 (${maxQuantity} 股)`,
        quantity: 0
      };
    }

    // 检查是否为零持仓
    if (maxQuantity === 0) {
      return {
        isValid: false,
        message: '当前没有该资产的持仓',
        quantity: 0
      };
    }

    return {
      isValid: true,
      message: '',
      quantity: quantity
    };
  }

  // 更新卖出预估价值
  updateSellEstimatedValue(price, quantity) {
    const estimatedValueElement = document.getElementById('sell-estimated-value');
    if (estimatedValueElement) {
      const estimatedValue = price * quantity;
      estimatedValueElement.textContent = `$${apiService.formatPrice(estimatedValue)}`;
    }
  }

  // 确认卖出交易
  async confirmSell() {
    const modal = document.getElementById('sellModal');
    if (!modal) return;

    const assetId = modal.dataset.assetId;
    const price = parseFloat(modal.dataset.price);
    const maxQuantity = parseInt(modal.dataset.quantity);
    const portfolioName = modal.dataset.portfolioName;
    const quantityInput = document.getElementById('sell-quantity-input');

    // 验证交易信息
    const validation = this.validateSellTransaction(assetId, price, maxQuantity, portfolioName, quantityInput);
    if (!validation.isValid) {
      this.showErrorMessage(validation.message);
      return;
    }

    const quantity = validation.quantity;

    // 获取确认按钮，在try块外定义
    const confirmBtn = modal.querySelector('button[onclick="executeSell()"]');

    try {
      // 显示加载状态
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> 处理中...';
      }

      // 调用卖出API
      const response = await apiService.sellAsset(assetId, quantity, portfolioName);

      if (response.code === 200) {
        // 显示成功消息
        this.showSuccessMessage(`成功卖出 ${quantity} 股 ${assetId}！`);
        this.closeSellModal();

        // 刷新持仓数据
        await this.loadPortfolioHoldings(portfolioName);

        // 刷新投资组合摘要
        await this.updatePortfolioSummary();

        // 更新用户资金信息（如果有相关显示）
        this.updateUserFundsInfo();
      } else {
        this.showErrorMessage(`卖出失败: ${response.message}`);
      }
    } catch (error) {
      console.error('卖出交易出错:', error);
      this.showErrorMessage('卖出交易时发生错误，请重试');
    } finally {
      // 恢复按钮状态
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<iconify-icon icon="mdi:cash-minus" class="mr-2"></iconify-icon>确认卖出';
      }
    }
  }

  // 显示成功消息
  showSuccessMessage(message) {
    // 创建成功消息元素
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
      <div class="flex items-center">
        <iconify-icon icon="mdi:check-circle" class="mr-2"></iconify-icon>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(successDiv);

    // 3秒后自动移除
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 3000);
  }

  // 显示错误消息
  showErrorMessage(message) {
    // 创建错误消息元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <iconify-icon icon="mdi:alert-circle" class="mr-2"></iconify-icon>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(errorDiv);

    // 5秒后自动移除
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  // 更新用户资金信息
  async updateUserFundsInfo() {
    try {
      // 获取用户信息
      const userResponse = await apiService.getUserInfo();
      if (userResponse.code === 200 && userResponse.data) {
        // 更新页面上的资金显示（如果存在）
        const fundsElements = document.querySelectorAll('[data-user-funds]');
        fundsElements.forEach(element => {
          element.textContent = `$${apiService.formatPrice(userResponse.data.available_funds)}`;
        });

        console.log('用户资金信息已更新');
      }
    } catch (error) {
      console.error('更新用户资金信息失败:', error);
    }
  }

  // 关闭卖出模态框
  closeSellModal() {
    const modal = document.getElementById('sellModal');
    if (modal) {
      modal.classList.remove('show');

      // 移除数量输入监听器
      const quantityInput = document.getElementById('sell-quantity-input');
      if (quantityInput && this._sellQuantityHandler) {
        quantityInput.removeEventListener('input', this._sellQuantityHandler);
      }

      // 清理数据
      delete modal.dataset.assetId;
      delete modal.dataset.price;
      delete modal.dataset.quantity;
      delete modal.dataset.portfolioName;
    }
  }

  // 显示错误信息
  showError(message) {
    const container = document.querySelector('#portfolioPanel .flex.gap-4.mb-6');
    if (container) {
      container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-red-500">${message}</p>
                    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg" onclick="portfolioPanel.loadPortfolioData()">
                        重试
                    </button>
                </div>
            `;
    }
  }

  // 显示持仓错误信息
  showHoldingsError(message) {
    const tbody = document.querySelector('#portfolioPanel tbody');
    if (tbody) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8">
                        <p class="text-red-500">${message}</p>
                        <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg" onclick="portfolioPanel.loadPortfolioHoldings('${this.selectedPortfolio}')">
                            重试
                        </button>
                    </td>
                </tr>
            `;
    }
  }

  // 刷新数据
  async refresh() {
    // 如果当前有选中的投资组合，只刷新该投资组合的数据
    if (this.selectedPortfolio) {
      await this.loadPortfolioHoldings(this.selectedPortfolio);
    } else {
      // 否则重新加载所有数据
      await this.loadPortfolioData();
    }
  }

  // 强制刷新所有数据
  async forceRefresh() {
    await this.loadPortfolioData();
  }

  // 显示创建投资组合模态框
  showCreatePortfolioModal() {
    const modal = document.getElementById('newPortfolioModal');
    if (modal) {
      // 重置模态框状态
      this.resetCreatePortfolioModal();

      // 显示模态框
      modal.style.display = 'flex';

      // 聚焦到输入框
      const nameInput = modal.querySelector('#newPortfolioName');
      if (nameInput) {
        nameInput.focus();
      }

      // 添加键盘事件监听器
      this.setupCreatePortfolioKeyboardEvents();
    } else {
      console.error('找不到newPortfolioModal元素');
      this.showErrorMessage('无法打开创建投资组合对话框');
    }
  }

  // 重置创建投资组合模态框
  resetCreatePortfolioModal() {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) return;

    // 清空输入框
    const nameInput = modal.querySelector('#newPortfolioName');
    if (nameInput) {
      nameInput.value = '';
      nameInput.classList.remove('border-red-500', 'border-green-500');
    }

    // 重置按钮状态
    const createBtn = modal.querySelector('button[onclick="createNewPortfolio()"]');
    if (createBtn) {
      createBtn.disabled = false;
      createBtn.innerHTML = '<iconify-icon icon="mdi:plus" class="mr-2"></iconify-icon>Create Portfolio';
    }

    // 清除错误信息
    this.clearCreatePortfolioError();
  }

  // 设置创建投资组合键盘事件
  setupCreatePortfolioKeyboardEvents() {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) return;

    const nameInput = modal.querySelector('#newPortfolioName');
    if (!nameInput) return;

    // 移除之前的事件监听器
    nameInput.removeEventListener('keydown', this._createPortfolioKeyHandler);

    // 创建新的键盘事件处理器
    this._createPortfolioKeyHandler = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.createNewPortfolio();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.closeCreatePortfolioModal();
      }
    };

    nameInput.addEventListener('keydown', this._createPortfolioKeyHandler);
  }

  // 验证投资组合名称
  validatePortfolioName(name) {
    const trimmedName = name.trim();

    // 检查是否为空
    if (!trimmedName) {
      return {
        isValid: false,
        message: '投资组合名称不能为空',
        field: 'name'
      };
    }

    // 检查长度
    if (trimmedName.length < 2) {
      return {
        isValid: false,
        message: '投资组合名称至少需要2个字符',
        field: 'name'
      };
    }

    if (trimmedName.length > 50) {
      return {
        isValid: false,
        message: '投资组合名称不能超过50个字符',
        field: 'name'
      };
    }

    // 检查特殊字符
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmedName)) {
      return {
        isValid: false,
        message: '投资组合名称不能包含特殊字符: < > : " / \\ | ? *',
        field: 'name'
      };
    }

    // 检查是否已存在
    if (this.currentPortfolios.includes(trimmedName)) {
      return {
        isValid: false,
        message: `投资组合 "${trimmedName}" 已存在`,
        field: 'name'
      };
    }

    return {
      isValid: true,
      message: '',
      field: 'name'
    };
  }

  // 显示创建投资组合错误信息
  showCreatePortfolioError(message) {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) return;

    // 移除之前的错误信息
    this.clearCreatePortfolioError();

    // 创建错误信息元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mt-2 p-3 bg-red-50 border border-red-200 rounded-lg';
    errorDiv.innerHTML = `
      <div class="flex items-center text-red-700">
        <iconify-icon icon="mdi:alert-circle" class="mr-2"></iconify-icon>
        <span class="text-sm">${message}</span>
      </div>
    `;

    // 插入到输入框后面
    const nameInput = modal.querySelector('#newPortfolioName');
    if (nameInput) {
      nameInput.classList.add('border-red-500');
      nameInput.parentNode.insertBefore(errorDiv, nameInput.nextSibling);
    }
  }

  // 清除创建投资组合错误信息
  clearCreatePortfolioError() {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) return;

    // 移除错误信息元素
    const errorDiv = modal.querySelector('.bg-red-50');
    if (errorDiv) {
      errorDiv.remove();
    }

    // 移除输入框错误样式
    const nameInput = modal.querySelector('#newPortfolioName');
    if (nameInput) {
      nameInput.classList.remove('border-red-500');
    }
  }

  // 显示创建投资组合成功信息
  showCreatePortfolioSuccess(message) {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) return;

    // 移除之前的错误信息
    this.clearCreatePortfolioError();

    // 创建成功信息元素
    const successDiv = document.createElement('div');
    successDiv.className = 'mt-2 p-3 bg-green-50 border border-green-200 rounded-lg';
    successDiv.innerHTML = `
      <div class="flex items-center text-green-700">
        <iconify-icon icon="mdi:check-circle" class="mr-2"></iconify-icon>
        <span class="text-sm">${message}</span>
      </div>
    `;

    // 插入到输入框后面
    const nameInput = modal.querySelector('#newPortfolioName');
    if (nameInput) {
      nameInput.classList.add('border-green-500');
      nameInput.parentNode.insertBefore(successDiv, nameInput.nextSibling);
    }
  }

  // 创建新投资组合
  async createNewPortfolio() {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) {
      this.showErrorMessage('无法访问创建投资组合对话框');
      return;
    }

    const nameInput = modal.querySelector('#newPortfolioName');
    if (!nameInput) {
      this.showErrorMessage('无法找到投资组合名称输入框');
      return;
    }

    const portfolioName = nameInput.value.trim();

    // 验证投资组合名称
    const validation = this.validatePortfolioName(portfolioName);
    if (!validation.isValid) {
      this.showCreatePortfolioError(validation.message);
      return;
    }

    // 清除之前的错误信息
    this.clearCreatePortfolioError();

    // 获取创建按钮
    const createBtn = modal.querySelector('button[onclick="createNewPortfolio()"]');
    if (!createBtn) {
      this.showErrorMessage('无法找到创建按钮');
      return;
    }

    try {
      // 显示加载状态
      createBtn.disabled = true;
      createBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> 创建中...';

      // 显示成功信息
      this.showCreatePortfolioSuccess('正在创建投资组合...');

      // 调用创建投资组合API
      const response = await apiService.createPortfolio(portfolioName);

      if (response.code === 200) {
        // 显示成功信息
        this.showCreatePortfolioSuccess(`投资组合 "${portfolioName}" 创建成功！`);

        // 延迟关闭模态框，让用户看到成功信息
        setTimeout(() => {
          this.closeCreatePortfolioModal();

          // 设置新创建的投资组合为选中状态
          this.selectedPortfolio = portfolioName;

          // 刷新投资组合数据
          this.forceRefresh().then(() => {
            // 显示全局成功消息
            this.showSuccessMessage(`成功创建投资组合: ${portfolioName}`);
          });
        }, 1500);
      } else {
        // 处理API错误
        let errorMessage = '创建投资组合失败';
        if (response.message) {
          errorMessage = response.message;
        } else if (response.code === 400) {
          errorMessage = '投资组合名称已存在，请使用其他名称';
        } else if (response.code === 500) {
          errorMessage = '服务器错误，请稍后重试';
        }

        this.showCreatePortfolioError(errorMessage);
      }
    } catch (error) {
      console.error('创建投资组合出错:', error);

      let errorMessage = '创建投资组合时发生错误，请重试';
      if (error.message) {
        if (error.message.includes('400')) {
          errorMessage = '投资组合名称已存在，请使用其他名称';
        } else if (error.message.includes('500')) {
          errorMessage = '服务器错误，请稍后重试';
        } else if (error.message.includes('Network')) {
          errorMessage = '网络连接错误，请检查网络连接';
        }
      }

      this.showCreatePortfolioError(errorMessage);
    } finally {
      // 恢复按钮状态
      if (createBtn) {
        createBtn.disabled = false;
        createBtn.innerHTML = '<iconify-icon icon="mdi:plus" class="mr-2"></iconify-icon>Create Portfolio';
      }
    }
  }

  // 关闭创建投资组合模态框
  closeCreatePortfolioModal() {
    const modal = document.getElementById('newPortfolioModal');
    if (modal) {
      // 隐藏模态框
      modal.style.display = 'none';

      // 移除键盘事件监听器
      const nameInput = modal.querySelector('#newPortfolioName');
      if (nameInput && this._createPortfolioKeyHandler) {
        nameInput.removeEventListener('keydown', this._createPortfolioKeyHandler);
      }

      // 重置模态框状态
      this.resetCreatePortfolioModal();
    }
  }

  // 实时验证投资组合名称
  setupPortfolioNameValidation() {
    const modal = document.getElementById('newPortfolioModal');
    if (!modal) return;

    const nameInput = modal.querySelector('#newPortfolioName');
    if (!nameInput) return;

    // 移除之前的事件监听器
    nameInput.removeEventListener('input', this._portfolioNameValidationHandler);

    // 创建新的验证处理器
    this._portfolioNameValidationHandler = (e) => {
      const name = e.target.value.trim();

      // 清除之前的错误信息
      this.clearCreatePortfolioError();

      // 如果输入为空，不显示错误
      if (!name) {
        return;
      }

      // 验证名称
      const validation = this.validatePortfolioName(name);
      if (!validation.isValid) {
        this.showCreatePortfolioError(validation.message);
      } else {
        // 显示成功样式
        nameInput.classList.add('border-green-500');
      }
    };

    nameInput.addEventListener('input', this._portfolioNameValidationHandler);
  }

  // 导出PDF报告
  async exportPortfolioPDF() {
    if (!this.selectedPortfolio) {
      this.showErrorMessage('请先选择一个投资组合');
      return;
    }

    try {
      // 显示加载状态
      this.showExportLoading();

      // 调用API导出PDF
      const response = await apiService.exportPortfolioPDF(this.selectedPortfolio);

      if (response.code === 200) {
        this.showSuccessMessage(`PDF报告导出成功: ${response.filename}`);
      } else {
        this.showErrorMessage(`导出失败: ${response.message}`);
      }
    } catch (error) {
      console.error('PDF导出出错:', error);
      this.showErrorMessage('PDF导出时发生错误，请重试');
    } finally {
      this.hideExportLoading();
    }
  }

  // 导出简化版PDF报告
  async exportSimplePortfolioPDF() {
    if (!this.selectedPortfolio) {
      this.showErrorMessage('请先选择一个投资组合');
      return;
    }

    try {
      // 显示加载状态
      this.showExportLoading();

      // 调用API导出简化PDF
      const response = await apiService.exportSimplePortfolioPDF(this.selectedPortfolio);

      if (response.code === 200) {
        this.showSuccessMessage(`简化PDF报告导出成功: ${response.filename}`);
      } else {
        this.showErrorMessage(`导出失败: ${response.message}`);
      }
    } catch (error) {
      console.error('简化PDF导出出错:', error);
      this.showErrorMessage('简化PDF导出时发生错误，请重试');
    } finally {
      this.hideExportLoading();
    }
  }

  // 显示导出加载状态
  showExportLoading() {
    const exportBtn = document.querySelector('#portfolioPanel .flex.justify-between button');
    if (exportBtn) {
      exportBtn.disabled = true;
      exportBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>导出中...';
    }
  }

  // 隐藏导出加载状态
  hideExportLoading() {
    const exportBtn = document.querySelector('#portfolioPanel .flex.justify-between button');
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.innerHTML = '<iconify-icon icon="mdi:file-export-outline" class="mr-2"></iconify-icon>Export Report';
    }
  }

  // 显示导出选项模态框
  showExportOptionsModal() {
    if (!this.selectedPortfolio) {
      this.showErrorMessage('请先选择一个投资组合');
      return;
    }

    // 创建导出选项模态框
    const modalHTML = `
      <div id="exportOptionsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 max-w-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">导出PDF报告</h3>
            <button onclick="portfolioPanel.closeExportOptionsModal()" class="text-gray-400 hover:text-gray-600">
              <iconify-icon icon="mdi:close" class="text-xl"></iconify-icon>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-2">完整报告</h4>
              <p class="text-sm text-gray-600 mb-3">包含详细的投资组合信息、用户信息、资产配置分析和风险分析</p>
              <button onclick="portfolioPanel.exportPortfolioPDF()" 
                      class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                导出完整报告
              </button>
            </div>
            
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-2">简化报告</h4>
              <p class="text-sm text-gray-600 mb-3">包含基本的投资组合信息和持仓详情</p>
              <button onclick="portfolioPanel.exportSimplePortfolioPDF()" 
                      class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                导出简化报告
              </button>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <button onclick="portfolioPanel.closeExportOptionsModal()" 
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              取消
            </button>
          </div>
        </div>
      </div>
    `;

    // 移除已存在的模态框
    const existingModal = document.getElementById('exportOptionsModal');
    if (existingModal) {
      existingModal.remove();
    }

    // 添加新模态框
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // 关闭导出选项模态框
  closeExportOptionsModal() {
    const modal = document.getElementById('exportOptionsModal');
    if (modal) {
      modal.remove();
    }
  }
}

// 创建全局portfolio panel实例
let portfolioPanel;

// 初始化函数
function initPortfolioPanel() {
  if (!portfolioPanel) {
    portfolioPanel = new PortfolioPanel();
  }
}

// 全局函数，供HTML调用
function executeSell() {
  if (portfolioPanel) {
    portfolioPanel.confirmSell();
  }
}

function closeSellModal() {
  if (portfolioPanel) {
    portfolioPanel.closeSellModal();
  }
}

function createNewPortfolio() {
  if (portfolioPanel) {
    portfolioPanel.createNewPortfolio();
  }
}

function closeNewPortfolioModal() {
  if (portfolioPanel) {
    portfolioPanel.closeCreatePortfolioModal();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initPortfolioPanel();
  }, 500);
}); 