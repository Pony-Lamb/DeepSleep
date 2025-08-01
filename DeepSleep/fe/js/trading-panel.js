// Trading Panel 功能模块
class TradingPanel {
  constructor() {
    this.currentAssets = [];
    this.isLoading = false;
    this.init();
  }

  // 初始化
  async init() {
    await this.loadStockCards();
    this.setupSearchListener();
  }

  // 设置搜索监听器
  setupSearchListener() {
    const searchInput = document.querySelector('#tradingPanel input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  // 处理搜索
  async handleSearch(searchTerm) {
    const resultsContainer = document.getElementById('searchResults');

    if (!searchTerm.trim()) {
      resultsContainer.style.display = 'none';
      return;
    }

    try {
      const response = await apiService.searchAssets(searchTerm);
      if (response.code === 200 && response.data) {
        this.displaySearchResults(response.data, resultsContainer);
      } else {
        resultsContainer.innerHTML = '<div class="p-4 text-gray-500">未找到匹配的股票</div>';
        resultsContainer.style.display = 'block';
      }
    } catch (error) {
      console.error('搜索出错:', error);
      resultsContainer.innerHTML = '<div class="p-4 text-red-500">搜索时发生错误</div>';
      resultsContainer.style.display = 'block';
    }
  }

  // 显示搜索结果
  displaySearchResults(assets, container) {
    if (assets.length === 0) {
      container.innerHTML = '<div class="p-4 text-gray-500">未找到匹配的股票</div>';
      container.style.display = 'block';
      return;
    }

    let resultsHTML = '';
    assets.forEach(asset => {
      const change = this.calculatePriceChange(asset.close_price, asset.open_price);
      const changeClass = change.percentage >= 0 ? 'positive-change' : 'negative-change';
      const changeIcon = change.percentage >= 0 ?
        '<iconify-icon icon="mdi:trending-up"></iconify-icon>' :
        '<iconify-icon icon="mdi:trending-down"></iconify-icon>';

      resultsHTML += `
                <div class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center" 
                     onclick="tradingPanel.selectStockFromSearch('${asset.asset_id}', ${asset.close_price})">
                    <div class="flex-1">
                        <p class="font-bold">${asset.asset_id}</p>
                        <p class="text-sm text-gray-600">${asset.name}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold">$${apiService.formatPrice(asset.close_price)}</p>
                        <div class="${changeClass} flex items-center justify-end">
                            ${changeIcon}
                            <span>${apiService.formatPercentage(change.percentage)}</span>
                        </div>
                    </div>
                </div>
            `;
    });

    container.innerHTML = resultsHTML;
    container.style.display = 'block';
  }

  // 从搜索结果中选择股票
  selectStockFromSearch(assetId, price) {
    // 隐藏搜索结果
    document.getElementById('searchResults').style.display = 'none';

    // 显示交易模态框
    this.showTradeModal(assetId, price);
  }

  // 加载股票卡片
  async loadStockCards() {
    if (this.isLoading) return;

    this.isLoading = true;
    const gridContainer = document.getElementById('stockCardsGrid');

    try {
      // 获取当前日期的股票数据
      const response = await apiService.searchAssets('', apiService.getCurrentDate());

      if (response.code === 200 && response.data) {
        this.currentAssets = response.data;
        this.renderStockCards();
      } else {
        this.showError('无法加载股票数据');
      }
    } catch (error) {
      console.error('加载股票数据出错:', error);
      this.showError('加载股票数据时发生错误');
    } finally {
      this.isLoading = false;
    }
  }

  // 渲染股票卡片
  renderStockCards() {
    const gridContainer = document.getElementById('stockCardsGrid');

    if (!this.currentAssets || this.currentAssets.length === 0) {
      gridContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">暂无股票数据</p>
                </div>
            `;
      return;
    }

    let cardsHTML = '';
    this.currentAssets.forEach(asset => {
      const change = this.calculatePriceChange(asset.close_price, asset.open_price);
      const changeClass = change.percentage >= 0 ? 'positive-change' : 'negative-change';
      const changeIcon = change.percentage >= 0 ?
        '<iconify-icon icon="mdi:trending-up" class="mr-1"></iconify-icon>' :
        '<iconify-icon icon="mdi:trending-down" class="mr-1"></iconify-icon>';

      cardsHTML += `
                 <div class="stock-card p-6 cursor-pointer" onclick="tradingPanel.showStockDetail('${asset.asset_id}')">
                     <div class="flex justify-between items-start mb-4">
                         <div>
                             <h3 class="font-bold text-xl text-gray-800">${asset.name}</h3>
                             <p class="text-gray-500">${asset.asset_id}</p>
                         </div>
                     </div>

                    <div class="mb-6">
                        <p class="text-2xl font-bold text-gray-900">$${apiService.formatPrice(asset.close_price)}</p>
                        <div class="flex items-center ${changeClass}">
                            ${changeIcon}
                            <span>${apiService.formatPercentage(change.percentage)} ($${apiService.formatPrice(change.absolute)})</span>
                        </div>
                    </div>

                                         <button class="buy-btn w-full text-white font-bold rounded-full py-3 flex items-center justify-center"
                         onclick="event.stopPropagation();tradingPanel.showTradeModal('${asset.asset_id}', ${asset.open_price})">
                         <iconify-icon icon="mdi:cart-arrow-down" class="mr-2"></iconify-icon>
                         Buy Stock
                     </button>
                </div>
            `;
    });

    gridContainer.innerHTML = cardsHTML;
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

  // 显示交易模态框
  async showTradeModal(assetId, price) {
    // 使用modal handlers来处理模态框
    if (modalHandlers) {
      await modalHandlers.showTradeModalFromTrade(assetId, price);
    } else {
      console.error('modalHandlers未初始化');
    }
  }

  // 确认买入交易
  async confirmTrade() {
    const modal = document.getElementById('tradeModal');
    if (!modal) {
      console.error('找不到tradeModal');
      return;
    }

    const assetId = modal.dataset.assetId;
    const price = parseFloat(modal.dataset.price);
    const portfolioSelect = document.getElementById('trade-portfolio-select');
    const quantityInput = document.getElementById('trade-quantity-input');

    if (!assetId || !price || !portfolioSelect || !quantityInput) {
      alert('交易信息不完整');
      return;
    }

    const portfolioName = portfolioSelect.value;
    const quantity = parseInt(quantityInput.value);

    if (!portfolioName) {
      alert('请选择投资组合');
      return;
    }

    if (!quantity || quantity <= 0) {
      alert('请输入有效的购买数量');
      return;
    }

    let confirmBtn = null;
    try {
      // 显示加载状态
      confirmBtn = modal.querySelector('button[onclick="confirmTrade()"]');
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> 处理中...';
      }

      // 首先尝试创建投资组合（如果不存在）
      try {
        console.log(`尝试创建投资组合: ${portfolioName}`);
        const createResponse = await apiService.createPortfolio(portfolioName);
        console.log('创建投资组合响应:', createResponse);
        if (createResponse.code === 200) {
          console.log('投资组合创建成功');
        }
      } catch (error) {
        // 如果投资组合已存在，这是正常的，继续执行买入操作
        if (error.message && error.message.includes('400')) {
          console.log('投资组合已存在，继续执行买入操作');
        } else {
          console.log('创建投资组合时出错:', error);
        }
      }

      // 调用买入API，使用当前日期
      const currentDate = apiService.getCurrentDate();
      console.log(`买入参数: assetId=${assetId}, portfolioName=${portfolioName}, quantity=${quantity}, date=${currentDate}`);

      const response = await apiService.buyAsset(assetId, portfolioName, quantity, currentDate);

      console.log('买入API响应:', response);

      if (response.code === 200) {
        alert(`成功购买 ${quantity} 股 ${assetId}！`);
        this.closeTradeModal();

        // 刷新股票数据
        await this.refresh();

        // 刷新portfolio界面数据
        if (portfolioPanel) {
          console.log('开始刷新portfolio界面...');
          try {
            // 强制刷新所有投资组合数据
            await portfolioPanel.forceRefresh();
            console.log('portfolio界面刷新完成');
          } catch (error) {
            console.error('刷新portfolio界面时出错:', error);
          }
        } else {
          console.error('portfolioPanel不存在');
        }
      } else {
        alert(`购买失败: ${response.message}`);
      }
    } catch (error) {
      console.error('买入交易出错:', error);
      alert('买入交易时发生错误，请重试');
    } finally {
      // 恢复按钮状态
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<iconify-icon icon="mdi:cart-check" class="mr-2"></iconify-icon>确认买入';
      }
    }
  }

  // 关闭交易模态框
  closeTradeModal() {
    const modal = document.getElementById('tradeModal');
    if (modal) {
      modal.style.display = 'none';
      // 清理数据
      delete modal.dataset.assetId;
      delete modal.dataset.price;

      // 重置输入
      const quantityInput = document.getElementById('trade-quantity-input');
      if (quantityInput) {
        quantityInput.value = '1';
      }
    }
  }

  // 加载投资组合选项
  async loadPortfolioOptions() {
    const select = document.getElementById('trade-portfolio-select');
    if (!select) return;

    try {
      const response = await apiService.getPortfolioNames();
      if (response.code === 200 && response.data.portfolios) {
        select.innerHTML = '';
        response.data.portfolios.forEach(portfolio => {
          const option = document.createElement('option');
          option.value = portfolio;
          option.textContent = portfolio;
          select.appendChild(option);
        });
      }
    } catch (error) {
      console.error('加载投资组合出错:', error);
    }
  }

  // 显示股票详情
  async showStockDetail(assetId) {
    try {
      const response = await apiService.getAssetDetail(assetId);
      if (response.code === 200) {
        // 切换到股票详情面板
        switchPanel('stockDetailPanel');
        // 调用股票详情面板的显示方法
        if (stockDetailPanel) {
          await stockDetailPanel.showStockDetail(assetId);
        } else {
          console.error('stockDetailPanel未初始化');
        }
        console.log('股票详情:', response.data);
      }
    } catch (error) {
      console.error('获取股票详情出错:', error);
    }
  }

  // 显示错误信息
  showError(message) {
    const gridContainer = document.getElementById('stockCardsGrid');
    gridContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-red-500">${message}</p>
                <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg" onclick="tradingPanel.loadStockCards()">
                    重试
                </button>
            </div>
        `;
  }

  // 刷新数据
  async refresh() {
    await this.loadStockCards();
  }
}

// 创建全局trading panel实例
let tradingPanel;

// 初始化函数
function initTradingPanel() {
  if (!tradingPanel) {
    tradingPanel = new TradingPanel();
  }
}

// 全局函数，供HTML调用
async function showTradeModal(assetId, price) {
  if (tradingPanel) {
    await tradingPanel.showTradeModal(assetId, price);
  }
}

function showStockDetail(assetId) {
  if (tradingPanel) {
    tradingPanel.showStockDetail(assetId);
  }
}

// 全局函数，供HTML调用
function confirmTrade() {
  if (tradingPanel) {
    tradingPanel.confirmTrade();
  } else {
    console.error('tradingPanel不存在');
  }
}

// 确保函数在全局作用域中可用
window.confirmTrade = confirmTrade;

function closeTradeModal() {
  if (tradingPanel) {
    tradingPanel.closeTradeModal();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保组件已加载
  setTimeout(() => {
    initTradingPanel();
  }, 500);
}); 