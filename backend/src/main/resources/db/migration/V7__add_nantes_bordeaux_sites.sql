INSERT INTO sites (
    id, name, code, address, city, country, total_area_m2, parking_spaces,
    annual_energy_consumption_kwh, energy_source, employee_count, archived,
    created_by, created_at, updated_at
) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Nantes Hub', 'NAN-HUB', '20 Quai de la Loire', 'Nantes', 'France', 5200.00, 140, 210000.00, 'NATURAL_GAS', 200, FALSE, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Bordeaux Campus', 'BDX-CAMP', '25 Cours de l''Intendance', 'Bordeaux', 'France', 6800.00, 180, 275000.00, 'ELECTRICITY_GRID', 260, FALSE, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Lille Center', 'LIL-CENT', '18 Boulevard de la Liberte', 'Lille', 'France', 4100.00, 95, 162000.00, 'ELECTRICITY_GRID', 145, FALSE, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Marseille Port Office', 'MRS-PORT', '6 Quai du Port', 'Marseille', 'France', 5900.00, 130, 238000.00, 'NATURAL_GAS', 210, FALSE, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'Toulouse Lab', 'TLS-LAB', '14 Avenue de l''Innovation', 'Toulouse', 'France', 4700.00, 110, 186000.00, 'ELECTRICITY_GRID', 170, FALSE, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'Strasbourg Campus', 'STR-CAMP', '9 Rue des Freres Lumiere', 'Strasbourg', 'France', 6300.00, 150, 252000.00, 'DISTRICT_HEATING', 230, FALSE, '33333333-3333-3333-3333-333333333333', NOW(), NOW());

INSERT INTO site_materials (
    id, site_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, factor_source, created_at, updated_at
) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'CONCRETE', 'Nantes foundation', 420000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'GLASS', 'Nantes facade', 28000.000, 'kg', 1.000000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb009', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'CONCRETE', 'Bordeaux structure', 550000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb010', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'STEEL', 'Bordeaux beams', 62000.000, 'kg', 1.900000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb011', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'CONCRETE', 'Lille slab', 260000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb012', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'STEEL', 'Lille frames', 29000.000, 'kg', 1.900000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb013', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'CONCRETE', 'Marseille concrete core', 380000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb014', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'GLASS', 'Marseille facade', 36000.000, 'kg', 1.000000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb015', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'CONCRETE', 'Toulouse structure', 310000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb016', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'WOOD', 'Toulouse wood partitions', 18000.000, 'kg', 0.200000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb017', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'CONCRETE', 'Strasbourg base', 470000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb018', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'STEEL', 'Strasbourg beams', 41000.000, 'kg', 1.900000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW());

INSERT INTO calculations (
    id, site_id, version_no, calculated_by, annual_energy_consumption_kwh_snapshot,
    energy_source_snapshot, energy_factor_kg_co2e_per_kwh,
    construction_emissions_kg_co2e, operation_emissions_kg_co2e, total_emissions_kg_co2e,
    co2_per_m2_kg, co2_per_employee_kg, factor_source, created_at
) VALUES
    ('cccccccc-cccc-cccc-cccc-ccccccccc004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 1, '33333333-3333-3333-3333-333333333333', 210000.00, 'NATURAL_GAS', 0.227000, 118400.000, 47670.000, 166070.000, 31.936538, 830.350000, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '2 days'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1, '33333333-3333-3333-3333-333333333333', 275000.00, 'ELECTRICITY_GRID', 0.056000, 152400.000, 15400.000, 167800.000, 24.676471, 645.384615, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '1 day'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 1, '33333333-3333-3333-3333-333333333333', 162000.00, 'ELECTRICITY_GRID', 0.056000, 86300.000, 9072.000, 95372.000, 23.261463, 657.737931, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '4 days'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 1, '33333333-3333-3333-3333-333333333333', 238000.00, 'NATURAL_GAS', 0.227000, 81600.000, 54026.000, 135626.000, 22.987458, 645.838095, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '3 days'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 1, '33333333-3333-3333-3333-333333333333', 186000.00, 'ELECTRICITY_GRID', 0.056000, 40800.000, 10416.000, 51216.000, 10.897021, 301.270588, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '2 days'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc009', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 1, '33333333-3333-3333-3333-333333333333', 252000.00, 'DISTRICT_HEATING', 0.150000, 134300.000, 37800.000, 172100.000, 27.317460, 748.260870, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '1 day');

INSERT INTO calculation_material_snapshots (
    id, calculation_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, emission_kg_co2e
) VALUES
    ('dddddddd-dddd-dddd-dddd-ddddddddd007', 'cccccccc-cccc-cccc-cccc-ccccccccc004', 'CONCRETE', 'Nantes foundation', 420000.000, 'kg', 0.120000, 50400.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd008', 'cccccccc-cccc-cccc-cccc-ccccccccc004', 'GLASS', 'Nantes facade', 28000.000, 'kg', 1.000000, 28000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd009', 'cccccccc-cccc-cccc-cccc-ccccccccc005', 'CONCRETE', 'Bordeaux structure', 550000.000, 'kg', 0.120000, 66000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd010', 'cccccccc-cccc-cccc-cccc-ccccccccc005', 'STEEL', 'Bordeaux beams', 62000.000, 'kg', 1.900000, 117800.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd011', 'cccccccc-cccc-cccc-cccc-ccccccccc006', 'CONCRETE', 'Lille slab', 260000.000, 'kg', 0.120000, 31200.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd012', 'cccccccc-cccc-cccc-cccc-ccccccccc006', 'STEEL', 'Lille frames', 29000.000, 'kg', 1.900000, 55100.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd013', 'cccccccc-cccc-cccc-cccc-ccccccccc007', 'CONCRETE', 'Marseille concrete core', 380000.000, 'kg', 0.120000, 45600.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd014', 'cccccccc-cccc-cccc-cccc-ccccccccc007', 'GLASS', 'Marseille facade', 36000.000, 'kg', 1.000000, 36000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd015', 'cccccccc-cccc-cccc-cccc-ccccccccc008', 'CONCRETE', 'Toulouse structure', 310000.000, 'kg', 0.120000, 37200.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd016', 'cccccccc-cccc-cccc-cccc-ccccccccc008', 'WOOD', 'Toulouse wood partitions', 18000.000, 'kg', 0.200000, 3600.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd017', 'cccccccc-cccc-cccc-cccc-ccccccccc009', 'CONCRETE', 'Strasbourg base', 470000.000, 'kg', 0.120000, 56400.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd018', 'cccccccc-cccc-cccc-cccc-ccccccccc009', 'STEEL', 'Strasbourg beams', 41000.000, 'kg', 1.900000, 77900.000);
