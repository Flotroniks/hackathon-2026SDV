import { useEffect, useState } from 'react';
import { fetchDashboardSummary, fetchTopSites } from '../api/dashboardApi';
import type { DashboardSummaryResponse, TopSiteResponse } from '../types/dashboard';
import { KpiCard } from '../components/kpi/KpiCard';
import { EmissionBreakdownChart } from '../components/charts/EmissionBreakdownChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatKg, formatNumber, formatDateTime } from '../utils/formatters';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [topSites, setTopSites] = useState<TopSiteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardSummary(), fetchTopSites()])
      .then(([summaryResponse, topSitesResponse]) => {
        setSummary(summaryResponse);
        setTopSites(topSitesResponse);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !summary) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Sites" value={formatNumber(summary.siteCount)} />
        <KpiCard title="Calculations" value={formatNumber(summary.calculationCount)} />
        <KpiCard title="Total CO2" value={formatKg(summary.totalEmissionsKgCo2e)} />
        <KpiCard title="Avg CO2 / m2" value={`${formatNumber(summary.averageCo2PerM2Kg)} kg`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Construction vs Operation</h2>
            <EmissionBreakdownChart
              construction={summary.totalConstructionEmissionsKgCo2e}
              operation={summary.totalOperationEmissionsKgCo2e}
            />
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Top emitting sites</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Total</th>
                    <th>CO2/m2</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {topSites.map((site) => (
                    <tr key={site.siteId}>
                      <td>{site.siteCode}</td>
                      <td>{formatKg(site.totalEmissionsKgCo2e)}</td>
                      <td>{formatNumber(site.co2PerM2Kg)}</td>
                      <td>{formatDateTime(site.calculatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
