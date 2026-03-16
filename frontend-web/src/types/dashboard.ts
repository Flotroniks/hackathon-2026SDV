export interface DashboardSummaryResponse {
  siteCount: number;
  calculationCount: number;
  totalEmissionsKgCo2e: number;
  averageCo2PerM2Kg: number;
  totalConstructionEmissionsKgCo2e: number;
  totalOperationEmissionsKgCo2e: number;
}

export interface EmissionTrendPointResponse {
  day: string;
  totalEmissionsKgCo2e: number;
}

export interface TopSiteResponse {
  siteId: string;
  siteName: string;
  siteCode: string;
  totalEmissionsKgCo2e: number;
  co2PerM2Kg: number;
  calculatedAt: string;
}
