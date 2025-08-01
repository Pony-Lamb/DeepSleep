// Stock Detail Panel 功能模块
class StockDetailPanel {
  constructor() {
    this.myChart = null;
    this.current_details = {
      symbol: "SYMBOL",
      name: "Stock Name",
      open: [],
      close: [],
      high: [],
      low: [],
      timestamps: []
    };
    this.stockDetailData = [
      { name: "Apple Inc.", symbol: "AAPL", price: 175.42, change: 2.35, desc: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide." },
      { name: "Microsoft Corp.", symbol: "MSFT", price: 336.21, change: 1.64, desc: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide." },
      { name: "Amazon.com Inc.", symbol: "AMZN", price: 132.75, change: -0.87, desc: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally." },
      { name: "Tesla Inc.", symbol: "TSLA", price: 258.93, change: -3.25, desc: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems." },
      { name: "Google LLC", symbol: "GOOGL", price: 138.04, change: 1.22, desc: "Google LLC provides various products and platforms including Search, Maps, Gmail, Android, Google Play, Chrome, and YouTube." },
      { name: "Netflix Inc.", symbol: "NFLX", price: 483.32, change: 4.63, desc: "Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and mobile games." }
    ];
    this.init();
  }

  // 初始化
  init() {
    console.log('StockDetailPanel 初始化开始');
    this.setupEventListeners();
    console.log('StockDetailPanel 初始化完成');
  }

  // 设置事件监听器
  setupEventListeners() {
    // 窗口大小改变时调整图表
    window.addEventListener('resize', () => {
      if (this.myChart) {
        this.myChart.resize({
          animation: {
            duration: 300
          }
        });
      }
    });

    // 绑定时间周期按钮事件
    document.addEventListener('click', (e) => {
      if (e.target && e.target.hasAttribute('data-days')) {
        const periodButtons = document.querySelectorAll('[data-days]');
        periodButtons.forEach(btn => {
          btn.classList.remove('active-period');
          btn.classList.add('inactive-period');
        });
        e.target.classList.remove('inactive-period');
        e.target.classList.add('active-period');
        const days = parseInt(e.target.getAttribute('data-days'));
        if (this.myChart) {
          this.updateChart(days);
        }
      }
    });
  }

  // 获取真实股票数据
  async getRealStockData(assetId) {
    try {
      // 使用 api-service 中的方法
      const fromDate = '2025-05-01';
      const toDate = '2025-07-30';

      console.log("Fetching stock data for:", assetId, "from", fromDate, "to", toDate);

      const response = await apiService.getAssetHistory(assetId, fromDate, toDate);

      console.log("API response:", response);

      if (response.code === 200) {
        return response;
      } else {
        console.error('API returned error:', response.message);
        return null;
      }

    } catch (error) {
      console.error('Failed to fetch stock data:', error);
      return null;
    }
  }

  // 提取股票数据
  extractStockData(days = 30) {
    console.log("extracting stock data for", days, "days");

    // Check if we have valid data
    if (!this.current_details || !this.current_details.data) {
      console.error("Invalid data structure in current_details");
      return [];
    }

    const result = [];
    const data = this.current_details.data;

    // 验证数据完整性
    if (!data.dates || !data.open_prices || !data.close_prices || !data.high_prices || !data.low_prices) {
      console.error("Missing required data fields");
      return [];
    }

    // Get the latest date from the data
    const totalPoints = data.dates.length;
    if (totalPoints === 0) {
      console.error("No data points available");
      return [];
    }

    // Get the end date (latest date in the data)
    const endDate = new Date(data.dates[totalPoints - 1]);

    // Calculate start date (days ago from end date)
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    console.log("Date range:", startDate.toISOString().split('T')[0], "to", endDate.toISOString().split('T')[0]);

    // Filter data within the date range
    for (let i = 0; i < totalPoints; i++) {
      const currentDate = new Date(data.dates[i]);

      // Check if current date is within our range
      if (currentDate >= startDate && currentDate <= endDate) {
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

        result.push([
          formattedDate,
          parseFloat(data.open_prices[i]),
          parseFloat(data.close_prices[i]),
          parseFloat(data.low_prices[i]),
          parseFloat(data.high_prices[i])
        ]);
      }
    }

    console.log("Extracted", result.length, "data points within date range");
    return result;
  }

  // 显示股票详情
  async showStockDetail(assetId) {
    // 统一用switchPanel切换面板
    if (typeof switchPanel === 'function') {
      switchPanel('stockDetailPanel');
    }

    this.current_details = await this.getRealStockData(assetId);
    console.log("Successfully fetched stock data.");
    console.log("current_details: ", this.current_details);

    // 查找数据 - 使用assetId作为symbol
    const stock = this.stockDetailData.find(s => s.symbol === assetId);

    // 检查API数据是否有效
    if (!this.current_details || !this.current_details.data) {
      console.error("API data is invalid or null");
      // 使用模拟数据作为后备
      this.current_details = {
        data: {
          dates: ['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05'],
          open_prices: [100, 101, 102, 103, 104],
          close_prices: [101, 102, 103, 104, 105],
          high_prices: [102, 103, 104, 105, 106],
          low_prices: [99, 100, 101, 102, 103]
        }
      };
      console.log("Using fallback data");
    }

    if (stock && this.current_details && this.current_details.data) {
      const length_price = this.current_details.data.close_prices.length;
      // Convert to numbers using parseFloat
      const today_close = parseFloat(this.current_details.data.close_prices[length_price - 1]);
      const today_open = parseFloat(this.current_details.data.open_prices[length_price - 1]);
      const today_high = parseFloat(this.current_details.data.high_prices[length_price - 1]);
      const today_low = parseFloat(this.current_details.data.low_prices[length_price - 1]);

      document.getElementById('detail-page-title').textContent = stock.name;
      document.getElementById('detail-stock-name').textContent = stock.name;
      document.getElementById('detail-stock-symbol').textContent = stock.symbol;
      document.getElementById('detail-stock-price').textContent = today_close.toFixed(2);
      const changeDiv = document.getElementById('detail-stock-change');
      const change_num = today_close - today_open;
      const change_rate = change_num / today_open * 100;
      console.log("change_num: ", change_num);

      // Update the stock_price_bigcard element
      document.getElementById('stock_price_bigcard').textContent = today_close.toFixed(2);

      // Update the change indicator next to stock_price_bigcard
      const changeElement = document.getElementById('change_rate_bigcard');
      const changeFormatted = Math.abs(change_num).toFixed(2);
      const percentFormatted = Math.abs(change_rate).toFixed(2);

      // Update the text content and icon
      const caretDirection = change_num >= 0 ? 'up' : 'down';
      const isPositive = change_num >= 0;

      changeElement.innerHTML = `
        <i class="fa fa-caret-${caretDirection} mr-1"></i>
        ${changeFormatted} (${percentFormatted}%)`;

      // Update the stock_price_bigcard element with color coding
      const priceElement = document.getElementById('stock_price_bigcard');

      // Apply color based on price movement (positive = rise, negative = fall)
      if (change_num >= 0) {
        priceElement.className = 'text-2xl font-bold mr-3 text-rise';
      } else {
        priceElement.className = 'text-2xl font-bold mr-3 text-down';
      }


      // Update colors based on change direction
      if (isPositive) {
        changeElement.className = 'bg-rise/10 text-rise px-2 py-1 rounded text-sm flex items-center';
      } else {
        changeElement.className = 'bg-fall/10 text-fall px-2 py-1 rounded text-sm flex items-center';
      }


      if (change_rate < 0) {
        changeDiv.innerHTML = `<iconify-icon icon="mdi:trending-down" class="text-green-500 mr-1"></iconify-icon>
          <span class="text-green-600 font-bold">${change_rate.toFixed(2)}%</span>`;
      } else {
        changeDiv.innerHTML = `<iconify-icon icon="mdi:trending-up" class="text-red-500 mr-1"></iconify-icon>
          <span class="text-red-600 font-bold">+${change_rate.toFixed(2)}%</span>`;
      }

      // Update the stock detail cards with actual values
      const openCardValue = document.querySelector('.stock-detail-card:nth-child(1) .text-lg');
      const closeCardValue = document.querySelector('.stock-detail-card:nth-child(2) .text-lg');
      const highCardValue = document.querySelector('.stock-detail-card:nth-child(3) .text-lg');
      const lowCardValue = document.querySelector('.stock-detail-card:nth-child(4) .text-lg');

      // Set the values
      openCardValue.textContent = today_open.toFixed(2);
      closeCardValue.textContent = today_close.toFixed(2);
      highCardValue.textContent = today_high.toFixed(2);
      lowCardValue.textContent = today_low.toFixed(2);

      // Update styles based on comparison with previous close
      // Open price
      if (today_open > today_open) {
        openCardValue.className = 'text-lg font-semibold mt-1 text-rise';
      } else if (today_open < today_open) {
        openCardValue.className = 'text-lg font-semibold mt-1 text-fall';
      } else {
        openCardValue.className = 'text-lg font-semibold mt-1';
      }

      // Close price (current price)
      if (today_close > today_open) {
        closeCardValue.className = 'text-lg font-semibold mt-1 text-rise';
      } else if (today_close < today_open) {
        closeCardValue.className = 'text-lg font-semibold mt-1 text-fall';
      } else {
        closeCardValue.className = 'text-lg font-semibold mt-1';
      }

      // High price
      if (today_high > today_open) {
        highCardValue.className = 'text-lg font-semibold mt-1 text-rise';
      } else if (today_high < today_open) {
        highCardValue.className = 'text-lg font-semibold mt-1 text-fall';
      } else {
        highCardValue.className = 'text-lg font-semibold mt-1';
      }

      // Low price
      if (today_low > today_open) {
        lowCardValue.className = 'text-lg font-semibold mt-1 text-rise';
      } else if (today_low < today_open) {
        lowCardValue.className = 'text-lg font-semibold mt-1 text-fall';
      } else {
        lowCardValue.className = 'text-lg font-semibold mt-1';
      }
    }

    // 确保DOM元素存在后再初始化图表
    const initChart = () => {
      const chartDom = document.getElementById('stockChart');
      if (!chartDom) {
        console.log('Chart DOM not ready, retrying...');
        setTimeout(initChart, 100);
        return;
      }

      if (!this.myChart) {
        this.initStockChart();
      }
      if (this.myChart) {
        this.myChart.resize();
        this.updateChart(30);
        const periodButtons = document.querySelectorAll('[data-days]');
        periodButtons.forEach(button => {
          const days = parseInt(button.getAttribute('data-days'));
          if (days === 30) {
            // Highlight the 30-day button
            button.classList.remove('inactive-period');
            button.classList.add('active-period');
          } else {
            // Make other buttons inactive
            button.classList.remove('active-period');
            button.classList.add('inactive-period');
          }
        });
        console.log('Chart initialized successfully');
      }
    };

    // 延迟初始化图表
    setTimeout(initChart, 200);
  }

  // 返回市场概览
  backToTradingPanel() {
    document.getElementById('stockDetailPanel').style.display = 'none';
    document.getElementById('stockDetailPanel').classList.add('hidden');
    document.getElementById('tradingPanel').style.display = 'block';
    document.getElementById('tradingPanel').classList.remove('hidden');
  }

  // 初始化图表
  initStockChart() {
    const chartDom = document.getElementById('stockChart');
    if (chartDom) {
      if (!this.myChart) {
        this.myChart = echarts.init(chartDom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });
      }
    }
  }

  // 生成模拟股票数据
  generateStockData(days = 30) {
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

  // 计算布林带
  calculateBollingerBands(data, period = 14, stdDev = 2) {
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

  // 计算Y轴范围
  calculateYAxisRange(data) {
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

  // 更新图表
  updateChart(days) {
    // 确保myChart已初始化
    if (!this.myChart) {
      this.initStockChart();
    }
    if (!this.myChart) {
      console.error('Chart not initialized');
      return;
    }

    const effectiveDays = Math.min(days, 90);
    const stockData = this.extractStockData(effectiveDays);

    // 检查数据是否有效
    if (!stockData || stockData.length === 0) {
      console.error('No valid stock data available');
      return;
    }

    const bollingerData = this.calculateBollingerBands(stockData);
    const [yMin, yMax] = this.calculateYAxisRange(stockData);

    console.log('Updating chart with', stockData.length, 'data points');

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
            color: '#EF4444',
            color0: '#10B981',
            borderColor: '#EF4444',
            borderColor0: '#10B981',
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

    this.myChart.setOption(option);
  }
}

// 创建全局stock detail panel实例
let stockDetailPanel;

// 初始化函数
function initStockDetailPanel() {
  if (!stockDetailPanel) {
    stockDetailPanel = new StockDetailPanel();
  }
}

// 全局函数，供HTML调用
async function showStockDetail(assetId) {
  if (stockDetailPanel) {
    await stockDetailPanel.showStockDetail(assetId);
  }
}

function backToTradingPanel() {
  if (stockDetailPanel) {
    stockDetailPanel.backToTradingPanel();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initStockDetailPanel();
  }, 500);
}); 