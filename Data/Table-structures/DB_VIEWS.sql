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
                   GROUP BY C.asset_id)
                   