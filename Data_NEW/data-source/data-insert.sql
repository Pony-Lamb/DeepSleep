#User Information Data
INSERT INTO user_info (user_name, available_funds) VALUES
('Michael Johnson', 150000.00),
('Sarah Williams', 225000.00),
('David Lee', 85000.00),
('Emily Chen', 320000.00),
('Robert Kim', 110000.00),
('Jennifer Park', 180000.00),
('Thomas Brown', 75000.00),
('Jessica Garcia', 195000.00),
('Daniel Wilson', 280000.00),
('Lisa Martinez', 135000.00);
COMMIT;
#Continuous Assets Data
-- May 1-5, 2023 (Week 1)
INSERT INTO assets (asset_id, asset_name, open_price, high_price, low_price, close_price, category, data_date) VALUES
('AAPL', 'Apple Inc.', 172.50, 174.85, 171.60, 173.95, 'Technology', '2023-05-01'),
('MSFT', 'Microsoft Corporation', 319.40, 322.75, 318.20, 321.85, 'Technology', '2023-05-01'),
('TSLA', 'Tesla Inc.', 163.50, 166.85, 162.20, 165.40, 'Automotive', '2023-05-01'),
('GOOGL', 'Alphabet Inc.', 118.40, 120.85, 117.60, 119.95, 'Technology', '2023-05-01'),
('AMZN', 'Amazon.com Inc.', 111.75, 114.20, 110.90, 113.60, 'E-commerce', '2023-05-01'),

('AAPL', 'Apple Inc.', 174.10, 176.45, 173.60, 175.80, 'Technology', '2023-05-02'),
('MSFT', 'Microsoft Corporation', 322.20, 325.15, 321.40, 324.25, 'Technology', '2023-05-02'),
('TSLA', 'Tesla Inc.', 165.75, 168.40, 164.90, 167.25, 'Automotive', '2023-05-02'),
('JPM', 'JPMorgan Chase & Co.', 136.15, 138.20, 135.40, 137.75, 'Financial', '2023-05-02'),
('NVDA', 'NVIDIA Corporation', 275.40, 278.75, 273.90, 277.20, 'Technology', '2023-05-02'),

('AAPL', 'Apple Inc.', 175.95, 177.30, 174.40, 176.60, 'Technology', '2023-05-03'),
('MSFT', 'Microsoft Corporation', 324.50, 326.85, 323.20, 325.75, 'Technology', '2023-05-03'),
('TSLA', 'Tesla Inc.', 167.40, 169.15, 166.20, 168.50, 'Automotive', '2023-05-03'),
('WMT', 'Walmart Inc.', 148.25, 150.40, 147.30, 149.75, 'Retail', '2023-05-03'),
('XOM', 'Exxon Mobil Corporation', 100.40, 102.25, 99.60, 101.90, 'Energy', '2023-05-03'),

('AAPL', 'Apple Inc.', 176.75, 178.20, 175.90, 177.45, 'Technology', '2023-05-04'),
('MSFT', 'Microsoft Corporation', 325.90, 328.25, 324.60, 327.40, 'Technology', '2023-05-04'),
('TSLA', 'Tesla Inc.', 168.65, 170.80, 167.40, 169.95, 'Automotive', '2023-05-04'),
('PG', 'Procter & Gamble', 149.60, 151.85, 148.70, 150.90, 'Consumer Goods', '2023-05-04'),
('BTC-USD', 'Bitcoin USD', 27140.00, 27460.00, 26920.00, 27330.00, 'Cryptocurrency', '2023-05-04'),

('AAPL', 'Apple Inc.', 177.60, 179.15, 176.20, 178.75, 'Technology', '2023-05-05'),
('MSFT', 'Microsoft Corporation', 327.60, 329.95, 326.20, 328.85, 'Technology', '2023-05-05'),
('AMZN', 'Amazon.com Inc.', 114.20, 116.45, 113.30, 115.75, 'E-commerce', '2023-05-05'),
('JPM', 'JPMorgan Chase & Co.', 137.90, 139.45, 136.80, 138.95, 'Financial', '2023-05-05'),
('GOOGL', 'Alphabet Inc.', 120.25, 122.40, 119.50, 121.85, 'Technology', '2023-05-05');

