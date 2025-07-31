#视图-全表，仅查询数据结构，按需使用
#CREATE VIEW full_table AS
SELECT *
FROM portfolio A
LEFT JOIN user_info B
ON A.user_id = B.user_id
LEFT JOIN assets C
ON A.asset_id = C.asset_id;