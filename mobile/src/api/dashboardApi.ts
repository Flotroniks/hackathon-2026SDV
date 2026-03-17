import client from './client';
import type {
  DashboardSummaryResponse,
  EmissionTrendPointResponse,
  TopSiteResponse,
} from '../types/dashboard';

export async function fetchDashboardSummary() {
  const { data } = await client.get<DashboardSummaryResponse>('/dashboard/summary');
  return data;
}

export async function fetchEmissionTrend(siteId?: string) {
  const { data } = await client.get<EmissionTrendPointResponse[]>('/dashboard/trend', {
    params: siteId ? { siteId } : undefined,
  });
  return data;
}

export async function fetchTopSites(limit = 5) {
  const { data } = await client.get<TopSiteResponse[]>('/dashboard/top-sites', {
    params: { limit },
  });
  return data;
}