-- May 8-12, 2023 (Week 2)
INSERT INTO assets (asset_id, asset_name, open_price, high_price, low_price, close_price, category, data_date) VALUES
('AAPL', 'Apple Inc.', 178.80, 181.15, 177.90, 180.20, 'Technology', '2023-05-08'),
('MSFT', 'Microsoft Corporation', 322.40, 325.75, 321.10, 324.60, 'Technology', '2023-05-08'),
('TSLA', 'Tesla Inc.', 167.90, 170.45, 166.20, 168.75, 'Automotive', '2023-05-08'),
('JPM', 'JPMorgan Chase & Co.', 135.25, 137.40, 134.60, 136.85, 'Financial', '2023-05-08'),
('WMT', 'Walmart Inc.', 149.90, 151.75, 148.80, 150.95, 'Retail', '2023-05-08'),

('AAPL', 'Apple Inc.', 180.35, 182.60, 179.40, 181.85, 'Technology', '2023-05-09'),
('MSFT', 'Microsoft Corporation', 324.75, 327.10, 323.50, 326.30, 'Technology', '2023-05-09'),
('TSLA', 'Tesla Inc.', 168.90, 171.25, 167.60, 170.40, 'Automotive', '2023-05-09'),
('XOM', 'Exxon Mobil Corporation', 101.15, 103.30, 100.40, 102.75, 'Energy', '2023-05-09'),
('PG', 'Procter & Gamble', 151.00, 153.25, 150.20, 152.40, 'Consumer Goods', '2023-05-09'),

('AAPL', 'Apple Inc.', 182.00, 183.35, 180.80, 182.60, 'Technology', '2023-05-10'),
('MSFT', 'Microsoft Corporation', 326.45, 328.80, 325.10, 327.95, 'Technology', '2023-05-10'),
('AMZN', 'Amazon.com Inc.', 115.40, 117.65, 114.50, 116.90, 'E-commerce', '2023-05-10'),
('GOOGL', 'Alphabet Inc.', 121.60, 123.75, 120.80, 122.95, 'Technology', '2023-05-10'),
('BTC-USD', 'Bitcoin USD', 27380.00, 27690.00, 27210.00, 27540.00, 'Cryptocurrency', '2023-05-10'),

('AAPL', 'Apple Inc.', 182.75, 184.10, 181.30, 183.45, 'Technology', '2023-05-11'),
('MSFT', 'Microsoft Corporation', 328.10, 330.45, 326.80, 329.60, 'Technology', '2023-05-11'),
('TSLA', 'Tesla Inc.', 170.65, 172.90, 169.20, 171.85, 'Automotive', '2023-05-11'),
('JPM', 'JPMorgan Chase & Co.', 137.20, 139.35, 136.10, 138.50, 'Financial', '2023-05-11'),
('WMT', 'Walmart Inc.', 150.40, 152.15, 149.20, 151.60, 'Retail', '2023-05-11'),

('AAPL', 'Apple Inc.', 183.60, 185.95, 182.70, 184.80, 'Technology', '2023-05-12'),
('MSFT', 'Microsoft Corporation', 329.75, 332.10, 328.40, 331.25, 'Technology', '2023-05-12'),
('TSLA', 'Tesla Inc.', 171.90, 174.25, 170.60, 173.20, 'Automotive', '2023-05-12'),
('AMZN', 'Amazon.com Inc.', 116.60, 118.85, 115.70, 118.20, 'E-commerce', '2023-05-12'),
('GOOGL', 'Alphabet Inc.', 122.85, 124.90, 121.90, 124.15, 'Technology', '2023-05-12');
COMMIT;
#Portfolio Data with Continuous Dates
-- Initial positions (May 1)
INSERT INTO portfolio (portfolio_name, user_id, asset_id, quantity, portfolio_date) VALUES
('Tech Growth', 1, 'AAPL', 100, '2023-05-01'),
('Tech Growth', 1, 'MSFT', 50, '2023-05-01'),
('Income Portfolio', 2, 'JPM', 200, '2023-05-01'),
('Income Portfolio', 2, 'PG', 150, '2023-05-01'),
('Aggressive', 3, 'TSLA', 300, '2023-05-01'),
('Aggressive', 3, 'BTC-USD', 10, '2023-05-01'),
('Balanced', 4, 'AAPL', 75, '2023-05-01'),
('Balanced', 4, 'JPM', 100, '2023-05-01'),
('Retirement', 5, 'XOM', 250, '2023-05-01'),
('Retirement', 5, 'WMT', 200, '2023-05-01');

