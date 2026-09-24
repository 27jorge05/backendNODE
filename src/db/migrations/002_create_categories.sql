CREATE TABLE categories (
    id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_id CHAR(36) NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT categories_user_name_unique
        UNIQUE (user_id, name),

    CONSTRAINT categories_user_id_foreign
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;