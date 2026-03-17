import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchDashboardSummary, fetchTopSites } from '../api/dashboardApi';
import type { DashboardSummaryResponse, TopSiteResponse } from '../types/dashboard';
import { KpiCard } from '../components/kpi/KpiCard';
import { EmissionBreakdownChart } from '../components/charts/EmissionBreakdownChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatKg, formatNumber, formatDateTime } from '../utils/formatters';

export function DashboardPage() {
  const { t } = useTranslation();
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
        <KpiCard title={t('dashboardPage.kpi.sites')} value={formatNumber(summary.siteCount)} />
        <KpiCard title={t('dashboardPage.kpi.calculations')} value={formatNumber(summary.calculationCount)} />
        <KpiCard title={t('dashboardPage.kpi.totalCo2')} value={formatKg(summary.totalEmissionsKgCo2e)} />
        <KpiCard title={t('dashboardPage.kpi.avgCo2m2')} value={`${formatNumber(summary.averageCo2PerM2Kg)} ${t('common.units.kg')}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">{t('dashboardPage.breakdownTitle')}</h2>
            <EmissionBreakdownChart
              construction={summary.totalConstructionEmissionsKgCo2e}
              operation={summary.totalOperationEmissionsKgCo2e}
            />
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">{t('dashboardPage.topSitesTitle')}</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>{t('dashboardPage.table.site')}</th>
                    <th>{t('dashboardPage.table.total')}</th>
                    <th>{t('dashboardPage.table.co2m2')}</th>
                    <th>{t('dashboardPage.table.updated')}</th>
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
