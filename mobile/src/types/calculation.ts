export interface CalculationResponse {
  id: string;
  siteId: string;
  versionNo: number;
  constructionEmissionsKgCo2e: number;
  operationEmissionsKgCo2e: number;
  totalEmissionsKgCo2e: number;
  co2PerM2Kg: number;
  co2PerEmployeeKg: number | null;
  calculatedAt: string;
}
