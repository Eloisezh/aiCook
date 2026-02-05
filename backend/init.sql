CREATE DATABASE IF NOT EXISTS smart_kitchen;
USE smart_kitchen;
CREATE TABLE IF NOT EXISTS user_config (
    id INT PRIMARY KEY DEFAULT 1,
    staples TEXT,
    preferences TEXT
);
INSERT IGNORE INTO user_config (id, staples, preferences) VALUES (1, '生抽, 老抽, 盐, 蚝油, 蒜, 姜', '不吃辣，喜欢鲜味');
