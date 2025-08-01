// Modal Handlers 功能模块
class ModalHandlers {
  constructor() {
    this.currentStockSymbol = '';
    this.currentStockPrice = 0;
    this.portfolioList = ['US Stocks', 'Hong Kong Stocks', 'China A-Shares', 'Cryptocurrencies'];
    this.init();
  }

  // 初始化
  init() {
    console.log('ModalHandlers 初始化开始');
    this.setupEventListeners();
    console.log('ModalHandlers 初始化完成');
  }

  // 设置事件监听器
  setupEventListeners() {
    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
      const searchResults = document.getElementById('searchResults');
      if (searchResults && !document.querySelector('.relative').contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  // 交易模态框相关
  showTradeModal(symbol, price) {
    this.currentStockSymbol = symbol;
    this.currentStockPrice = price;

    const modal = document.getElementById('tradeModal');
    const stockName = this.getStockName(symbol);
    document.getElementById('modal-stock-name').textContent = `${stockName} (${symbol})`;
    document.getElementById('modal-stock-price').textContent = price.toFixed(2);

    modal.classList.add('show');
  }

  closeTradeModal() {
    document.getElementById('tradeModal').classList.remove('show');
  }

  executeTrade() {
    this.closeTradeModal();
    alert(`Trade executed: Bought ${this.currentStockSymbol} at ${this.currentStockPrice}`);
  }

  // 新增持仓模态框
  showAddPositionModal() {
    document.getElementById('addPositionModal').style.display = 'block';
  }

  closeAddPositionModal() {
    document.getElementById('addPositionModal').style.display = 'none';
  }

  addNewPosition() {
    this.closeAddPositionModal();
    alert('New position added to portfolio');
  }

  // 新建投资组合模态框
  showNewPortfolioModal() {
    document.getElementById('newPortfolioModal').style.display = 'block';
  }

  closeNewPortfolioModal() {
    document.getElementById('newPortfolioModal').style.display = 'none';
  }

  createNewPortfolio() {
    const portfolioName = document.getElementById('newPortfolioName').value;
    if (!portfolioName) {
      alert('Please enter a portfolio name');
      return;
    }

    // 创建新的投资组合按钮
    const portfolioBtnsContainer = document.querySelector('.flex.gap-4.mb-6.overflow-x-auto');
    const newBtn = document.createElement('button');
    newBtn.className = 'px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium portfolio-btn';
    newBtn.setAttribute('data-portfolio', 'portfolio' + (portfolioBtnsContainer.children.length));
    newBtn.textContent = portfolioName;

    // 在New Portfolio按钮之前插入
    portfolioBtnsContainer.insertBefore(newBtn, portfolioBtnsContainer.lastElementChild);

    // 为新按钮添加事件监听
    newBtn.addEventListener('click', function () {
      const portfolioBtns = document.querySelectorAll('.portfolio-btn');
      portfolioBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.remove('bg-blue-600');
        b.classList.remove('text-white');
        b.classList.add('bg-gray-100');
        b.classList.add('text-gray-700');
      });

      this.classList.add('active');
      this.classList.remove('bg-gray-100');
      this.classList.remove('text-gray-700');
      this.classList.add('bg-blue-600');
      this.classList.add('text-white');

      document.getElementById('currentPortfolioName').textContent = this.textContent;
    });

    this.closeNewPortfolioModal();
    alert('New portfolio "' + portfolioName + '" has been created!');
  }

  // 交易弹窗相关逻辑
  async showTradeModalFromTrade(symbol, price) {
    this.currentStockSymbol = symbol;
    this.currentStockPrice = price;

    // 设置模态框数据，供 trading-panel.js 的 confirmTrade 使用
    const modal = document.getElementById('tradeModal');
    if (modal) {
      modal.dataset.assetId = symbol;
      modal.dataset.price = price.toString();
    }

    // 显示模态框
    document.getElementById('tradeModal').style.display = 'block';
    document.getElementById('trade-quantity-input').value = 1;

    // 从后端API加载用户实际的投资组合
    try {
      const response = await apiService.getPortfolioNames();
      if (response.code === 200 && response.data.portfolios) {
        const select = document.getElementById('trade-portfolio-select');
        select.innerHTML = '';
        response.data.portfolios.forEach(portfolio => {
          const option = document.createElement('option');
          option.value = portfolio;
          option.textContent = portfolio;
          select.appendChild(option);
        });
        // 默认选第一个
        if (response.data.portfolios.length > 0) {
          select.value = response.data.portfolios[0];
        }
      } else {
        console.error('获取投资组合失败:', response.message);
        // 如果API调用失败，使用默认列表作为后备
        this.loadDefaultPortfolioOptions();
      }
    } catch (error) {
      console.error('加载投资组合出错:', error);
      // 如果API调用失败，使用默认列表作为后备
      this.loadDefaultPortfolioOptions();
    }
  }

  // 加载默认投资组合选项（作为后备）
  loadDefaultPortfolioOptions() {
    const select = document.getElementById('trade-portfolio-select');
    select.innerHTML = '';
    this.portfolioList.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
    // 默认选第一个
    select.value = this.portfolioList[0];
  }

  showNewPortfolioModalFromTrade() {
    document.getElementById('newPortfolioNameFromTrade').value = '';
    document.getElementById('newPortfolioModalFromTrade').style.display = 'block';
  }

  closeNewPortfolioModalFromTrade() {
    document.getElementById('newPortfolioModalFromTrade').style.display = 'none';
  }

