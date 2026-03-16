INSERT INTO users (id, email, password_hash, full_name, role, active, created_at, updated_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@carbon.local', '{noop}Admin123!', 'Platform Admin', 'ADMIN', TRUE, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'user@carbon.local', '{noop}User123!', 'Field User', 'USER', TRUE, NOW(), NOW());
