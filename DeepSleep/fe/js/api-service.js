// API服务类 - 处理与后端API的通信
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api/v1';
        this.currentUserId = 1; // 默认用户ID，后续可以从登录系统获取
    }

    // 通用请求方法
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            console.log('API请求URL:', url);

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            console.log('API响应状态:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API错误响应:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API响应数据:', data);
            return data;
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }

    // 获取用户信息
    async getUserInfo(userId = this.currentUserId) {
        return await this.makeRequest(`/users/${userId}`);
    }

    // 搜索资产
    async searchAssets(content = '', date = this.getCurrentDate()) {
        const params = new URLSearchParams({
            content: content,
            date: date
        });
        return await this.makeRequest(`/asset/search?${params}`, {
            method: 'POST'
        });
    }

    // 获取资产详情
    async getAssetDetail(assetId) {
        console.log('=== getAssetDetail API 调用开始 ===');
        console.log('参数:', { assetId });

        const response = await this.makeRequest(`/asset/${assetId}`);

        console.log('getAssetDetail API 响应:', response);
        console.log('=== getAssetDetail API 调用完成 ===');

        return response;
    }

    // 获取资产历史价格
    async getAssetHistory(assetId, fromDate, toDate) {
        const params = new URLSearchParams({
            fromDate: fromDate,
            toDate: toDate
        });
        return await this.makeRequest(`/asset/prev/${assetId}?${params}`);
    }

    // 购买资产
    async buyAsset(assetId, portfolioName, quantity, date = this.getCurrentDate()) {
        const params = new URLSearchParams({
            asset_id: assetId,
            portfolio_name: portfolioName,
            num: quantity.toString(),
            date: date
        });
        return await this.makeRequest(`/asset/buy/${this.currentUserId}?${params}`, {
            method: 'POST'
        });
    }

    // 卖出资产
    async sellAsset(assetId, quantity, portfolioName, date = this.getCurrentDate()) {
        console.log('=== sellAsset API 调用开始 ===');
        console.log('参数:', { assetId, quantity, date, portfolioName, userId: this.currentUserId });

        const params = new URLSearchParams({
            asset_id: assetId,
            num: quantity.toString(),
            date: date,
            portfolio_name: portfolioName
        });

        const endpoint = `/asset/sell/${this.currentUserId}?${params}`;
        console.log('API端点:', endpoint);

        const response = await this.makeRequest(endpoint, {
            method: 'POST'
        });

        console.log('sellAsset API 响应:', response);
        console.log('=== sellAsset API 调用完成 ===');

        return response;
    }

    // 获取用户总资产
    async getTotalAsset(userId = this.currentUserId, date = this.getCurrentDate()) {
        return await this.makeRequest(`/asset/total/${userId}?date=${date}`);
    }

    // 获取投资组合名称列表
    async getPortfolioNames(userId = this.currentUserId) {
        return await this.makeRequest(`/portfolio/name/${userId}`);
    }

    // 创建新投资组合
    async createPortfolio(portfolioName, userId = this.currentUserId) {
        return await this.makeRequest(`/portfolio/create/${userId}?name=${encodeURIComponent(portfolioName)}`, {
            method: 'POST'
        });
    }

    // 获取投资组合详情
    async getPortfolioDetails(portfolioName) {
        return await this.makeRequest(`/portfolio/details?name=${encodeURIComponent(portfolioName)}`);
    }

    // 导出portfolio PDF报告
    async exportPortfolioPDF(portfolioName, userId = this.currentUserId) {
        try {
            const url = `${this.baseUrl}/portfolio/export/${userId}/${encodeURIComponent(portfolioName)}`;
            console.log('导出PDF URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('PDF导出错误:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 获取文件名
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `portfolio_report_${portfolioName}.pdf`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // 创建blob并下载
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return {
                code: 200,
                message: 'PDF导出成功',
                filename: filename
            };
        } catch (error) {
            console.error('PDF导出失败:', error);
            throw error;
        }
    }

    // 导出简化版portfolio PDF报告
    async exportSimplePortfolioPDF(portfolioName, userId = this.currentUserId) {
        try {
            const url = `${this.baseUrl}/portfolio/export/simple/${userId}/${encodeURIComponent(portfolioName)}`;
            console.log('导出简化PDF URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('简化PDF导出错误:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 获取文件名
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `portfolio_simple_${portfolioName}.pdf`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // 创建blob并下载
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return {
                code: 200,
                message: '简化PDF导出成功',
                filename: filename
            };
        } catch (error) {
            console.error('简化PDF导出失败:', error);
            throw error;
        }
    }

    // 获取当前日期（YYYY-MM-DD格式）
    getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 格式化价格显示
    formatPrice(price) {
        return parseFloat(price).toFixed(2);
    }

    // 格式化百分比显示
    formatPercentage(change) {
        const value = parseFloat(change);
        return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
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
}

// 创建全局API服务实例
const apiService = new ApiService(); 