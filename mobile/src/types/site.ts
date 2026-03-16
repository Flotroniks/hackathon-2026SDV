export interface MaterialInput {
  materialType: 'CONCRETE' | 'STEEL' | 'GLASS' | 'WOOD' | 'ALUMINUM' | 'BRICK';
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
  energySource: 'ELECTRICITY_GRID' | 'NATURAL_GAS' | 'DISTRICT_HEATING' | 'FUEL_OIL';
  employeeCount: number;
  materials: MaterialInput[];
}

export interface SiteListItemResponse {
  id: string;
  name: string;
  code: string;
  city: string;
  totalAreaM2: number;
  employeeCount: number;
  latestTotalEmissionsKgCo2e: number | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
