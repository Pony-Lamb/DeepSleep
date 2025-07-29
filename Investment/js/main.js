// Stock data for search suggestions
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

// 股票详情数据补充
const stockDetailData = [
  { name: "Apple Inc.", symbol: "AAPL", price: 175.42, change: 2.35, logo: "https://modao.cc/ai/uploads/ai_pics/6/66423/aigp_1753747615.jpeg", desc: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide." },
  { name: "Microsoft Corp.", symbol: "MSFT", price: 336.21, change: 1.64, logo: "https://modao.cc/ai/uploads/ai_pics/6/66424/aigp_1753747617.jpeg", desc: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide." },
  { name: "Amazon.com Inc.", symbol: "AMZN", price: 132.75, change: -0.87, logo: "https://modao.cc/ai/uploads/ai_pics/6/66425/aigp_1753747619.jpeg", desc: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally." },
  { name: "Tesla Inc.", symbol: "TSLA", price: 258.93, change: -3.25, logo: "https://modao.cc/ai/uploads/ai_pics/6/66426/aigp_1753747621.jpeg", desc: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems." },
  { name: "Google LLC", symbol: "GOOGL", price: 138.04, change: 1.22, logo: "https://modao.cc/ai/uploads/ai_pics/6/66427/aigp_1753747622.jpeg", desc: "Google LLC provides various products and platforms including Search, Maps, Gmail, Android, Google Play, Chrome, and YouTube." },
  { name: "Netflix Inc.", symbol: "NFLX", price: 483.32, change: 4.63, logo: "https://modao.cc/ai/uploads/ai_pics/6/66428/aigp_1753747623.jpeg", desc: "Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and mobile games." }
];

// View switching function
function switchPanel(panelId) {
  console.log('Switching to panel:', panelId);

  // 只切换这三个面板
  ['tradingPanel', 'portfolioPanel', 'stockDetailPanel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
      el.classList.add('hidden');
      console.log('Hidden panel:', id);
    }
  });

  const showEl = document.getElementById(panelId);
  if (showEl) {
    showEl.style.display = 'block';
    showEl.classList.remove('hidden');
    console.log('Showed panel:', panelId);
  } else {
    console.error('Panel not found:', panelId);
  }

  // 切换左侧导航高亮
  const navBtns = document.querySelectorAll('.glass-nav nav button');
  navBtns.forEach((btn, idx) => {
    btn.classList.remove('bg-blue-100', 'text-blue-800', 'font-medium');
    btn.classList.add('text-gray-700');
    // Home和Stock Trading都指向tradingPanel
    if ((panelId === 'tradingPanel' && idx <= 1) || (panelId === 'portfolioPanel' && idx === 2)) {
      btn.classList.add('bg-blue-100', 'text-blue-800', 'font-medium');
      btn.classList.remove('text-gray-700');
    }
  });
}

// Show search results
function showSearchResults() {
  const input = document.querySelector('input[type="text"]');
  const resultsContainer = document.getElementById('searchResults');

  if (!input.value) {
    resultsContainer.style.display = 'none';
    return;
  }

  const filteredStocks = stockData.filter(stock =>
    stock.name.toLowerCase().includes(input.value.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(input.value.toLowerCase())
  );

  if (filteredStocks.length === 0) {
    resultsContainer.innerHTML = '<div class="p-4 text-gray-500">No matching stocks found</div>';
    resultsContainer.style.display = 'block';
    return;
  }

  let resultsHTML = '';
  filteredStocks.forEach(stock => {
    const changeClass = stock.change >= 0 ? 'positive-change' : 'negative-change';
    const changeIcon = stock.change >= 0 ?
      '<iconify-icon icon="mdi:trending-up"></iconify-icon>' :
      '<iconify-icon icon="mdi:trending-down"></iconify-icon>';

    resultsHTML += `
          <div class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center">
            <div class="flex-1">
              <p class="font-bold">${stock.symbol}</p>
              <p class="text-sm text-gray-600">${stock.name}</p>
            </div>
            <div class="text-right">
              <p class="font-bold">$${stock.price.toFixed(2)}</p>
              <div class="${changeClass} flex items-center justify-end">
                ${changeIcon}
                <span>${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        `;
  });

  resultsContainer.innerHTML = resultsHTML;
  resultsContainer.style.display = 'block';
}

// Trade modal functions
let currentStockSymbol = '';
let currentStockPrice = 0;

function showTradeModal(symbol, price) {
  currentStockSymbol = symbol;
  currentStockPrice = price;

  const modal = document.getElementById('tradeModal');
  document.getElementById('modal-stock-name').textContent =
    `${stockData.find(s => s.symbol === symbol).name} (${symbol})`;
  document.getElementById('modal-stock-price').textContent =
    price.toFixed(2);
  document.getElementById('modal-stock-logo').src =
    '/mb-potato/image/placeholder.svg';
  document.getElementById('modal-stock-logo').alt =
    `${symbol} company logo`;

  modal.style.display = 'block';
}

function closeTradeModal() {
  document.getElementById('tradeModal').style.display = 'none';
}

function executeTrade() {
  closeTradeModal();
  alert(`Trade executed: Bought ${currentStockSymbol} at ${currentStockPrice}`);
}

// Sell modal functions
function showSellModal(symbol, price) {
  currentStockSymbol = symbol;
  currentStockPrice = price;

  const modal = document.getElementById('sellModal');
  document.getElementById('modal-sell-name').textContent =
    `${stockData.find(s => s.symbol === symbol).name} (${symbol})`;
  document.getElementById('modal-sell-price').textContent =
    price.toFixed(2);
  document.getElementById('modal-sell-logo').src =
    '/mb-potato/image/placeholder.svg';
  document.getElementById('modal-sell-logo').alt =
    `${symbol} company logo`;

  modal.style.display = 'block';
}

function closeSellModal() {
  document.getElementById('sellModal').style.display = 'none';
}

function executeSell() {
  closeSellModal();
  alert(`Sale executed: Sold ${currentStockSymbol} at ${currentStockPrice}`);
}

// Add position modal functions
function showAddPositionModal() {
  document.getElementById('addPositionModal').style.display = 'block';
}

function closeAddPositionModal() {
  document.getElementById('addPositionModal').style.display = 'none';
}

function searchStocks() {
  const input = document.getElementById('stockSearchInput');
  const resultsContainer = document.getElementById('stockSearchResults');

  if (!input.value) {
    resultsContainer.style.display = 'none';
    return;
  }

  const filteredStocks = stockData.filter(stock =>
    stock.name.toLowerCase().includes(input.value.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(input.value.toLowerCase())
  );

  if (filteredStocks.length === 0) {
    resultsContainer.innerHTML = '<div class="p-4 text-gray-500">No matching stocks found</div>';
    resultsContainer.style.display = 'block';
    return;
  }

  let resultsHTML = '';
  filteredStocks.forEach(stock => {
    resultsHTML += `
          <div class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" 
               onclick="selectStock('${stock.symbol}', ${stock.price})">
            <p class="font-bold">${stock.symbol}</p>
            <p class="text-sm text-gray-600">${stock.name}</p>
          </div>
        `;
  });

  resultsContainer.innerHTML = resultsHTML;
  resultsContainer.style.display = 'block';
}

function selectStock(symbol, price) {
  document.getElementById('stockSearchInput').value = symbol;
  document.getElementById('stockSearchResults').style.display = 'none';
}

function addNewPosition() {
  closeAddPositionModal();
  alert('New position added to portfolio');
}

// New Portfolio modal functions
function showNewPortfolioModal() {
  document.getElementById('newPortfolioModal').style.display = 'block';
}

function closeNewPortfolioModal() {
  document.getElementById('newPortfolioModal').style.display = 'none';
}

function createNewPortfolio() {
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

  closeNewPortfolioModal();
  alert('New portfolio "' + portfolioName + '" has been created!');
}

// Initialize charts
function initCharts() {
  // 初始化图表的代码
  console.log('Charts initialized');
}

// Handle window resize
window.addEventListener('resize', function () {
  if (myChart) {
    myChart.resize();
  }
});


// Portfolio switching - 这个功能已经在appInit中处理了

// Close search results when clicking outside
document.addEventListener('click', function (e) {
  if (!document.querySelector('.relative').contains(e.target)) {
    document.getElementById('searchResults').style.display = 'none';
  }
});

// Initialize chart if main panel is visible on load - 这个功能已经在appInit中处理了

// 展示股票详情
function showStockDetail(symbol) {
  // 统一用switchPanel切换面板
  switchPanel('stockDetailPanel');

  // 查找数据
  const stock = stockDetailData.find(s => s.symbol === symbol);
  if (stock) {
    document.getElementById('detail-stock-logo').src = stock.logo;
    document.getElementById('detail-stock-logo').alt = stock.name + ' logo';
    document.getElementById('detail-page-title').textContent = stock.name;
    document.getElementById('detail-stock-name').textContent = stock.name;
    document.getElementById('detail-stock-symbol').textContent = stock.symbol;
    document.getElementById('detail-stock-price').textContent = stock.price.toFixed(2);
    const changeDiv = document.getElementById('detail-stock-change');
    if (stock.change >= 0) {
      changeDiv.innerHTML = `<iconify-icon icon="mdi:trending-up" class="text-green-500 mr-1"></iconify-icon>
        <span class="text-green-600 font-bold">+${stock.change}%</span>`;
    } else {
      changeDiv.innerHTML = `<iconify-icon icon="mdi:trending-down" class="text-red-500 mr-1"></iconify-icon>
        <span class="text-red-600 font-bold">${stock.change}%</span>`;
    }
  }
  setTimeout(() => {
    if (!myChart) {
      initStockChart();
    }
    if (myChart) {
      myChart.resize();
      updateChart(30);
    }
  }, 100);
}

// 返回市场概览
function backToTradingPanel() {
  document.getElementById('stockDetailPanel').style.display = 'none';
  document.getElementById('stockDetailPanel').classList.add('hidden');
  document.getElementById('tradingPanel').style.display = 'block';
  document.getElementById('tradingPanel').classList.remove('hidden');
}


// Initialize chart
let myChart = null;

function initStockChart() {
  const chartDom = document.getElementById('stockChart');
  if (chartDom) {
    if (!myChart) {
      myChart = echarts.init(chartDom, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
    }
  }
}

// Add this after the updateChart function
window.addEventListener('resize', function () {
  if (myChart) {
    myChart.resize({
      animation: {
        duration: 300
      }
    });
  }
});

// Generate simulated stock data
function generateStockData(days = 30) {
  const data = [];
  let date = new Date();
  date.setDate(date.getDate() - days - 10);
  let price = 180 + Math.random() * 10;

  for (let i = 0; i < days; i++) {
    if (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
      i--;
      continue;
    }

    const change = (Math.random() - 0.45) * 2;
    const open = price;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 1.5;
    const low = Math.min(open, close) - Math.random() * 1.5;

    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

    data.push([
      dateStr,
      open.toFixed(2) * 1,
      close.toFixed(2) * 1,
      low.toFixed(2) * 1,
      high.toFixed(2) * 1
    ]);

    price = close;
    date.setDate(date.getDate() + 1);
  }

  return data;
}

// Calculate Bollinger Bands
function calculateBollingerBands(data, period = 20, stdDev = 2) {
  const closePrices = data.map(item => item[2]);
  const bollingerData = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      bollingerData.push([null, null, null]);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += closePrices[i - j];
    }
    const sma = sum / period;

    let variance = 0;
    for (let j = 0; j < period; j++) {
      variance += Math.pow(closePrices[i - j] - sma, 2);
    }
    const std = Math.sqrt(variance / period);

    const upper = sma + stdDev * std;
    const lower = sma - stdDev * std;

    bollingerData.push([upper.toFixed(2) * 1, sma.toFixed(2) * 1, lower.toFixed(2) * 1]);
  }

  return bollingerData;
}

function calculateYAxisRange(data) {
  const allPrices = [];
  data.forEach(item => {
    allPrices.push(item[1]);
    allPrices.push(item[2]);
    allPrices.push(item[3]);
    allPrices.push(item[4]);
  });

  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  const range = max - min;
  const padding = range * 0.1;

  return [Math.floor(min - padding), Math.ceil(max + padding)];
}

function updateChart(days) {
  // 确保myChart已初始化
  if (!myChart) {
    initStockChart();
  }
  if (!myChart) {
    console.error('Chart not initialized');
    return;
  }
  const effectiveDays = Math.min(days, 90);
  const stockData = generateStockData(effectiveDays);
  const bollingerData = calculateBollingerBands(stockData);
  const [yMin, yMax] = calculateYAxisRange(stockData);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '10',
      right: '10',
      bottom: '30',
      top: '30',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: stockData.map(item => item[0]),
      axisLine: {
        lineStyle: {
          color: '#D1D5DB',
        },
      },
      axisLabel: {
        color: '#6B7280',
      },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB',
        },
      },
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      axisLabel: {
        color: '#94A3B8',
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.2)',
        },
      },
    },
    series: [
      {
        type: 'candlestick',
        data: stockData.map(item => [item[1], item[2], item[3], item[4]]),
        itemStyle: {
          color: '#10B981',
          color0: '#EF4444',
          borderColor: '#10B981',
          borderColor0: '#EF4444',
        },
        emphasis: {
          itemStyle: {
            color: '#34D399',
            color0: '#F87171',
            borderColor: '#34D399',
            borderColor0: '#F87171',
          },
        },
        tooltip: {
          formatter: null,
        },
      },
      {
        type: 'line',
        name: 'Bollinger Upper',
        data: bollingerData.map(item => item[0]),
        lineStyle: {
          color: '#60A5FA',
          width: 1,
        },
        showSymbol: false,
        tooltip: {
          formatter: null,
        },
      },
      {
        type: 'line',
        name: 'Bollinger Middle (SMA)',
        data: bollingerData.map(item => item[1]),
        lineStyle: {
          color: '#FBBF24',
          width: 1.5,
        },
        showSymbol: false,
        tooltip: {
          formatter: null,
        },
      },
      {
        type: 'line',
        name: 'Bollinger Lower',
        data: bollingerData.map(item => item[2]),
        lineStyle: {
          color: '#60A5FA',
          width: 1,
        },
        showSymbol: false,
        tooltip: {
          formatter: null,
        },
      },
    ],
  };

  myChart.setOption(option);
}

