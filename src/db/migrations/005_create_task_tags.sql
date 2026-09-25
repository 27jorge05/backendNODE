CREATE TABLE task_tags (
    task_id CHAR(36) NOT NULL,
    tag_id CHAR(36) NOT NULL,

    PRIMARY KEY (task_id, tag_id),

    CONSTRAINT task_tags_task_id_foreign
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    CONSTRAINT task_tags_tag_id_foreign
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;