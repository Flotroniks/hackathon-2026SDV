export interface CalculationMaterialBreakdownResponse {
  id: string;
  materialType: string;
  materialLabel: string;
  quantity: number;
  unit: string;
  emissionFactorKgCo2ePerUnit: number;
  emissionKgCo2e: number;
}

export interface CalculationHistoryItemResponse {
  id: string;
  versionNo: number;
  totalEmissionsKgCo2e: number;
  constructionEmissionsKgCo2e: number;
  operationEmissionsKgCo2e: number;
  calculatedAt: string;
}

export interface CalculationResponse {
  id: string;
  siteId: string;
  versionNo: number;
  constructionEmissionsKgCo2e: number;
  operationEmissionsKgCo2e: number;
  totalEmissionsKgCo2e: number;
  co2PerM2Kg: number;
  co2PerEmployeeKg: number | null;
  factorSource: string;
  calculatedAt: string;
  materialBreakdown: CalculationMaterialBreakdownResponse[];
}

export interface ComparisonRequest {
  siteIds: string[];
}

export interface ComparisonSiteItemResponse {
  siteId: string;
  siteName: string;
  siteCode: string;
  calculationId: string;
  totalEmissionsKgCo2e: number;
  constructionEmissionsKgCo2e: number;
  operationEmissionsKgCo2e: number;
  co2PerM2Kg: number;
  co2PerEmployeeKg: number | null;
  calculatedAt: string;
}

export interface ComparisonResponse {
  items: ComparisonSiteItemResponse[];
  lowestEmissionSiteId: string;
  averageTotalEmissionsKgCo2e: number;
}