updateChart(30);

// Window resize event - 这个功能已经在上面处理了

// Period buttons interaction - 这个功能已经在appInit中处理了


window.appInit = function () {
  console.log('Starting app initialization...');

  // 绑定 portfolio 按钮事件
  const portfolioBtns = document.querySelectorAll('.portfolio-btn');
  portfolioBtns.forEach(btn => {
    btn.addEventListener('click', function () {
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
      const portfolioName = this.textContent;
      document.getElementById('currentPortfolioName').textContent = portfolioName;
    });
  });
  // 绑定时间周期按钮事件
  const periodButtons = document.querySelectorAll('[data-days]');
  periodButtons.forEach(button => {
    button.addEventListener('click', function () {
      periodButtons.forEach(btn => {
        btn.classList.remove('active-period');
        btn.classList.add('inactive-period');
      });
      this.classList.remove('inactive-period');
      this.classList.add('active-period');
      const days = parseInt(this.getAttribute('data-days'));
      updateChart(days);
    });
  });
  // 默认显示交易面板并初始化图表
  setTimeout(() => {
    switchPanel('tradingPanel');
    setTimeout(() => {
      if (document.getElementById('stockChart')) {
        initStockChart();
        updateChart(30);
      }
    }, 100);
  }, 200);

  console.log('App initialized successfully');
};

