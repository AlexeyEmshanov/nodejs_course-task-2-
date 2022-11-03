DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id text,
    login text,
    password text,
    age integer,
    isDeleted boolean
);

INSERT INTO Users
    VALUES
        ('111', 'UserA', 'UserAPassword', 38, false),
        ('222', 'UserB', 'UserBPassword', 38, false),
        ('333', 'UserC', 'UserCPassword', 8, false),
        ('444', 'UserD', 'UserDPassword', 6, false),
        ('555', 'UserE', 'UserEPassword', 10, false);
