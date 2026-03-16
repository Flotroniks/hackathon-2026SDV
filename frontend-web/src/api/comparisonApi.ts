import client from './client';
import type { ComparisonRequest, ComparisonResponse } from '../types/calculation';

export async function compareSites(payload: ComparisonRequest) {
  const { data } = await client.post<ComparisonResponse>('/comparisons/sites', payload);
  return data;
}
