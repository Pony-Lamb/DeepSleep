SELECT A.user_name,
	         B.portfolio_name,
             A.data_date AS today,
             SUM(asset_value) AS today_value,
             yesterday,
	         yesterday_value
      FROM full_asset_value A
     #WHERE data_date = ?
     #AND user_name = ?
     #AND portfolio_name = ?
LEFT JOIN (SELECT user_name,
	              portfolio_name,
                  data_date AS yesterday,
                  SUM(asset_value) AS yesterday_value
           FROM full_asset_value
           WHERE data_date = date_add('2023-05-05', INTERVAL - 1 day)
          #AND user_name = ?
          #AND portfolio_name = ?
           GROUP BY user_name, portfolio_name) B
ON A.user_name = B.user_name
WHERE A.portfolio_name = B.portfolio_name
AND A.data_date = '2023-05-05'
GROUP BY user_name, portfolio_name