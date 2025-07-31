Use DeepSleep;

#视图-股市表，用户购买股票时的选择列表
CREATE VIEW asset_list AS
SELECT DISTINCT asset_id, asset_name, category
FROM assets
ORDER BY asset_id DESC;

#视图-资产市值表，展示持仓各股票的今日市值，需要定义portfolio_name
CREATE VIEW market_price AS
SELECT A.asset_id,
	   (SELECT open_price * quantity) AS asset_value #股票市值
FROM portfolio A
LEFT JOIN assets B
ON A.asset_id = B.asset_id
WHERE data_date = (SELECT MAX(data_date)
				   FROM assets C
                   WHERE C.asset_id = b.asset_id
                   GROUP BY C.asset_id);
                   				   
#视图-投资组合资产市值表，展示用户各投资组合的市值
CREATE VIEW portfolio_daily_value AS
SELECT ROW_NUMBER() OVER (ORDER BY B.user_id, A.portfolio_name, data_date) AS id,
       B.user_id,
       B.user_name,
	   A.portfolio_name,
	   data_date,
	   SUM(C.open_price * A.quantity) AS asset_value
FROM portfolio A
LEFT JOIN user_info B
ON A.user_id = B.user_id
LEFT JOIN assets C
ON A.asset_id = C.asset_id
GROUP BY B.user_id, B.user_name, A.portfolio_name, data_date;

#视图-用户投资组合表，返回各用户持有的投资组合
CREATE VIEW user_portfolios AS
SELECT DISTINCT A.user_id,
	   A.user_name,
	   B.portfolio_name
FROM user_info A, portfolio B
WHERE A.user_id = B.user_id;

#视图-昨日市值
CREATE VIEW yesterday_asset_value AS
SELECT B.user_id,
	   B.user_name,
	   A.portfolio_name,
	   C.asset_id,
	   C.asset_name,
       C.open_price,
       C.category,
       C.data_date,	   
	   (C.open_price * A.quantity) AS asset_value
FROM portfolio A
LEFT JOIN user_info B
ON A.user_id = B.user_id
LEFT JOIN assets C
ON A.asset_id = C.asset_id
WHERE A.portfolio_date = C.data_date;

#视图-今日市值
CREATE VIEW full_asset_value AS
SELECT B.user_id,
	   B.user_name,
	   A.portfolio_name,
	   C.asset_id,
	   C.asset_name,
       C.open_price,
       C.category,
       C.data_date,	   
	   (C.open_price * A.quantity) AS asset_value
FROM portfolio A
LEFT JOIN user_info B
ON A.user_id = B.user_id
LEFT JOIN assets C
ON A.asset_id = C.asset_id
WHERE A.portfolio_date = date_add(C.data_date, INTERVAL - 1 day);

