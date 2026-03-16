export type EnergySource =
  | 'ELECTRICITY_GRID'
  | 'NATURAL_GAS'
  | 'DISTRICT_HEATING'
  | 'FUEL_OIL';

export type MaterialType =
  | 'CONCRETE'
  | 'STEEL'
  | 'GLASS'
  | 'WOOD'
  | 'ALUMINUM'
  | 'BRICK';

export interface MaterialInput {
  materialType: MaterialType;
  materialLabel: string;
  quantity: number;
  unit: string;
}

export interface SiteRequest {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  totalAreaM2: number;
  parkingSpaces: number;
  annualEnergyConsumptionKwh: number;
  energySource: EnergySource;
  employeeCount: number;
  materials: MaterialInput[];
}

export interface SiteMaterialResponse extends MaterialInput {
  id: string;
  emissionFactorKgCo2ePerUnit: number;
  factorSource: string;
}

export interface SiteListItemResponse {
  id: string;
  name: string;
  code: string;
  city: string;
  totalAreaM2: number;
  employeeCount: number;
  energySource: EnergySource;
  latestTotalEmissionsKgCo2e: number | null;
  latestCalculatedAt: string | null;
}

export interface SiteResponse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  totalAreaM2: number;
  parkingSpaces: number;
  annualEnergyConsumptionKwh: number;
  energySource: EnergySource;
  employeeCount: number;
  archived: boolean;
  materials: SiteMaterialResponse[];
  latestCalculation: {
    id: string;
    versionNo: number;
    totalEmissionsKgCo2e: number;
    constructionEmissionsKgCo2e: number;
    operationEmissionsKgCo2e: number;
    calculatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const energySourceOptions: { value: EnergySource; label: string }[] = [
  { value: 'ELECTRICITY_GRID', label: 'Grid electricity' },
  { value: 'NATURAL_GAS', label: 'Natural gas' },
  { value: 'DISTRICT_HEATING', label: 'District heating' },
  { value: 'FUEL_OIL', label: 'Fuel oil' },
];

export const materialTypeOptions: { value: MaterialType; label: string; unit: string }[] = [
  { value: 'CONCRETE', label: 'Concrete', unit: 'kg' },
  { value: 'STEEL', label: 'Steel', unit: 'kg' },
  { value: 'GLASS', label: 'Glass', unit: 'kg' },
  { value: 'WOOD', label: 'Wood', unit: 'kg' },
  { value: 'ALUMINUM', label: 'Aluminum', unit: 'kg' },
  { value: 'BRICK', label: 'Brick', unit: 'kg' },
];

export const emptySiteRequest: SiteRequest = {
  name: '',
  code: '',
  address: '',
  city: '',
  country: 'France',
  totalAreaM2: 1000,
  parkingSpaces: 0,
  annualEnergyConsumptionKwh: 0,
  energySource: 'ELECTRICITY_GRID',
  employeeCount: 0,
  materials: [{ materialType: 'CONCRETE', materialLabel: 'Concrete structure', quantity: 1000, unit: 'kg' }],
};
