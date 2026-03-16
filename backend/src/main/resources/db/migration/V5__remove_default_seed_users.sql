DELETE FROM calculation_material_snapshots;
DELETE FROM calculations;
DELETE FROM site_materials;
DELETE FROM sites;
DELETE FROM users
WHERE email IN ('admin@carbon.local', 'user@carbon.local');
