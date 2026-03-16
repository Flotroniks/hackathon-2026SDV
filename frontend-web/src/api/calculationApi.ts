import client from './client';
import type { CalculationHistoryItemResponse, CalculationResponse } from '../types/calculation';

export async function calculateSite(siteId: string) {
  const { data } = await client.post<CalculationResponse>(`/sites/${siteId}/calculations`);
  return data;
}

export async function fetchCalculationHistory(siteId: string) {
  const { data } = await client.get<CalculationHistoryItemResponse[]>(`/sites/${siteId}/calculations`);
  return data;
}

export async function fetchLatestCalculation(siteId: string) {
  const { data } = await client.get<CalculationResponse>(`/sites/${siteId}/calculations/latest`);
  return data;
}
