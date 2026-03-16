CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sites (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'France',
    total_area_m2 NUMERIC(12, 2) NOT NULL CHECK (total_area_m2 > 0),
    parking_spaces INT NOT NULL DEFAULT 0 CHECK (parking_spaces >= 0),
    annual_energy_consumption_kwh NUMERIC(14, 2) NOT NULL CHECK (annual_energy_consumption_kwh >= 0),
    energy_source VARCHAR(50) NOT NULL,
    employee_count INT NOT NULL DEFAULT 0 CHECK (employee_count >= 0),
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE site_materials (
    id UUID PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    material_type VARCHAR(50) NOT NULL,
    material_label VARCHAR(100) NOT NULL,
    quantity NUMERIC(14, 3) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL,
    emission_factor_kg_co2e_per_unit NUMERIC(14, 6) NOT NULL,
    factor_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE calculations (
    id UUID PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES sites(id),
    version_no INT NOT NULL,
    calculated_by UUID NOT NULL REFERENCES users(id),
    annual_energy_consumption_kwh_snapshot NUMERIC(14, 2) NOT NULL,
    energy_source_snapshot VARCHAR(50) NOT NULL,
    energy_factor_kg_co2e_per_kwh NUMERIC(14, 6) NOT NULL,
    construction_emissions_kg_co2e NUMERIC(14, 3) NOT NULL,
    operation_emissions_kg_co2e NUMERIC(14, 3) NOT NULL,
    total_emissions_kg_co2e NUMERIC(14, 3) NOT NULL,
    co2_per_m2_kg NUMERIC(14, 6) NOT NULL,
    co2_per_employee_kg NUMERIC(14, 6),
    factor_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (site_id, version_no)
);

CREATE TABLE calculation_material_snapshots (
    id UUID PRIMARY KEY,
    calculation_id UUID NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
    material_type VARCHAR(50) NOT NULL,
    material_label VARCHAR(100) NOT NULL,
    quantity NUMERIC(14, 3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    emission_factor_kg_co2e_per_unit NUMERIC(14, 6) NOT NULL,
    emission_kg_co2e NUMERIC(14, 3) NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sites_archived ON sites(archived);
CREATE INDEX idx_sites_code ON sites(code);
CREATE INDEX idx_site_materials_site_id ON site_materials(site_id);
CREATE INDEX idx_calculations_site_created_at ON calculations(site_id, created_at DESC);
CREATE INDEX idx_calculation_snapshots_calculation_id ON calculation_material_snapshots(calculation_id);
