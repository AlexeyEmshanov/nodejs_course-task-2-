DROP TABLE users;

CREATE TABLE users (
    login text,
    password text,
    age integer,
    isDeleted boolean
);

INSERT INTO users
    VALUES
        ('Alex', 'AlexPassword', 38, false),
        ('Alexandra', 'AlexandraPassword', 38, false),
        ('Aurora', 'AuroraPassword', 8, false),
        ('Agata', 'AgataPassword', 6, false),
        ('Barca', 'BarcaPassword', 10, false);