// 交易弹窗相关逻辑
let currentTradeSymbol = '';
let currentTradePrice = 0;
let portfolioList = ['US Stocks', 'Hong Kong Stocks', 'China A-Shares', 'Cryptocurrencies'];

function showTradeModal(symbol, price) {
  currentTradeSymbol = symbol;
  currentTradePrice = price;
  // 填充portfolio下拉
  const select = document.getElementById('trade-portfolio-select');
  select.innerHTML = '';
  portfolioList.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
  // 默认选第一个
  select.value = portfolioList[0];
  document.getElementById('trade-quantity-input').value = 1;
  document.getElementById('tradeModal').style.display = 'block';
}
function closeTradeModal() {
  document.getElementById('tradeModal').style.display = 'none';
}
function showNewPortfolioModalFromTrade() {
  document.getElementById('newPortfolioNameFromTrade').value = '';
  document.getElementById('newPortfolioModalFromTrade').style.display = 'block';
}
function closeNewPortfolioModalFromTrade() {
  document.getElementById('newPortfolioModalFromTrade').style.display = 'none';
}
function createNewPortfolioFromTrade() {
  const name = document.getElementById('newPortfolioNameFromTrade').value.trim();
  if (!name) {
    alert('Please enter a portfolio name');
    return;
  }
  if (portfolioList.includes(name)) {
    alert('Portfolio already exists');
    return;
  }
  portfolioList.push(name);
  closeNewPortfolioModalFromTrade();
  // 重新填充下拉并选中新建项
  const select = document.getElementById('trade-portfolio-select');
  const opt = document.createElement('option');
  opt.value = name;
  opt.textContent = name;
  select.appendChild(opt);
  select.value = name;
  // 同步portfolioPanel按钮
  syncPortfolioPanelButtons();
}
function confirmTrade() {
  const portfolio = document.getElementById('trade-portfolio-select').value;
  const quantity = document.getElementById('trade-quantity-input').value;
  closeTradeModal();
  alert(`Buy ${quantity} of ${currentTradeSymbol} in portfolio: ${portfolio} at $${currentTradePrice}`);
}
// 同步portfolioPanel按钮
function syncPortfolioPanelButtons() {
  const panel = document.getElementById('portfolioPanel');
  if (!panel) return;
  const btnsDiv = panel.querySelector('.flex.gap-4.mb-6.overflow-x-auto');
  if (!btnsDiv) return;
  // 清空原有按钮
  btnsDiv.innerHTML = '';
  portfolioList.forEach((name, idx) => {
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