-- May 3 updates (some trades executed)
INSERT INTO portfolio (portfolio_name, user_id, asset_id, quantity, portfolio_date) VALUES
('Tech Growth', 1, 'AAPL', 120, '2023-05-03'), -- bought more AAPL
('Tech Growth', 1, 'MSFT', 45, '2023-05-03'), -- sold some MSFT
('Tech Growth', 1, 'GOOGL', 30, '2023-05-03'), -- new position
('Income Portfolio', 2, 'JPM', 180, '2023-05-03'), -- reduced position
('Income Portfolio', 2, 'WMT', 100, '2023-05-03'), -- new position
('Aggressive', 3, 'TSLA', 350, '2023-05-03'), -- added more TSLA
('Balanced', 4, 'AAPL', 60, '2023-05-03'), -- reduced position
('Balanced', 4, 'AMZN', 50, '2023-05-03'), -- new position
('Retirement', 5, 'XOM', 200, '2023-05-03'), -- reduced position
('Retirement', 5, 'PG', 100, '2023-05-03'); -- new position

-- May 8 updates (more portfolio changes)
INSERT INTO portfolio (portfolio_name, user_id, asset_id, quantity, portfolio_date) VALUES
('Tech Growth', 1, 'AAPL', 130, '2023-05-08'),
('Tech Growth', 1, 'MSFT', 40, '2023-05-08'),
('Tech Growth', 1, 'GOOGL', 35, '2023-05-08'),
('Tech Growth', 1, 'NVDA', 25, '2023-05-08'), -- new position
('Income Portfolio', 2, 'JPM', 150, '2023-05-08'),
('Income Portfolio', 2, 'WMT', 120, '2023-05-08'),
('Income Portfolio', 2, 'XOM', 80, '2023-05-08'), -- new position
('Aggressive', 3, 'TSLA', 400, '2023-05-08'),
('Aggressive', 3, 'BTC-USD', 8, '2023-05-08'), -- reduced position
('Balanced', 4, 'AAPL', 70, '2023-05-08'),
('Balanced', 4, 'AMZN', 60, '2023-05-08'),
('Balanced', 4, 'JPM', 80, '2023-05-08'),
('Retirement', 5, 'XOM', 180, '2023-05-08'),
('Retirement', 5, 'PG', 120, '2023-05-08'),
('Retirement', 5, 'WMT', 150, '2023-05-08');

-- May 12 updates (end of period)
INSERT INTO portfolio (portfolio_name, user_id, asset_id, quantity, portfolio_date) VALUES
('Tech Growth', 1, 'AAPL', 150, '2023-05-12'),
('Tech Growth', 1, 'MSFT', 35, '2023-05-12'),
('Tech Growth', 1, 'GOOGL', 40, '2023-05-12'),
('Tech Growth', 1, 'NVDA', 30, '2023-05-12'),
('Income Portfolio', 2, 'JPM', 130, '2023-05-12'),
('Income Portfolio', 2, 'WMT', 150, '2023-05-12'),
('Income Portfolio', 2, 'XOM', 70, '2023-05-12'),
('Income Portfolio', 2, 'PG', 100, '2023-05-12'), -- added back
('Aggressive', 3, 'TSLA', 450, '2023-05-12'),
('Aggressive', 3, 'BTC-USD', 5, '2023-05-12'),
('Balanced', 4, 'AAPL', 80, '2023-05-12'),
('Balanced', 4, 'AMZN', 70, '2023-05-12'),
('Balanced', 4, 'JPM', 60, '2023-05-12'),
('Balanced', 4, 'MSFT', 20, '2023-05-12'), -- new position
('Retirement', 5, 'XOM', 150, '2023-05-12'),
('Retirement', 5, 'PG', 150, '2023-05-12'),
('Retirement', 5, 'WMT', 120, '2023-05-12');
COMMIT;