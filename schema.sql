CREATE TABLE user2(
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100)  NOT NULL
);
