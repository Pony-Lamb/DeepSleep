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

| **Category**           | **Functionality**               | **Method** | **Url**                                             | **Description**                                                                               |
|------------------------|---------------------------------|------------|-----------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Home page              | Get user information            | `GET`      | `/v1/users/{user_id}`                               | Get user personal information by user ID.                                                     |
| Home page              | Get total asset                 | `GET`      | `/v1/asset/total/{user_id}`                         | Get total asset by user ID.                                                                   |
| Home page              | Get total profit                | `GET`      | `/v1/profit/total/{user_id}`                        | Get total profit by user ID.                                                                  |
| Home page              | Get total asset allocation      | `GET`      | `/v1/asset/total/allocation/{user_id}`              | Get total asset allocation details by user ID.                                                |
| Home page              | Get previous profit             | `GET`      | `/v1/profit/prev/{user_id}`                         | Get profit of the latest several days by user ID.                                             |
| Search page            | Search stocks/cash/bonds/others | `POST`     | `/v1/search`                                        | Search asserts(stocks/cash/bonds/others) by content. If content is empty, return all asserts. |
| Search page            | Buy assets                      | `POST`     | `/v1/asset/buy/{asset_id}/{portfolio_id}/{user_id}` | Buy assets(stocks/cash/bonds) and store in a specific portfolio.                              |
| Stock information page | Get details of a stock          | `GET`      | `/v1/asset/{asset_id}`                              | Get details of an asset(stock/cash/bond/others) by asset ID.                                  |
| Stock information page | Get previous price of a stock   | `GET`      | `/v1/asset/prev/{asset_id}`                         | Get asset(stock/cash/bond/others) price of the latest several days by asset ID.               |
| Portfolio page         | Get portfolio names             | `GET`      | `/v1/portfolio/name/{user_id}`                      | Get portfolio names by user ID.                                                               |
| Portfolio page         | Create a portfolio              | `POST`     | `/v1/portfolio/create/{user_id}`                    | Create portfolio names by user ID.                                                            |
| Portfolio page         | Get details of a portfolio      | `GET`      | `/v1/portfolio/{portfolio_id}`                      | Get details of a portfolio by portfolio ID.                                                   |
| Portfolio page         | Sell assets                     | `POST`     | `/v1/asset/sell/{asset_id}/{user_id}`               | Sell assets(stocks/cash/bonds).                                                               |

### 3.1 Get user information

**📍API**

``` bash
GET /v1/users/{user_id}
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
    "name": "user_1",
    "email": "user1@mail.com"
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
GET /v1/asset/total/{user_id}
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example      | Description                    |
|-----------|------|-----------|--------------|--------------------------------|
| date      | str  | Yes       | '2025-07-29' | User total asset of which date |

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

### 3.3 Get total profit

**📍API**

``` bash
GET /v1/profit/total/{user_id}
```

**🧾Request Parameters**

*None*

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
GET /v1/asset/total/allocation/{user_id}
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
GET /v1/profit/prev/{user_id}
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
POST /v1/search
```

**🧾Request Parameters**

| Parameter | Type | Mandatory | Example | Description |
|-----------|------|-----------|------|-------------|
| content   | str  | No        | 'A'  | Search asserts(stocks/cash/bonds) by content. If content is empty, return all asserts.     |


**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully searched！",
  "data": [
    {
      "asset_id": "AAPL",
      "name": "xxx stock",
      "category": "stocks",
      "price": "35.19",
      "change": "0.0351",
      "peg": "peg",
      "dividend": "dividend"
    }, 
    {
      "asset_id": "AMZN",
      "name": "yyy stock",
      "category": "stocks",
      "price": "9.66",
      "change": "0.1902",
      "peg": "peg",
      "dividend": "dividend"
    }
  ]
}
```

**❌ Error Response**

```json
{
  "code": 500,
  "message": "Internal Server Error."
}
```

### 3.7 Buy assets

**📍API**

``` bash
POST /v1/asset/buy/{asset_id}/{portfolio_id}/{user_id}
```

**🧾Request Parameters**

*None*

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

### 3.8 Get details of a stock

**📍API**

``` bash
GET /v1/users/{user_id}
```

**🧾Request Parameters**

*None*

[//]: # (| Parameter | Type | Mandatory | Example | Description |)

[//]: # (|--------|-|-----------|---------|-------------|)

[//]: # (| user_id | int | Yes       | 12345   | user id     |)

[//]: # (| expand | bool | No        | true    | xx          |)

**🧾Headers**

*None*

[//]: # (| Header         | Mandatory | Example                      | Description      |)

[//]: # (|----------------|-----------|-----------------------------|-----------|)

[//]: # (| Authorization  | Yes       | Bearer eyJhbGciOiJIUzI1...  | Token    |)

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved user information",
  "data": {
    "user_id": 1,
    "name": "user_1",
    "email": "user1@mail.com"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "User not found."
}
```

