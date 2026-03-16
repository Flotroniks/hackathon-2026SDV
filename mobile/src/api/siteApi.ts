import client from './client';
import type { PageResponse, SiteListItemResponse, SiteRequest } from '../types/site';

export async function fetchSites() {
  const { data } = await client.get<PageResponse<SiteListItemResponse>>('/sites', {
    params: { page: 0, size: 50 },
  });
  return data.content;
}

export async function createSite(payload: SiteRequest) {
  const { data } = await client.post<{ id: string }>('/sites', payload);
  return data;
}
