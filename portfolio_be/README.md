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

| **Category**           | **Functionality**               | **Method** | **Url**                                                 | **Description**                                                                                      |
|------------------------|---------------------------------|------------|---------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Home page              | Get user information            | `GET`      | `/api/v1/users/{user_id}`                               | Get user personal information by user ID.                                                            |
| Home page              | Get total asset                 | `GET`      | `/api/v1/asset/total/{user_id}`                         | Get total asset by user ID.                                                                          |
| Home page              | Get total profit                | `GET`      | `/api/v1/profit/total/{user_id}`                        | Get total profit by user ID.                                                                         |
| Home page              | Get total asset allocation      | `GET`      | `/api/v1/asset/total/allocation/{user_id}`              | Get total asset allocation details by user ID.                                                       |
| Home page              | Get previous profit             | `GET`      | `/api/v1/profit/prev/{user_id}`                         | Get profit of the latest several days by user ID.                                                    |
| Search page            | Search stocks/cash/bonds/others | `POST`     | `/api/v1/asset/search`                                  | Search asserts(stocks/cash/bonds/others) by content. If content is empty, return all asserts.        |
| Search page            | Buy assets                      | `POST`     | `/api/v1/asset/buy/{asset_id}/{portfolio_id}/{user_id}` | Buy assets(stocks/cash/bonds) and store in a specific portfolio.                                     |
| Asset information page | Get details of an asset         | `GET`      | `/api/v1/asset/{asset_id}`                              | Get details of an asset(stock/cash/bond/others) by asset ID.                                         |
| Asset information page | Get previous price of an asset  | `GET`      | `/api/v1/asset/prev/{asset_id}`                         | Get asset(stock/cash/bond/others) price(high/low/close/open) of the latest several days by asset ID. |
| Portfolio page         | Get portfolio names             | `GET`      | `/api/v1/portfolio/name/{user_id}`                      | Get portfolio names by user ID.                                                                      |
| Portfolio page         | Create a portfolio              | `POST`     | `/api/v1/portfolio/create/{user_id}`                    | Create portfolio names by user ID.                                                                   |
| Portfolio page         | Get details of a portfolio      | `GET`      | `/api/v1/portfolio/{portfolio_id}`                      | Get details of a portfolio by portfolio ID.                                                          |
| Portfolio page         | Sell assets                     | `POST`     | `/api/v1/asset/sell/{asset_id}/{user_id}`               | Sell assets(stocks/cash/bonds).                                                                      |

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
  "message": "Successfully retrieved user information!",
  "data": {
    "user_id": 1,
    "name": "user_1"
  }
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
  "code": 404,
  "message": "Invalid user or date."
}
```

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.3 Get total profit

**📍API**

``` bash
GET /api/v1/profit/total/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                     |
|-----------|------|-----------|--------------|---------------------------------|
| date      | str  | Yes       | '2025-07-29' | User total profit of which date |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved total profit!",
  "data": {
    "total_profit": "324.73"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "Invalid user or date."
}
```

### 3.4 Get total asset allocation

**📍API**

``` bash
GET /api/v1/asset/total/allocation/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                               |
|-----------|------|-----------|--------------|-------------------------------------------|
| date      | str  | Yes       | '2025-07-29' | User total asset allocation of which date |

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
      "41.39",
      "12.00",
      "0.00",
      "6.30"
    ]
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "Invalid user or date."
}
```

### 3.5 Get previous profit

**📍API**

``` bash
GET /api/v1/profit/prev/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                       |
|-----------|------|-----------|--------------|-----------------------------------|
| fromDate  | str  | Yes       | '2025-07-29' | User total profit from which date |
| toDate    | str  | Yes       | '2025-07-22' | User total profit to which date   |

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved previous profit!",
  "data": {
    "profits": [
      "31.83",
      "22.33",
      "-25.55",
      "1.11",
      "63.99",
      "-32.00",
      "24.36"
    ]
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "Invalid user or date."
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
  "code": 500,
  "message": "Internal Server Error."
}
```

```json
{
  "code": 404,
  "message": "Invalid user."
}
```

### 3.7 Buy assets

**📍API**

``` bash
POST /api/v1/asset/buy/{asset_id}/{portfolio_id}/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example | Description                      |
|-----------|------|-----------|---------|----------------------------------|
| num       | int  | Yes       | 10      | How many assets you want to buy? |

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
  "code": 404,
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
  "message": "Successfully retrieved previous asset price!",
  "data": {
    "dates": [
      "2025-07-23",
      "2025-07-24",
      "2025-07-25",
      "2025-07-26",
      "2025-07-27",
      "2025-07-28",
      "2025-07-29"
    ],
    "high_prices": [
      "31.83",
      "31.01",
      "29.57",
      "30.20",
      "31.92",
      "32.50",
      "32.83"
    ],
    "low_prices": [
      "31.83",
      "31.01",
      "29.57",
      "30.20",
      "31.92",
      "32.50",
      "32.83"
    ],
    "close_prices": [
      "31.83",
      "31.01",
      "29.57",
      "30.20",
      "31.92",
      "32.50",
      "32.83"
    ],
    "open_prices": [
      "31.83",
      "31.01",
      "29.57",
      "30.20",
      "31.92",
      "32.50",
      "32.83"
    ]
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "Invalid asset ID or date."
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
  "code": 404,
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
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.12 Get details of a portfolio

**📍API**

``` bash
GET /api/v1/portfolio/{portfolio_id}
```

**🧾Request Parameters**

*None*

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved portfolio information!",
  "data": [
    {
      "portfolio_name": "portfolio_A",
      "user_id": 1,
      "asset_id": "AAPL",
      "quantity": 10
    },
    {
      "portfolio_name": "portfolio_A",
      "user_id": 1,
      "asset_id": "TSLA",
      "quantity": 30
    }
  ]
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "Invalid portfolio ID."
}
```

### 3.13 Sell assets

**📍API**

``` bash
POST /api/v1/asset/sell/{asset_id}/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example | Description                       |
|-----------|------|-----------|---------|-----------------------------------|
| num       | int  | Yes       | 10      | How many assets you want to sell? |

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
  "code": 500,
  "message": "Internal Server Error."
}
```
