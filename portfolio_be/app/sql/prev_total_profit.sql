SELECT C.user_name,
       C.portfolio_name,
       C.data_date,
       today_value - COALESCE(yesterday_value, 0) AS profit
FROM (
    SELECT
        A.user_name,
        A.portfolio_name,
        A.data_date,
        SUM(A.asset_value) AS today_value,
        (
            SELECT SUM(asset_value)
            FROM full_asset_value
            WHERE data_date = DATE_ADD(A.data_date, INTERVAL -1 DAY)
              AND user_id = :user_id
              AND user_name = A.user_name
              AND portfolio_name = A.portfolio_name
        ) AS yesterday_value
    FROM full_asset_value A
    WHERE A.data_date BETWEEN :from_date AND :to_date
      AND A.user_id = :user_id
    GROUP BY A.user_name, A.portfolio_name, A.data_date
) C
ORDER BY C.data_date, C.user_name, C.portfolio_name;
