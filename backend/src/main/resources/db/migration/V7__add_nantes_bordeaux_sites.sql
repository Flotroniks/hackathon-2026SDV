INSERT INTO sites (
    id, name, code, address, city, country, total_area_m2, parking_spaces,
    annual_energy_consumption_kwh, energy_source, employee_count, archived,
    created_by, created_at, updated_at
) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Nantes Hub', 'NAN-HUB', '20 Quai de la Loire', 'Nantes', 'France', 5200.00, 140, 210000.00, 'NATURAL_GAS', 200, FALSE, '3239f51e-fa52-4fe1-b4ad-3ef12da907c3', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Bordeaux Campus', 'BDX-CAMP', '25 Cours de l''Intendance', 'Bordeaux', 'France', 6800.00, 180, 275000.00, 'ELECTRICITY_GRID', 260, FALSE, '3239f51e-fa52-4fe1-b4ad-3ef12da907c3', NOW(), NOW());

INSERT INTO site_materials (
    id, site_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, factor_source, created_at, updated_at
) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'CONCRETE', 'Nantes foundation', 420000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'GLASS', 'Nantes facade', 28000.000, 'kg', 1.000000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb009', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'CONCRETE', 'Bordeaux structure', 550000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb010', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'STEEL', 'Bordeaux beams', 62000.000, 'kg', 1.900000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW());

INSERT INTO calculations (
    id, site_id, version_no, calculated_by, annual_energy_consumption_kwh_snapshot,
    energy_source_snapshot, energy_factor_kg_co2e_per_kwh,
    construction_emissions_kg_co2e, operation_emissions_kg_co2e, total_emissions_kg_co2e,
    co2_per_m2_kg, co2_per_employee_kg, factor_source, created_at
) VALUES
    ('cccccccc-cccc-cccc-cccc-ccccccccc004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 1, '3239f51e-fa52-4fe1-b4ad-3ef12da907c3', 210000.00, 'NATURAL_GAS', 0.227000, 118400.000, 47670.000, 166070.000, 31.936538, 830.350000, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '2 days'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 1, '3239f51e-fa52-4fe1-b4ad-3ef12da907c3', 275000.00, 'ELECTRICITY_GRID', 0.056000, 152400.000, 15400.000, 167800.000, 24.676471, 645.384615, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '1 day');

INSERT INTO calculation_material_snapshots (
    id, calculation_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, emission_kg_co2e
) VALUES
    ('dddddddd-dddd-dddd-dddd-ddddddddd007', 'cccccccc-cccc-cccc-cccc-ccccccccc004', 'CONCRETE', 'Nantes foundation', 420000.000, 'kg', 0.120000, 50400.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd008', 'cccccccc-cccc-cccc-cccc-ccccccccc004', 'GLASS', 'Nantes facade', 28000.000, 'kg', 1.000000, 28000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd009', 'cccccccc-cccc-cccc-cccc-ccccccccc005', 'CONCRETE', 'Bordeaux structure', 550000.000, 'kg', 0.120000, 66000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd010', 'cccccccc-cccc-cccc-cccc-ccccccccc005', 'STEEL', 'Bordeaux beams', 62000.000, 'kg', 1.900000, 117800.000);
