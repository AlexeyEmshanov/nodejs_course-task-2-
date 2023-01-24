DROP TABLE IF EXISTS Groups;

CREATE TABLE Groups (
    id uuid,
    name text,
    permission text []
);

INSERT INTO Groups
    VALUES
        ('0db8327d-fa5f-482c-9023-e6476eb3402a', 'Admins', ARRAY ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']),
        ('f3b7e3b4-9301-4e09-8450-2e647c40f217', 'Users', ARRAY ['READ', 'WRITE', 'SHARE']),
        ('64df4a8e-a02b-4426-a888-9610f4a81494', 'VIP Users', ARRAY ['READ', 'WRITE', 'SHARE', 'UPLOAD_FILES'])
