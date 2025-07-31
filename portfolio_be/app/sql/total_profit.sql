SELECT C.user_name,
       C.portfolio_name,
	   today_value - yesterday_value as profit
FROM (SELECT A.user_name,
	         B.portfolio_name,
             SUM(asset_value) AS today_value,
	         yesterday_value
      FROM full_asset_value A
LEFT JOIN (SELECT user_name,
	              portfolio_name,
                  SUM(asset_value) AS yesterday_value
           FROM full_asset_value
           WHERE data_date = date_add(:date, INTERVAL - 1 day)
           AND user_id = :user_id
           GROUP BY user_name, portfolio_name) B
ON A.user_name = B.user_name
WHERE A.portfolio_name = B.portfolio_name
AND data_date = :date
GROUP BY user_name, portfolio_name) C;

