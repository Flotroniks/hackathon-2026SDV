INSERT INTO sites (
    id, name, code, address, city, country, total_area_m2, parking_spaces,
    annual_energy_consumption_kwh, energy_source, employee_count, archived,
    created_by, created_at, updated_at
) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'HQ Paris', 'PAR-HQ', '12 Rue de la Transition', 'Paris', 'France', 4500.00, 120, 180000.00, 'ELECTRICITY_GRID', 240, FALSE, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Lyon Plant', 'LYN-PLANT', '8 Avenue Industrielle', 'Lyon', 'France', 7200.00, 210, 340000.00, 'NATURAL_GAS', 180, FALSE, '11111111-1111-1111-1111-111111111111', NOW(), NOW());

INSERT INTO site_materials (
    id, site_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, factor_source, created_at, updated_at
) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'CONCRETE', 'Concrete structure', 300000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'STEEL', 'Steel beams', 45000.000, 'kg', 1.900000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'CONCRETE', 'Foundation concrete', 520000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'GLASS', 'Facade glass', 22000.000, 'kg', 1.000000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW());

INSERT INTO calculations (
    id, site_id, version_no, calculated_by, annual_energy_consumption_kwh_snapshot,
    energy_source_snapshot, energy_factor_kg_co2e_per_kwh,
    construction_emissions_kg_co2e, operation_emissions_kg_co2e, total_emissions_kg_co2e,
    co2_per_m2_kg, co2_per_employee_kg, factor_source, created_at
) VALUES
    ('cccccccc-cccc-cccc-cccc-ccccccccc001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 1, '11111111-1111-1111-1111-111111111111', 180000.00, 'ELECTRICITY_GRID', 0.056000, 121500.000, 10080.000, 131580.000, 29.240000, 548.250000, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '2 days'),
    ('cccccccc-cccc-cccc-cccc-ccccccccc002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 1, '11111111-1111-1111-1111-111111111111', 340000.00, 'NATURAL_GAS', 0.227000, 84400.000, 77180.000, 161580.000, 22.441667, 897.666667, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '1 day');

INSERT INTO calculation_material_snapshots (
    id, calculation_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, emission_kg_co2e
) VALUES
    ('dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'CONCRETE', 'Concrete structure', 300000.000, 'kg', 0.120000, 36000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd002', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'STEEL', 'Steel beams', 45000.000, 'kg', 1.900000, 85500.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd003', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'CONCRETE', 'Foundation concrete', 520000.000, 'kg', 0.120000, 62400.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd004', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'GLASS', 'Facade glass', 22000.000, 'kg', 1.000000, 22000.000);
