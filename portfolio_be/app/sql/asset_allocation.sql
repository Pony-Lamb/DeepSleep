SELECT user_name,
	   portfolio_name,
	   category,
       SUM(asset_value) AS market_value
FROM full_asset_value
WHERE data_date = :date
AND user_id = :user_id
#AND portfolio_name = ?
GROUP BY user_name, portfolio_name, category;