import { useEffect, useState } from 'react';
import { compareSites } from '../api/comparisonApi';
import { fetchSites } from '../api/siteApi';
import { ComparisonBarChart } from '../components/charts/ComparisonBarChart';
import { AlertBanner } from '../components/common/AlertBanner';
import { formatKg, formatNumber } from '../utils/formatters';
import type { ComparisonResponse } from '../types/calculation';
import type { SiteListItemResponse } from '../types/site';

export function ComparisonPage() {
  const [sites, setSites] = useState<SiteListItemResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<ComparisonResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSites().then((response) => setSites(response.content));
  }, []);

  async function runComparison() {
    setError('');
    try {
      const response = await compareSites({ siteIds: selectedIds });
      setResult(response);
    } catch {
      setError('Comparison failed. Select 2 to 5 sites with existing calculations.');
    }
  }

  function toggleSite(siteId: string) {
    if (selectedIds.includes(siteId)) {
      setSelectedIds(selectedIds.filter((id) => id !== siteId));
      return;
    }
    if (selectedIds.length >= 5) {
      return;
    }
    setSelectedIds([...selectedIds, siteId]);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Multi-site comparison</h1>
      <div className="card bg-base-200">
        <div className="card-body">
          <p className="text-sm text-base-content/70">Choose 2 to 5 sites and compare their latest saved calculations.</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {sites.map((site) => (
              <label key={site.id} className="label cursor-pointer rounded-lg bg-base-100 px-3 py-2">
                <span className="label-text">{site.code} - {site.name}</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedIds.includes(site.id)}
                  onChange={() => toggleSite(site.id)}
                />
              </label>
            ))}
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              disabled={selectedIds.length < 2}
              onClick={runComparison}
            >
              Compare
            </button>
          </div>
        </div>
      </div>
      {error ? <AlertBanner type="error" message={error} /> : null}
      {result ? (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="stat rounded-xl bg-base-200">
              <div className="stat-title">Average total emissions</div>
              <div className="stat-value text-lg">{formatKg(result.averageTotalEmissionsKgCo2e)}</div>
            </div>
            <div className="stat rounded-xl bg-base-200">
              <div className="stat-title">Lowest emitting site</div>
              <div className="stat-value text-lg">
                {result.items.find((item) => item.siteId === result.lowestEmissionSiteId)?.siteCode ?? 'N/A'}
              </div>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Total emissions by site</h2>
              <ComparisonBarChart items={result.items} />
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl bg-base-200">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Total</th>
                  <th>Construction</th>
                  <th>Operation</th>
                  <th>CO2/m2</th>
                  <th>CO2/employee</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr key={item.siteId}>
                    <td>{item.siteCode}</td>
                    <td>{formatKg(item.totalEmissionsKgCo2e)}</td>
                    <td>{formatKg(item.constructionEmissionsKgCo2e)}</td>
                    <td>{formatKg(item.operationEmissionsKgCo2e)}</td>
                    <td>{formatNumber(item.co2PerM2Kg)}</td>
                    <td>{formatNumber(item.co2PerEmployeeKg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
