# Portfolio Management Platform - Backend

## 📚 Table of Contents

- [1 Introduction](#1-introduction)
- [2 How to Deploy?](#2-how-to-deploy)
    - [2.1 Use Conda Environment](#21-use-conda-environment)
- [3 API Interfaces](#3-api-interfaces)

## 1 Introduction

(To be done)

## 2 How to Deploy?

### 2.1 Use Conda Environment

```
conda create -n myenv python=3.9
conda activate myenv
pip install -r requirements.txt
```

### 2.2 Run Project

```
python run.py
```

## 3 API Interfaces

| **Category**           | **Functionality**               | **Method** | **Url**                                                 | **Description**                                                                                                                  |
|------------------------|---------------------------------|------------|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Home page              | Get user information            | `GET`      | `/api/v1/users/{user_id}`                               | Get user personal information by user ID.                                                                                        |
| Home page              | Get total asset                 | `GET`      | `/api/v1/asset/total/{user_id}`                         | Get total asset by user ID.                                                                                                      |
| Home page              | Get profit                      | `GET`      | `/api/v1/profit/{user_id}`                              | Get profit by user ID and date. If parameter(portfolio_name) is empty, return total asset. If not empty, return portfolio asset. |
| Home page              | Get total asset allocation      | `GET`      | `/api/v1/asset/total/allocation/{user_id}`              | Get total asset allocation details by user ID.                                                                                   |
| Home page              | Get previous profit             | `GET`      | `/api/v1/profit/prev/{user_id}`                         | Get profit of the latest several days by user ID.                                                                                |
| Search page            | Search stocks/cash/bonds/others | `POST`     | `/api/v1/asset/search`                                  | Search asserts(stocks/cash/bonds/others) by content. If content is empty, return all asserts.                                    |
| Search page            | Buy assets                      | `POST`     | `/api/v1/asset/buy/{asset_id}/{portfolio_id}/{user_id}` | Buy assets(stocks/cash/bonds) and store in a specific portfolio.                                                                 |
| Asset information page | Get details of an asset         | `GET`      | `/api/v1/asset/{asset_id}`                              | Get details of an asset(stock/cash/bond/others) by asset ID.                                                                     |
| Asset information page | Get previous price of an asset  | `GET`      | `/api/v1/asset/prev/{asset_id}`                         | Get asset(stock/cash/bond/others) price(high/low/close/open) of the latest several days by asset ID.                             |
| Portfolio page         | Get portfolio names             | `GET`      | `/api/v1/portfolio/name/{user_id}`                      | Get portfolio names by user ID.                                                                                                  |
| Portfolio page         | Create a portfolio              | `POST`     | `/api/v1/portfolio/create/{user_id}`                    | Create portfolio names by user ID.                                                                                               |
| Portfolio page         | Get details of a portfolio      | `GET`      | `/api/v1/portfolio/{portfolio_id}`                      | Get details of a portfolio by portfolio ID.                                                                                      |
| Portfolio page         | Sell assets                     | `POST`     | `/api/v1/asset/sell/{asset_id}/{user_id}`               | Sell assets(stocks/cash/bonds).                                                                                                  |

### 3.1 Get user information

**📍API**

``` bash
GET /api/v1/users/{user_id}
```

**🧾Request Parameters**

*None*

**✅ Successful Response**

```json
{
  "code": 200,
  "data": {
    "available_funds": 50000.0,
    "name": "张三",
    "user_id": 1
  },
  "message": "Successfully retrieved user information!"
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "Invalid user."
}
```

### 3.2 Get total asset

**📍API**

``` bash
GET /api/v1/asset/total/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                    |
|-----------|------|-----------|--------------|--------------------------------|
| date      | str  | Yes       | '2023-05-01' | User total asset of which date |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved total asset!",
  "data": {
    "total_asset": "8943.12"
  }
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid date."
}
```

```json
{
  "code": 404,
  "message": "Total asset is not found."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.3 Get profit

**📍API**

``` bash
GET /api/v1/profit/{user_id}
```

**🧾Request Parameters**

| Parameter      | Type | Mandatory | Example      | Description                     |
|----------------|------|-----------|--------------|---------------------------------|
| date           | str  | Yes       | '2023-05-05' | User total profit of which date |
| portfolio_name | str  | No        | '稳健投资'       | Portfolio name.                 |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved profit!",
  "data": {
    "total_profit": "180.00"
  }
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid date."
}
```

### 3.4 Get total asset allocation

**📍API**

``` bash
GET /api/v1/asset/total/allocation/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                                |
|-----------|------|-----------|--------------|--------------------------------------------|
| date      | str  | Yes       | '2023-05-01' | User total asset allocation of which date. |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved total asset allocation!",
  "data": {
    "asset_type": [
      "stocks",
      "cash",
      "bonds",
      "others"
    ],
    "asset_total_price": [
      "18049.00",
      "13520.00",
      "12448.00"
    ]
  }
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid user or date."
}
```

### 3.5 Get previous profit

**📍API**

``` bash
GET /api/v1/profit/prev/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                        |
|-----------|------|-----------|--------------|------------------------------------|
| fromDate  | str  | Yes       | '2023-05-04' | User total profit from which date. |
| toDate    | str  | Yes       | '2023-05-05' | User total profit to which date.   |

**✅ Successful Response**

```json
{
  "code": 200,
  "data": {
    "dates": [
      "2023-05-03",
      "2023-05-04",
      "2023-05-05"
    ],
    "profits": [
      "172.00",
      "-543.00",
      "370.00"
    ]
  },
  "message": "Successfully retrieved profit!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid date."
}
```

### 3.6 Search stocks/cash/bonds/others

**📍API**

``` bash
POST /api/v1/asset/search
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                                                                            |
|-----------|------|-----------|--------------|----------------------------------------------------------------------------------------|
| content   | str  | No        | 'A'          | Search asserts(stocks/cash/bonds) by content. If content is empty, return all asserts. |
| date      | str  | Yes       | '2023-05-01' | Asset details of which date.                                                           |

**✅ Successful Response**

```json
{
  "code": 200,
  "data": [
    {
      "asset_id": "AAPL",
      "category": "科技",
      "close_price": "151.80",
      "data_date": "2023-05-01",
      "high_price": "152.75",
      "low_price": "149.25",
      "name": "苹果公司",
      "open_price": "150.50"
    },
    {
      "asset_id": "GOOGL",
      "category": "科技",
      "close_price": "106.30",
      "data_date": "2023-05-01",
      "high_price": "107.20",
      "low_price": "104.50",
      "name": "谷歌A类股",
      "open_price": "105.75"
    },
    {
      "asset_id": "TSLA",
      "category": "科技",
      "close_price": "166.75",
      "data_date": "2023-05-01",
      "high_price": "168.90",
      "low_price": "162.30",
      "name": "特斯拉",
      "open_price": "165.40"
    },
    {
      "asset_id": "NVDA",
      "category": "科技",
      "close_price": "273.25",
      "data_date": "2023-05-01",
      "high_price": "275.80",
      "low_price": "268.40",
      "name": "英伟达",
      "open_price": "270.60"
    },
    {
      "asset_id": "BAC",
      "category": "金融",
      "close_price": "32.60",
      "data_date": "2023-05-01",
      "high_price": "32.90",
      "low_price": "32.10",
      "name": "美国银行",
      "open_price": "32.45"
    },
    {
      "asset_id": "AMZN",
      "category": "消费",
      "close_price": "111.75",
      "data_date": "2023-05-01",
      "high_price": "112.40",
      "low_price": "109.50",
      "name": "亚马逊",
      "open_price": "110.30"
    }
  ],
  "message": "Successfully searched!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid date."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.7 Buy assets

**📍API**

``` bash
POST /api/v1/asset/buy/{user_id}
```

**🧾Request Parameters**

| Parameter      | Type   | Mandatory | Example      | Description                                   |
|----------------|--------|-----------|--------------|-----------------------------------------------|
| asset_id       | string | Yes       | XOM          | Which assets you want to buy?                 |
| portfolio_name | string | Yes       | 长期持有         | Which portfolio you want to put these assets? |
| num            | int    | Yes       | 10           | How many assets you want to buy?              |
| date           | str    | Yes       | '2023-05-01' | Today's date.                                 |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully buy assets!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid number of assets."
}
```

```json
{
  "code": 400,
  "message": "Insufficient funds."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.8 Get details of an asset

**📍API**

``` bash
GET /api/v1/asset/{asset_id}
```

**🧾Request Parameters**

*None*

**✅ Successful Response**

```json
{
  "code": 200,
  "data": {
    "asset_id": "AAPL",
    "category": "科技",
    "name": "苹果公司"
  },
  "message": "Successfully retrieved asset information!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid asset ID."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.9 Get previous price of an asset

**📍API**

``` bash
GET /api/v1/asset/prev/{asset_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                       |
|-----------|------|-----------|--------------|-----------------------------------|
| fromDate  | str  | Yes       | '2025-07-29' | Asset previous price (start date) |
| toDate    | str  | Yes       | '2025-07-23' | Asset previous price (end date)   |

**✅ Successful Response**

```json
{
  "code": 200,
  "data": {
    "close_prices": [
      "151.80",
      "153.40",
      "150.30",
      "152.50",
      "153.80"
    ],
    "dates": [
      "2023-05-01",
      "2023-05-02",
      "2023-05-03",
      "2023-05-04",
      "2023-05-05"
    ],
    "high_prices": [
      "152.75",
      "154.25",
      "153.80",
      "153.20",
      "154.50"
    ],
    "low_prices": [
      "149.25",
      "151.50",
      "149.75",
      "150.20",
      "152.20"
    ],
    "open_prices": [
      "150.50",
      "152.00",
      "153.20",
      "150.80",
      "152.80"
    ]
  },
  "message": "Successfully retrieved previous asset price!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid asset ID or date."
}
```

```json
{
  "code": 400,
  "message": "Invalid date format. Use YYYY-MM-DD."
}
```

```json
{
  "code": 404,
  "message": "No asset data found."
}
```

### 3.10 Get portfolio names

**📍API**

``` bash
GET /api/v1/portfolio/name/{user_id}
```

**🧾Request Parameters**

*None*

**✅ Successful Response**

```json
{
  "code": 200,
  "data": {
    "portfolios": [
      "科技爱好者",
      "稳健投资"
    ]
  },
  "message": "Successfully retrieved portfolio names!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid user."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.11 Create a portfolio

**📍API**

``` bash
POST /api/v1/portfolio/create/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example       | Description     |
|-----------|------|-----------|---------------|-----------------|
| name      | str  | Yes       | 'portfolio_D' | Portfolio name. |

```json
{
  "code": 200,
  "message": "Successfully created a portfolio!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid user ID or portfolio name."
}
```

```json
{
  "code": 400,
  "message": "Portfolio with this name already exists for the user."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.12 Get details of a portfolio

**📍API**

``` bash
GET /api/v1/portfolio/details
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example | Description     |
|-----------|------|-----------|---------|-----------------|
| name      | str  | Yes       | '长期持有'  | Portfolio name. |

**✅ Successful Response**

```json
{
  "code": 200,
  "data": [
    {
      "asset_id": "AMZN",
      "quantity": 40
    },
    {
      "asset_id": "XOM",
      "quantity": 60
    },
    {
      "asset_id": "JNJ",
      "quantity": 50
    }
  ],
  "len": 3,
  "message": "Successfully retrieved portfolio information!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Invalid portfolio name."
}
```

### 3.13 Sell assets

**📍API**

``` bash
POST /api/v1/asset/sell/{asset_id}/{user_id}
```

**🧾Request Parameters**

| Parameter      | Type   | Mandatory | Example      | Description                       |
|----------------|--------|-----------|--------------|-----------------------------------|
| asset_id       | string | Yes       | XOM          | Which assets you want to sell?    |
| num            | int    | Yes       | 10           | How many assets you want to sell? |
| date           | str    | Yes       | '2023-05-01' | Today's date.                     |
| portfolio_name | str    | Yes       | '长期持有'       | Portfolio name.                   |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully sell assets!"
}
```

**❌ Error Response**

```json
{
  "code": 400,
  "message": "Internal Server Error."
}
```

```json
{
  "code": 400,
  "message": "Invalid number of assets."
}
```

```json
{
  "code": 404,
  "message": "Asset not found."
}
```

```json
{
  "code": 404,
  "message": "No such asset in your portfolio."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```
