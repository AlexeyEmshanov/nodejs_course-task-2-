DROP TABLE IF EXISTS public."UserGroups" CASCADE;
DROP TABLE IF EXISTS public."Users" CASCADE;
DROP TABLE IF EXISTS public."Groups" CASCADE;

CREATE TABLE IF NOT EXISTS public."Users"
(
    id uuid,
    login text,
    password text,
    age integer,
    isDeleted boolean,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Users"
    VALUES
        ('77098ffa-cfc2-428a-a9eb-ce064b918b92', 'Alex', 'UserAPassword', 38, false),
        ('7c655945-f3e6-4beb-80b9-188c896b3066', 'Aleksei', 'UserBPassword', 38, false),
        ('199305fb-af58-4e0d-9728-d9bc26dc980c', 'Aurora', 'UserCPassword', 8, false),
        ('090cb9c2-2cc5-4f50-b2df-0f6257853056', 'Agata', 'UserDPassword', 6, false),
        ('9068ae85-e98e-48e6-9077-8ef27684317c', 'Aleksandra', 'UserEPassword', 38, false);

-- TABLESPACE pg_default;
--
-- ALTER TABLE IF EXISTS public."Users"
--     OWNER to postgres;

CREATE TABLE IF NOT EXISTS public."Groups"
(
    id uuid,
    name text,
    permission text [],
    CONSTRAINT "Groups_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Groups"
    VALUES
        ('0db8327d-fa5f-482c-9023-e6476eb3402a', 'Admins', ARRAY ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']),
        ('f3b7e3b4-9301-4e09-8450-2e647c40f217', 'Users', ARRAY ['READ', 'WRITE', 'SHARE']),
        ('64df4a8e-a02b-4426-a888-9610f4a81494', 'VIP Users', ARRAY ['READ', 'WRITE', 'SHARE', 'UPLOAD_FILES']);
-- TABLESPACE pg_default;
--
-- ALTER TABLE IF EXISTS public."Groups"
--     OWNER to postgres;

-- CREATE TABLE IF NOT EXISTS public."UserGroups"
-- (
--     "GroupId" uuid NOT NULL,
--     "UserId" uuid NOT NULL,
--     CONSTRAINT "UserGroups_pkey" PRIMARY KEY ("GroupId", "UserId"),
--     CONSTRAINT "UserGroups_UserId_fkey" FOREIGN KEY ("UserId")
--         REFERENCES public."Users" (id) MATCH SIMPLE
--         ON UPDATE CASCADE
--         ON DELETE CASCADE,
--     CONSTRAINT "UserGroups_User_name_fkey" FOREIGN KEY ("UserId")
--             REFERENCES public."Users" (id) MATCH SIMPLE
--             ON UPDATE CASCADE
--             ON DELETE CASCADE,
--     CONSTRAINT "UserGroups_GroupId_fkey" FOREIGN KEY ("GroupId")
--         REFERENCES public."Groups" (id) MATCH SIMPLE
--         ON UPDATE CASCADE
--         ON DELETE CASCADE
-- );

-- TABLESPACE pg_default;
--
-- ALTER TABLE IF EXISTS public."UserGroups"
--     OWNER to postgres;


