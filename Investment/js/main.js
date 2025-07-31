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
// function switchPanel(panelId) {
//   console.log('Switching to panel:', panelId);

//   // 切换这四个面板
//   ['homePanel', 'tradingPanel', 'portfolioPanel', 'stockDetailPanel', 'transactionPanel'].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.style.display = 'none';
//       el.classList.add('hidden');
//       console.log('Hidden panel:', id);
//     }
//   });

//   const showEl = document.getElementById(panelId);
//   if (showEl) {
//     showEl.style.display = 'block';
//     showEl.classList.remove('hidden');
//     console.log('Showed panel:', panelId);
//   } else {
//     console.error('Panel not found:', panelId);
//   }

//   // 切换左侧导航高亮
//   const navBtns = document.querySelectorAll('.glass-nav nav button');
//   navBtns.forEach((btn, idx) => {
//     btn.classList.remove('bg-blue-100', 'text-blue-800', 'font-medium');
//     btn.classList.add('text-gray-700');
//     // Home和Stock Trading都指向tradingPanel
//     if ((panelId === 'tradingPanel' && idx <= 1) || (panelId === 'portfolioPanel' && idx === 2)) {
//       btn.classList.add('bg-blue-100', 'text-blue-800', 'font-medium');
//       btn.classList.remove('text-gray-700');
//     }
//   });
// }

// View switching function
function switchPanel(panelId) {
  console.log('Switching to panel:', panelId);

  // 切换这四个面板
  ['homePanel', 'tradingPanel', 'portfolioPanel', 'stockDetailPanel'].forEach(id => {
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
    
    // 根据当前面板高亮对应按钮
    if ((panelId === 'homePanel' && idx === 0) || 
        (panelId === 'tradingPanel' && idx === 1) || 
        (panelId === 'portfolioPanel' && idx === 2)) {
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



// updateChart(30);

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
  // 默认显示homePanel
  switchPanel('homePanel');

  // 初始化首页图表
  setTimeout(() => {
    // Donut Chart
    const donutDom = document.getElementById('donutChart');
    if (donutDom) {
      const donut = echarts.init(donutDom);
      donut.setOption({
        tooltip: { trigger: 'item' },
        color: [
          '#93c5fd',  // BONDS - blue-300
          '#bfdbfe',  // CASH - blue-200
          '#60a5fa',  // OTHER ASSETS - blue-400
          '#3b82f6'   // STOCK - blue-500
        ],
        series: [{
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: { label: { show: false } },
          labelLine: { show: false },
          data: [
            { value: 17, name: 'BONDS' },
            { value: 33, name: 'CASH' },
            { value: 29, name: 'OTHER ASSETS' },
            { value: 21, name: 'STOCK' }
          ]
        }]
      });
      window.addEventListener('resize', () => donut.resize());
    }

    // Line Chart
    const lineDom = document.getElementById('lineChart');
    const toggleBtn = document.getElementById("toggleVisibility");
    const eyeIcon = document.getElementById("eyeIcon");
    const returnAmount = document.getElementById("returnAmount");
    let isVisible = true;

    toggleBtn.addEventListener("click", () => {
      isVisible = !isVisible;
      if (isVisible) {
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
        returnAmount.style.display = "block";
        lineChart.style.display = "block";
      } else {
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
        returnAmount.style.display = "none";
        lineChart.style.display = "none";
      }
    });
    let line = null;
    if (lineDom) {
      line = echarts.init(lineDom);

      // 图表数据
      const chartData = {
        today: [100, 800, 300, 2500, 1400],
        week: [3000, 3200, 3400, 3900, 3600, 4100, 4200],
        month: [3000, 3100, 3200, 3400, 3600, 3900, 4000, 4100, 4200, 4300, 4400, 4500],
        year: Array.from({ length: 12 }, (_, i) => 3000 + i * 150)
      };

      const xAxisData = {
        today: ['9am', '10am', '11am', '12pm', '1pm'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      };

      // 控制函数
      window.updateLineChart = function (period) {
        // 设置按钮高亮
        document.querySelectorAll('#timeButtons button').forEach(btn => {
          btn.classList.remove('text-blue-700', 'font-semibold');
        });
        const clicked = {
          today: 0,
          week: 1,
          month: 2,
          year: 3
        }[period];
        document.querySelectorAll('#timeButtons button')[clicked].classList.add('text-blue-700', 'font-semibold');

        line.setOption({
          xAxis: {
            type: 'category',
            data: xAxisData[period],
            axisLabel: { interval: 0 }
          },
          yAxis: { type: 'value' },
          series: [{
            data: chartData[period],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#3B82F6',
              width: 3
            },
            areaStyle: {
              color: 'rgba(59, 130, 246, 0.15)'
            },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#3B82F6',
              borderColor: '#fff',
              borderWidth: 2
            }
          }]
        });
      };


      // 初始图表加载
      window.updateLineChart('week');
      window.addEventListener('resize', () => line.resize());
    }
  }, 200);

  filterTransactions();

  // 默认显示交易面板并初始化图表
  setTimeout(() => {
    switchPanel('homePanel');
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



//homepage charts
// Donut Chart

const toggleBtn = document.getElementById("toggleVisibility");
const eyeIcon = document.getElementById("eyeIcon");
let isVisible = true;

toggleBtn.addEventListener("click", () => {
  isVisible = !isVisible;

  // 修改 iconify 的图标属性
  eyeIcon.setAttribute("icon", isVisible ? "mdi:eye-outline" : "mdi:eye-off-outline");

  // 显隐数据和图表
  returnAmount.style.display = isVisible ? "block" : "none";
  lineChart.style.display = isVisible ? "block" : "none";
});
const donut = echarts.init(document.getElementById('donutChart'));
donut.setOption({
  tooltip: { trigger: 'item' },
  color: [
    '#93c5fd',  // BONDS - blue-300
    '#bfdbfe',  // CASH - blue-200
    '#60a5fa',  // OTHER ASSETS - blue-400
    '#3b82f6'   // STOCK - blue-500
  ],
  series: [{
    type: 'pie',
    radius: ['60%', '80%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 6,
      borderColor: '#fff',
      borderWidth: 2
    },
    // ✅ 默认 label 隐藏
    label: { show: false },
    // ✅ 鼠标悬浮时也不显示文字标签
    emphasis: {
      label: { show: false }
    },
    // ✅ 关闭引导线
    labelLine: { show: false },
    data: [
      { value: 17, name: 'BONDS' },
      { value: 33, name: 'CASH' },
      { value: 29, name: 'OTHER ASSETS' },
      { value: 21, name: 'STOCK' }
    ]
  }]
});