  async createNewPortfolioFromTrade() {
    const name = document.getElementById('newPortfolioNameFromTrade').value.trim();
    if (!name) {
      alert('Please enter a portfolio name');
      return;
    }

    try {
      // 调用后端API创建投资组合
      const response = await apiService.createPortfolio(name);
      if (response.code === 200) {
        this.closeNewPortfolioModalFromTrade();

        // 重新加载投资组合列表
        await this.reloadPortfolioOptions();

        // 选中新创建的投资组合
        const select = document.getElementById('trade-portfolio-select');
        select.value = name;

        alert(`投资组合 "${name}" 创建成功！`);
      } else {
        alert(`创建投资组合失败: ${response.message}`);
      }
    } catch (error) {
      console.error('创建投资组合出错:', error);
      alert('创建投资组合时发生错误，请重试');
    }
  }

  // 重新加载投资组合选项
  async reloadPortfolioOptions() {
    try {
      const response = await apiService.getPortfolioNames();
      if (response.code === 200 && response.data.portfolios) {
        const select = document.getElementById('trade-portfolio-select');
        select.innerHTML = '';
        response.data.portfolios.forEach(portfolio => {
          const option = document.createElement('option');
          option.value = portfolio;
          option.textContent = portfolio;
          select.appendChild(option);
        });
      }
    } catch (error) {
      console.error('重新加载投资组合出错:', error);
    }
  }

  // confirmTrade 方法由 trading-panel.js 处理，这里不定义

  // 同步portfolioPanel按钮
  syncPortfolioPanelButtons() {
    const panel = document.getElementById('portfolioPanel');
    if (!panel) return;
    const btnsDiv = panel.querySelector('.flex.gap-4.mb-6.overflow-x-auto');
    if (!btnsDiv) return;
    // 清空原有按钮
    btnsDiv.innerHTML = '';
    this.portfolioList.forEach((name, idx) => {
      const btn = document.createElement('button');
      btn.className = 'px-5 py-2.5 rounded-xl font-medium portfolio-btn' + (idx === 0 ? ' active bg-blue-600 text-white' : ' bg-gray-100 text-gray-700');
      btn.setAttribute('data-portfolio', 'portfolio' + (idx + 1));
      btn.textContent = name;
      btn.onclick = function () {
        document.querySelectorAll('.portfolio-btn').forEach(b => {
          b.classList.remove('active', 'bg-blue-600', 'text-white');
          b.classList.add('bg-gray-100', 'text-gray-700');
        });
        this.classList.add('active', 'bg-blue-600', 'text-white');
        this.classList.remove('bg-gray-100', 'text-gray-700');
        document.getElementById('currentPortfolioName').textContent = name;
      };
      btnsDiv.appendChild(btn);
    });
  }

  // 获取股票名称
  getStockName(symbol) {
    const stockData = [
      { name: "Apple Inc.", symbol: "AAPL", price: 175.42, change: 2.35 },
      { name: "Microsoft Corp.", symbol: "MSFT", price: 336.21, change: 1.64 },
      { name: "Amazon.com Inc.", symbol: "AMZN", price: 132.75, change: -0.87 },
      { name: "Tesla Inc.", symbol: "TSLA", price: 258.93, change: -3.25 },
      { name: "Google LLC", symbol: "GOOGL", price: 138.04, change: 1.22 },
      { name: "Netflix Inc.", symbol: "NFLX", price: 483.32, change: 4.63 },
      { name: "Johnson & Johnson", symbol: "JNJ", price: 167.61, change: 0.76 },
      { name: "Visa Inc.", symbol: "V", price: 238.72, change: 0.36 }
    ];
    const stock = stockData.find(s => s.symbol === symbol);
    return stock ? stock.name : symbol;
  }
}

// 创建全局modal handlers实例
let modalHandlers;

// 初始化函数
function initModalHandlers() {
  if (!modalHandlers) {
    modalHandlers = new ModalHandlers();
  }
}

// 全局函数，供HTML调用
function showTradeModal(symbol, price) {
  if (modalHandlers) {
    modalHandlers.showTradeModal(symbol, price);
  }
}

function closeTradeModal() {
  if (modalHandlers) {
    modalHandlers.closeTradeModal();
  }
}

function executeTrade() {
  if (modalHandlers) {
    modalHandlers.executeTrade();
  }
}

function showAddPositionModal() {
  if (modalHandlers) {
    modalHandlers.showAddPositionModal();
  }
}

function closeAddPositionModal() {
  if (modalHandlers) {
    modalHandlers.closeAddPositionModal();
  }
}

function addNewPosition() {
  if (modalHandlers) {
    modalHandlers.addNewPosition();
  }
}

function showNewPortfolioModal() {
  if (modalHandlers) {
    modalHandlers.showNewPortfolioModal();
  }
}

function closeNewPortfolioModal() {
  if (modalHandlers) {
    modalHandlers.closeNewPortfolioModal();
  }
}

function createNewPortfolio() {
  if (modalHandlers) {
    modalHandlers.createNewPortfolio();
  }
}

function showNewPortfolioModalFromTrade() {
  if (modalHandlers) {
    modalHandlers.showNewPortfolioModalFromTrade();
  }
}

function closeNewPortfolioModalFromTrade() {
  if (modalHandlers) {
    modalHandlers.closeNewPortfolioModalFromTrade();
  }
}

async function createNewPortfolioFromTrade() {
  if (modalHandlers) {
    await modalHandlers.createNewPortfolioFromTrade();
  }
}

// confirmTrade 函数由 trading-panel.js 处理，这里不定义

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initModalHandlers();
  }, 500);
}); 