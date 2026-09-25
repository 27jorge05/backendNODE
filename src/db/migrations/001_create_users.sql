CREATE TABLE users (
    id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT users_email_unique UNIQUE (email)
)   ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;