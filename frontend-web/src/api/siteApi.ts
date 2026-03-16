import client from './client';
import type { PageResponse, SiteListItemResponse, SiteRequest, SiteResponse } from '../types/site';

export async function fetchSites(page = 0, size = 20) {
  const { data } = await client.get<PageResponse<SiteListItemResponse>>('/sites', {
    params: { page, size },
  });
  return data;
}

export async function fetchSite(siteId: string) {
  const { data } = await client.get<SiteResponse>(`/sites/${siteId}`);
  return data;
}

export async function createSite(payload: SiteRequest) {
  const { data } = await client.post<SiteResponse>('/sites', payload);
  return data;
}

export async function updateSite(siteId: string, payload: SiteRequest) {
  const { data } = await client.put<SiteResponse>(`/sites/${siteId}`, payload);
  return data;
}

export async function archiveSite(siteId: string) {
  await client.delete(`/sites/${siteId}`);
}
