// 股票数据已移至各个模块中
// Stock data for search suggestions - 已移至 trading-panel.js
// 股票详情数据 - 已移至 stock-detail-panel.js

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

// 模态框功能已移至 modal-handlers.js
// 搜索功能已移至 trading-panel.js
// 投资组合功能已移至 portfolio-panel.js

// Initialize charts
function initCharts() {
  // 初始化图表的代码
  console.log('Charts initialized');
}

// Handle window resize
window.addEventListener('resize', function () {
  // Check if stockDetailPanel exists and has a chart
  if (typeof stockDetailPanel !== 'undefined' && stockDetailPanel && stockDetailPanel.myChart) {
    stockDetailPanel.myChart.resize();
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

// 股票详情功能已移至 stock-detail-panel.js
// 图表功能已移至 stock-detail-panel.js

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
  // 时间周期按钮事件已移至 stock-detail-panel.js 中处理
  // 默认显示homePanel
  switchPanel('homePanel');

  // 首页图表初始化已移至 home-panel.js

  // 默认显示交易面板并初始化图表
  setTimeout(() => {
    switchPanel('homePanel');
    // 图表初始化已移至各个panel类中处理
  }, 200);

  console.log('App initialized successfully');
};

// 交易弹窗相关逻辑已移至 modal-handlers.js



// 首页图表功能已移至 home-panel.js

