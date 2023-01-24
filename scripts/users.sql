DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id uuid,
    login text,
    password text,
    age integer,
    isDeleted boolean
);

INSERT INTO Users
    VALUES
        ('77098ffa-cfc2-428a-a9eb-ce064b918b92', 'Alex', 'UserAPassword', 38, false),
        ('7c655945-f3e6-4beb-80b9-188c896b3066', 'Aleksei', 'UserBPassword', 38, false),
        ('199305fb-af58-4e0d-9728-d9bc26dc980c', 'Aurora', 'UserCPassword', 8, false),
        ('090cb9c2-2cc5-4f50-b2df-0f6257853056', 'Agata', 'UserDPassword', 6, false),
        ('9068ae85-e98e-48e6-9077-8ef27684317c', 'Aleksandra', 'UserEPassword', 38, false);
