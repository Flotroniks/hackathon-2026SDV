INSERT INTO sites (
    id, name, code, address, city, country, total_area_m2, parking_spaces,
    annual_energy_consumption_kwh, energy_source, employee_count, archived,
    created_by, created_at, updated_at
) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Rennes Tech', 'REN-TECH', '15 Rue de la Rennes', 'Rennes', 'France', 3800.00, 85, 145000.00, 'ELECTRICITY_GRID', 150, FALSE, '3239f51e-fa52-4fe1-b4ad-3ef12da907c3', NOW(), NOW());

INSERT INTO site_materials (
    id, site_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, factor_source, created_at, updated_at
) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'CONCRETE', 'Rennes concrete', 250000.000, 'kg', 0.120000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'STEEL', 'Rennes steel beams', 38000.000, 'kg', 1.900000, 'Mock factors inspired by public ADEME Base Carbone references', NOW(), NOW());

INSERT INTO calculations (
    id, site_id, version_no, calculated_by, annual_energy_consumption_kwh_snapshot,
    energy_source_snapshot, energy_factor_kg_co2e_per_kwh,
    construction_emissions_kg_co2e, operation_emissions_kg_co2e, total_emissions_kg_co2e,
    co2_per_m2_kg, co2_per_employee_kg, factor_source, created_at
) VALUES
    ('cccccccc-cccc-cccc-cccc-ccccccccc003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 1, '3239f51e-fa52-4fe1-b4ad-3ef12da907c3', 145000.00, 'ELECTRICITY_GRID', 0.056000, 97200.000, 8120.000, 105320.000, 27.716842, 702.133333, 'Mock factors inspired by public ADEME Base Carbone references', NOW() - INTERVAL '3 days');

INSERT INTO calculation_material_snapshots (
    id, calculation_id, material_type, material_label, quantity, unit,
    emission_factor_kg_co2e_per_unit, emission_kg_co2e
) VALUES
    ('dddddddd-dddd-dddd-dddd-ddddddddd005', 'cccccccc-cccc-cccc-cccc-ccccccccc003', 'CONCRETE', 'Rennes concrete', 250000.000, 'kg', 0.120000, 30000.000),
    ('dddddddd-dddd-dddd-dddd-ddddddddd006', 'cccccccc-cccc-cccc-cccc-ccccccccc003', 'STEEL', 'Rennes steel beams', 38000.000, 'kg', 1.900000, 72200.000);
