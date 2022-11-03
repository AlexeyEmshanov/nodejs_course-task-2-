DROP TABLE IF EXISTS users;

CREATE TABLE users (
    login text,
    password text,
    age integer,
    isDeleted boolean
);

INSERT INTO users
    VALUES
        ('UserA', 'UserAPassword', 38, false),
        ('UserB', 'UserBPassword', 38, false),
        ('UserC', 'UserCPassword', 8, false),
        ('UserD', 'UserDPassword', 6, false),
        ('UserE', 'UserEPassword', 10, false);