### 3.1 Get user information

**📍API**

``` bash
GET /v1/users/{user_id}
```

**🧾Request Parameters**

*None*

[//]: # (| Parameter | Type | Mandatory | Example | Description |)

[//]: # (|--------|-|-----------|---------|-------------|)

[//]: # (| user_id | int | Yes       | 12345   | user id     |)

[//]: # (| expand | bool | No        | true    | xx          |)

**🧾Headers**

*None*

[//]: # (| Header         | Mandatory | Example                      | Description      |)

[//]: # (|----------------|-----------|-----------------------------|-----------|)

[//]: # (| Authorization  | Yes       | Bearer eyJhbGciOiJIUzI1...  | Token    |)

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved user information",
  "data": {
    "user_id": 1,
    "name": "user_1",
    "email": "user1@mail.com"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "User not found."
}
```

### 3.1 Get user information

**📍API**

``` bash
GET /v1/users/{user_id}
```

**🧾Request Parameters**

*None*

[//]: # (| Parameter | Type | Mandatory | Example | Description |)

[//]: # (|--------|-|-----------|---------|-------------|)

[//]: # (| user_id | int | Yes       | 12345   | user id     |)

[//]: # (| expand | bool | No        | true    | xx          |)

**🧾Headers**

*None*

[//]: # (| Header         | Mandatory | Example                      | Description      |)

[//]: # (|----------------|-----------|-----------------------------|-----------|)

[//]: # (| Authorization  | Yes       | Bearer eyJhbGciOiJIUzI1...  | Token    |)

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved user information",
  "data": {
    "user_id": 1,
    "name": "user_1",
    "email": "user1@mail.com"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "User not found."
}
```

### 3.1 Get user information

**📍API**

``` bash
GET /v1/users/{user_id}
```

**🧾Request Parameters**

*None*

[//]: # (| Parameter | Type | Mandatory | Example | Description |)

[//]: # (|--------|-|-----------|---------|-------------|)

[//]: # (| user_id | int | Yes       | 12345   | user id     |)

[//]: # (| expand | bool | No        | true    | xx          |)

**🧾Headers**

*None*

[//]: # (| Header         | Mandatory | Example                      | Description      |)

[//]: # (|----------------|-----------|-----------------------------|-----------|)

[//]: # (| Authorization  | Yes       | Bearer eyJhbGciOiJIUzI1...  | Token    |)

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved user information",
  "data": {
    "user_id": 1,
    "name": "user_1",
    "email": "user1@mail.com"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "User not found."
}
```

### 3.1 Get user information

**📍API**

``` bash
GET /v1/users/{user_id}
```

**🧾Request Parameters**

*None*

[//]: # (| Parameter | Type | Mandatory | Example | Description |)

[//]: # (|--------|-|-----------|---------|-------------|)

[//]: # (| user_id | int | Yes       | 12345   | user id     |)

[//]: # (| expand | bool | No        | true    | xx          |)

**🧾Headers**

*None*

[//]: # (| Header         | Mandatory | Example                      | Description      |)

[//]: # (|----------------|-----------|-----------------------------|-----------|)

[//]: # (| Authorization  | Yes       | Bearer eyJhbGciOiJIUzI1...  | Token    |)

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved user information",
  "data": {
    "user_id": 1,
    "name": "user_1",
    "email": "user1@mail.com"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "User not found."
}
```

### 3.1 Get user information

**📍API**

``` bash
GET /v1/users/{user_id}
```

**🧾Request Parameters**

*None*

[//]: # (| Parameter | Type | Mandatory | Example | Description |)

[//]: # (|--------|-|-----------|---------|-------------|)

[//]: # (| user_id | int | Yes       | 12345   | user id     |)

[//]: # (| expand | bool | No        | true    | xx          |)

**🧾Headers**

*None*

[//]: # (| Header         | Mandatory | Example                      | Description      |)

[//]: # (|----------------|-----------|-----------------------------|-----------|)

[//]: # (| Authorization  | Yes       | Bearer eyJhbGciOiJIUzI1...  | Token    |)

**✅ Successful Response**

```json
{
  "code": 200,
  "message": "Successfully retrieved user information",
  "data": {
    "user_id": 1,
    "name": "user_1",
    "email": "user1@mail.com"
  }
}
```

**❌ Error Response**

```json
{
  "code": 404,
  "message": "User not found."
}
```
