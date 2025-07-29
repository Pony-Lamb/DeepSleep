CREATE DATABASE DeepSleep;
USE DeepSleep;

#股市信息表，记录各类股票详细数据
CREATE TABLE assets (
    asset_id VARCHAR(50) NOT NULL,
    asset_name VARCHAR(100) NOT NULL,
    open_price FLOAT,
    high_price FLOAT,
    low_price FLOAT,
    close_price FLOAT,
    category VARCHAR(50),
    data_date DATE
   #PRIMARY KEY (asset_id) #stock_id作为主键
);


#投资组合持仓信息表
CREATE TABLE portfolio (
    portfolio_name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    asset_id VARCHAR(50),
    quantity INT
   #PRIMARY KEY (portfolio_name) #portfolio_name作为主键
);


#用户信息表，展示用户详细信息
CREATE TABLE user_info (
	user_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    available_funds FLOAT #现金余额
   #PRIMARY KEY (user_id) #portfolio_name作为主键
);


                   