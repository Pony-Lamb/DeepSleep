// Home Panel 功能模块
class HomePanel {
  constructor() {
    this.donutChart = null;
    this.lineChart = null;
    this.isVisible = true;
    this.userId = 1; // 可替换为动态 ID
    this.init();
  }

  // 初始化
  init() {
    console.log('HomePanel 初始化开始');
    this.initCharts();
    console.log("init charts home!")
    this.setupEventListeners();
    console.log("listener!")
    this.loadHomeData();
    console.log('HomePanel 初始化完成');
  }

  // 加载首页数据
  async loadHomeData() {
    try {
      const date = "2025-08-01";

      // 获取资产分布数据
      await this.loadAssetAllocation();

      // 获取总资产和收益信息
      await this.loadAssetAndProfitInfo(date);

      // 获取收益时间序列数据
      await this.loadProfitTimeSeries();

    } catch (error) {
      console.error('加载首页数据失败:', error);
    }
  }

  // 加载资产分布数据
  async loadAssetAllocation() {
    try {
      const allocationRes = await fetch(`http://localhost:5000/api/v1/asset/total/allocation/${this.userId}?date=2025-07-29`);
      const allocationData = await allocationRes.json();

      if (allocationData.code === 200 && this.donutChart) {
        // 将后端返回的数据转换为ECharts需要的格式
        const assetTypes = allocationData.data.asset_type || [];
        const assetPrices = allocationData.data.asset_total_price || [];

        const chartData = assetTypes.map((type, index) => ({
          name: type,
          value: parseFloat(assetPrices[index] || 0)
        }));

        this.donutChart.setOption({
          series: [{
            data: chartData
          }]
        });
      }
    } catch (error) {
      console.error('获取资产分布失败:', error);
    }
  }

