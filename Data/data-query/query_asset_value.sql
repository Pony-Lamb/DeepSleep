#查询-查用户名下，各投资组合资产市值，需要给到日期，用户姓名、投资组合名（可选）
SELECT user_name,
	   portfolio_name,
       SUM(asset_value) AS market_value
FROM full_asset_value
#WHERE data_date = ?
#AND user_name = ?
#AND portfolio_name = ?
GROUP BY user_name, portfolio_name;

#查询-饼状图各类资产市值，需要给到日期（必须），用户姓名、投资组合名（可选）
SELECT user_name,
	   portfolio_name,
	   category,
       SUM(asset_value) AS market_value
FROM full_asset_value
#WHERE data_date = ?
#AND user_name = ?
#AND portfolio_name = ?
GROUP BY user_name, portfolio_name, category;

#查询-查用户名下，各投资组合下各类各项资产市值，需要给到日期，用户姓名、投资组合名（可选）
SELECT user_name,
	   portfolio_name,
	   category,
	   asset_id,
	   asset_name,
       SUM(asset_value) AS market_value
FROM full_asset_value
#WHERE data_date = ?
#AND user_name = ?
#AND portfolio_name = ?
GROUP BY user_name, portfolio_name, category, asset_id, asset_name;