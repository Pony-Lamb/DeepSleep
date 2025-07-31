#查询-查用户名下，各投资组合资产利润，需要给到日期，用户姓名、投资组合名（可选）
SELECT C.user_name,
       C.portfolio_name,
	   today_value - yesterday_value as profit
FROM (SELECT A.user_name,
	         B.portfolio_name,
             SUM(asset_value) AS today_value,
	         yesterday_value
      FROM full_asset_value A
     #WHERE data_date = ?
     #AND user_name = ?
     #AND portfolio_name = ?
LEFT JOIN (SELECT user_name,
	              portfolio_name,
                  SUM(asset_value) AS yesterday_value
           FROM yesterday_asset_value
           WHERE data_date = date_add('2023-05-02', INTERVAL - 1 day)
          #AND user_name = ?
          #AND portfolio_name = ?
           GROUP BY user_name, portfolio_name) B
ON A.user_name = B.user_name
WHERE A.portfolio_name = B.portfolio_name
AND data_date = '2023-05-02'
GROUP BY user_name, portfolio_name) C