  // 加载总资产和收益信息
  async loadAssetAndProfitInfo(date) {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/asset/total/${this.userId}?date=${date}`);
      const response_return_amount = await fetch(`http://localhost:5000/api/v1/users/${this.userId}`);
      const result = await response.json();
      const result_return_amount = await response_return_amount.json();

      if (response.ok && result.code === 200 && result_return_amount.code === 200) {
        const total = parseFloat(result.data.total_asset).toFixed(2);
        document.getElementById("totalAsset").textContent = `$${total}`;

        const returnAmount = parseFloat(result_return_amount.data.available_funds).toFixed(2);
        const display_number = total - returnAmount;
        // const returnAmountDisplay = document.getElementById("returnAmount");
        console.log(`display: ${display_number}`)
        document.getElementById("totalProfitNum").textContent = `$${display_number}`;
        document.getElementById("returnAmount").textContent = `$${returnAmount}`;
      } else {
        console.error("Failed to fetch total asset:", result.message);
      }

      // 获取收益率
      await this.loadProfitRate(date);

    } catch (error) {
      console.error('获取资产信息失败:', error);
    }
  }

  // 获取收益率
  async loadProfitRate(date) {
    try {
      const profitRes = await fetch(`http://localhost:5000/api/v1/profit/${this.userId}?date=${date}`);
      const profitData = await profitRes.json();

      const yesterday = this.getYesterdayDate(date);
      const assetRes = await fetch(`http://localhost:5000/api/v1/asset/total/${this.userId}?date=${yesterday}`);
      const assetData = await assetRes.json();
      console.log(`yesterday asset: ${assetData.data.total_asset}`);
      console.log(`profit: ${profitData.data.total_profit}`);

      if (profitData.code === 200 && assetData.code === 200) {
        const totalProfit = parseFloat(profitData.data.total_profit);
        const yesterdayAsset = parseFloat(assetData.data.total_asset);

        const rate = (yesterdayAsset !== 0)
          ? (totalProfit / yesterdayAsset * 100).toFixed(2)
          : "0.00";

        const profitRateElem = document.getElementById("profitRate");
        if (profitRateElem) {
          profitRateElem.textContent = `${rate}%`;
          profitRateElem.classList.toggle("text-red-400", totalProfit >= 0);
          profitRateElem.classList.toggle("text-gre-500", totalProfit < 0);
        }
      }
    } catch (error) {
      console.error('获取收益率失败:', error);
    }
  }

  // 获取昨日日期
  getYesterdayDate(dateStr) {
    const today = new Date(dateStr);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  // 加载收益时间序列数据
  async loadProfitTimeSeries() {
    try {
      const profitRes = await fetch(`http://localhost:5000/api/v1/profit/prev/${this.userId}?fromDate=2025-07-22&toDate=2025-07-29`);
      const resJson = await profitRes.json();
      const profits = resJson?.data?.profits || [];

      if (this.lineChart && profits.length > 0) {
        this.updateLineChartWithData(profits);
      }
    } catch (error) {
      console.error('获取收益时间序列失败:', error);
    }
  }

  // 用实际数据更新折线图
  updateLineChartWithData(profitData) {
    if (!this.lineChart) return;

    // 将字符串数组转换为数字数组
    const numericProfitData = profitData.map(profit => parseFloat(profit));

    // 根据数据长度生成对应的日期标签
    const xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, numericProfitData.length);

    this.lineChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        textStyle: {
          color: '#111827',
          fontSize: 13
        },
        formatter: function (params) {
          const point = params[0];
          return `${point.axisValue}<br/>Profit: <b>$${point.data}</b>`;
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: { interval: 0 }
      },
      yAxis: { type: 'value' },
      series: [{
        data: numericProfitData,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#3B82F6', width: 3 },
        areaStyle: { color: 'rgba(59, 130, 246, 0.15)' },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#3B82F6',
          borderColor: '#fff',
          borderWidth: 2
        }
      }]
    });
  }

  // 初始化图表
  initCharts() {
    setTimeout(() => {
      this.initDonutChart();
      this.initLineChart();
    }, 200);
  }

  // 初始化环形图
  initDonutChart() {
    const donutDom = document.getElementById('donutChart');
    if (donutDom) {
      this.donutChart = echarts.init(donutDom);
      this.donutChart.setOption({
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
      window.addEventListener('resize', () => this.donutChart.resize());
    }
  }

  // 初始化折线图
  initLineChart() {
    const lineDom = document.getElementById('lineChart');
    if (lineDom) {
      this.lineChart = echarts.init(lineDom);

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
      window.updateLineChart = (period) => {
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

        // 安全地设置按钮高亮
        const buttons = document.querySelectorAll('#timeButtons button');
        if (buttons[clicked]) {
          buttons[clicked].classList.add('text-blue-700', 'font-semibold');
        }

        this.lineChart.setOption({
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
      window.addEventListener('resize', () => this.lineChart.resize());
    }
  }

  // 设置事件监听器
  setupEventListeners() {
    // 设置可见性切换
    const toggleBtn = document.getElementById("toggleVisibility");
    const eyeIcon = document.getElementById("eyeIcon");
    const returnAmount = document.getElementById("returnAmount");
    const lineChart = document.getElementById("lineChart");

    if (toggleBtn && eyeIcon && returnAmount && lineChart) {
      toggleBtn.addEventListener("click", () => {
        this.isVisible = !this.isVisible;

        // 修改 iconify 的图标属性
        eyeIcon.setAttribute("icon", this.isVisible ? "mdi:eye-outline" : "mdi:eye-off-outline");

        // 显隐数据和图表
        returnAmount.style.display = this.isVisible ? "block" : "none";
        lineChart.style.display = this.isVisible ? "block" : "none";
      });
    }
  }

  // 刷新图表
  refresh() {
    if (this.donutChart) {
      this.donutChart.resize();
    }
    if (this.lineChart) {
      this.lineChart.resize();
    }
  }
}

// 创建全局home panel实例
let homePanel;

// 初始化函数
function initHomePanel() {
  if (!homePanel) {
    homePanel = new HomePanel();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initHomePanel();
  }, 500);
}); 