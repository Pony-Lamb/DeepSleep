async function getRealStockData(symbol) {
  try {
    // real api url
    const response = await fetch(`http://192.168.1.101:5000/api/v1/asset/prev/${symbol}?fromDate=2025-05-01&toDate=2025-07-30`);

    console.log("reponse: ", response);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    return null;
  }
}

// 展示股票详情
async function showStockDetail(symbol) {
  // 统一用switchPanel切换面板
  switchPanel('stockDetailPanel');

  current_details = await getRealStockData(symbol);
  console.log("Successfully fetched stock data.");
  console.log("current_details: ", current_details);

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
    if (stock.change < 0) {
      changeDiv.innerHTML = `<iconify-icon icon="mdi:trending-down" class="text-green-500 mr-1"></iconify-icon>
        <span class="text-green-600 font-bold">+${stock.change}%</span>`;
    } else {
      changeDiv.innerHTML = `<iconify-icon icon="mdi:trending-up" class="text-red-500 mr-1"></iconify-icon>
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

var current_details = {
  symbol: "SYMBOL",
  name: "Stock Name",
  open: [],
  close: [],
  high: [],
  low: [],
  timestamps: []
}

function extractStockData(days = 30) {
  console.log("extracting stock data for", days, "days");
  
  // Check if we have valid data
  if (!current_details || !current_details.data) {
    console.error("Invalid data structure in current_details");
    return [];
  }

  const result = [];
  const data = current_details.data;
  
  // Get the latest date from the data
  const totalPoints = data.dates.length;
  if (totalPoints === 0) {
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
  // const stockData = generateStockData(effectiveDays);
  const stockData = extractStockData(effectiveDays);
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

  myChart.setOption(option);
}