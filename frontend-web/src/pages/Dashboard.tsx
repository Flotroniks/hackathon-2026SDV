import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCalculationHistory, fetchLatestCalculation } from '../api/calculationApi';
import { fetchDashboardSummary, fetchTopSites } from '../api/dashboardApi';
import { EmissionDonutChart } from '../components/charts/EmissionDonutChart';
import {
  EmissionHistoryChart,
  type EmissionHistoryPoint,
} from '../components/charts/EmissionHistoryChart';
import {
  MaterialBarChart,
  type MaterialEmissionBarItem,
} from '../components/charts/MaterialBarChart';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import KpiCard from '../components/ui/KpiCard';
import LoadingState from '../components/ui/LoadingState';
import MetricHighlight from '../components/ui/MetricHighlight';
import ModernTable, { type ModernTableColumn } from '../components/ui/ModernTable';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import SiteSummaryCard from '../components/ui/SiteSummaryCard';
import type {
  CalculationHistoryItemResponse,
  CalculationMaterialBreakdownResponse,
  CalculationResponse,
} from '../types/calculation';
import type { DashboardSummaryResponse, TopSiteResponse } from '../types/dashboard';
import { formatDateTime, formatKg, formatKgCo2e, formatNumber } from '../utils/formatters';

const MOCK_SITE_NAME = 'Site Demo Hackathon';

const MOCK_CALCULATION: CalculationResponse = {
  id: 'mock-calculation',
  siteId: 'mock-site',
  versionNo: 3,
  constructionEmissionsKgCo2e: 148000,
  operationEmissionsKgCo2e: 96000,
  totalEmissionsKgCo2e: 244000,
  co2PerM2Kg: 44.36,
  co2PerEmployeeKg: 1525,
  factorSource: 'Mock',
  calculatedAt: new Date().toISOString(),
  materialBreakdown: [
    { id: '1', materialType: 'CONCRETE', materialLabel: 'Concrete', quantity: 1, unit: 'kg', emissionFactorKgCo2ePerUnit: 0.12, emissionKgCo2e: 92000 },
    { id: '2', materialType: 'STEEL', materialLabel: 'Steel', quantity: 1, unit: 'kg', emissionFactorKgCo2ePerUnit: 1.9, emissionKgCo2e: 36000 },
    { id: '3', materialType: 'GLASS', materialLabel: 'Glass', quantity: 1, unit: 'kg', emissionFactorKgCo2ePerUnit: 1.0, emissionKgCo2e: 11000 },
    { id: '4', materialType: 'WOOD', materialLabel: 'Wood', quantity: 1, unit: 'kg', emissionFactorKgCo2ePerUnit: 0.2, emissionKgCo2e: 6000 },
    { id: '5', materialType: 'ALUMINUM', materialLabel: 'Aluminum', quantity: 1, unit: 'kg', emissionFactorKgCo2ePerUnit: 8.2, emissionKgCo2e: 3000 },
  ],
};

const MOCK_HISTORY: CalculationHistoryItemResponse[] = [
  { id: 'h1', versionNo: 1, totalEmissionsKgCo2e: 270000, constructionEmissionsKgCo2e: 165000, operationEmissionsKgCo2e: 105000, calculatedAt: '2025-09-01T10:00:00.000Z' },
  { id: 'h2', versionNo: 2, totalEmissionsKgCo2e: 254000, constructionEmissionsKgCo2e: 154000, operationEmissionsKgCo2e: 100000, calculatedAt: '2025-12-01T10:00:00.000Z' },
  { id: 'h3', versionNo: 3, totalEmissionsKgCo2e: 244000, constructionEmissionsKgCo2e: 148000, operationEmissionsKgCo2e: 96000, calculatedAt: '2026-03-01T10:00:00.000Z' },
];

const MOCK_SUMMARY: DashboardSummaryResponse = {
  siteCount: 3,
  calculationCount: 9,
  totalEmissionsKgCo2e: 785000,
  averageCo2PerM2Kg: 41.7,
  totalConstructionEmissionsKgCo2e: 475000,
  totalOperationEmissionsKgCo2e: 310000,
};

function mapMaterials(
  materials: CalculationMaterialBreakdownResponse[],
  t: (key: string) => string,
): MaterialEmissionBarItem[] {
  const buckets: Record<string, number> = {
    [t('dashboard.materials.concrete')]: 0,
    [t('dashboard.materials.steel')]: 0,
    [t('dashboard.materials.glass')]: 0,
    [t('dashboard.materials.wood')]: 0,
    [t('dashboard.materials.other')]: 0,
  };

  for (const material of materials) {
    if (material.materialType === 'CONCRETE') buckets[t('dashboard.materials.concrete')] += material.emissionKgCo2e;
    else if (material.materialType === 'STEEL') buckets[t('dashboard.materials.steel')] += material.emissionKgCo2e;
    else if (material.materialType === 'GLASS') buckets[t('dashboard.materials.glass')] += material.emissionKgCo2e;
    else if (material.materialType === 'WOOD') buckets[t('dashboard.materials.wood')] += material.emissionKgCo2e;
    else buckets[t('dashboard.materials.other')] += material.emissionKgCo2e;
  }

  return Object.entries(buckets).map(([material, emissions]) => ({ material, emissions }));
}

function mapHistory(history: CalculationHistoryItemResponse[], locale: string): EmissionHistoryPoint[] {
  return history
    .slice()
    .sort((a, b) => new Date(a.calculatedAt).getTime() - new Date(b.calculatedAt).getTime())
    .map((item) => ({
      date: new Date(item.calculatedAt).toLocaleDateString(locale, { month: 'short', day: '2-digit' }),
      totalEmissions: item.totalEmissionsKgCo2e,
    }));
}

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [topSites, setTopSites] = useState<TopSiteResponse[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [latestCalculation, setLatestCalculation] = useState<CalculationResponse | null>(null);
  const [history, setHistory] = useState<CalculationHistoryItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  async function loadDashboardBase() {
    try {
      const [summaryResponse, topSitesResponse] = await Promise.all([fetchDashboardSummary(), fetchTopSites(8)]);
      setSummary(summaryResponse);
      setTopSites(topSitesResponse);
      setError('');
      setUsingMockData(false);

      if (topSitesResponse.length > 0) {
        setSelectedSiteId((current) => current || topSitesResponse[0].siteId);
      } else {
        setLatestCalculation(MOCK_CALCULATION);
        setHistory(MOCK_HISTORY);
        setUsingMockData(true);
        setError(t('dashboard.messages.noDataUsingMock'));
      }
    } catch {
      setSummary(MOCK_SUMMARY);
      setLatestCalculation(MOCK_CALCULATION);
      setHistory(MOCK_HISTORY);
      setUsingMockData(true);
      setError(t('dashboard.messages.apiUnavailableUsingMock'));
    }
  }

  useEffect(() => {
    setIsLoading(true);
    loadDashboardBase().finally(() => setIsLoading(false));
  }, [t]);

  useEffect(() => {
    if (!selectedSiteId || usingMockData) {
      return;
    }

    Promise.all([fetchLatestCalculation(selectedSiteId), fetchCalculationHistory(selectedSiteId)])
      .then(([latestResponse, historyResponse]) => {
        setLatestCalculation(latestResponse);
        setHistory(historyResponse);
      })
      .catch(() => {
        setLatestCalculation(MOCK_CALCULATION);
        setHistory(MOCK_HISTORY);
        setUsingMockData(true);
        setError(t('dashboard.messages.apiUnavailableUsingMock'));
      });
  }, [selectedSiteId, t, usingMockData]);

  const materialData = useMemo<MaterialEmissionBarItem[]>(() => {
    if (!latestCalculation) {
      return [];
    }
    return mapMaterials(latestCalculation.materialBreakdown, t);
  }, [latestCalculation, t]);

  const historyData = useMemo<EmissionHistoryPoint[]>(
    () => mapHistory(history, i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US'),
    [history, i18n.language],
  );

  const selectedSite = useMemo(
    () => topSites.find((site) => site.siteId === selectedSiteId) ?? null,
    [topSites, selectedSiteId],
  );

  const siteRows = useMemo(() => topSites.slice(0, 6), [topSites]);

  const siteColumns = useMemo<ModernTableColumn<TopSiteResponse>[]>(() => [
    {
      key: 'siteName',
      label: t('dashboard.table.site'),
      render: (site) => (
        <Stack spacing={0.2}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{site.siteName}</Typography>
          <Typography variant="caption" color="text.secondary">{site.siteCode}</Typography>
        </Stack>
      ),
    },
    {
      key: 'totalEmissionsKgCo2e',
      label: t('dashboard.table.total'),
      align: 'right',
      render: (site) => formatKg(site.totalEmissionsKgCo2e),
    },
    {
      key: 'co2PerM2Kg',
      label: t('dashboard.table.co2PerM2'),
      align: 'right',
      render: (site) => formatKgCo2e(site.co2PerM2Kg),
    },
    {
      key: 'calculatedAt',
      label: t('dashboard.table.updatedAt'),
      align: 'right',
      render: (site) => formatDateTime(site.calculatedAt),
    },
  ], [t]);

  if (isLoading || !summary || !latestCalculation) {
    return <LoadingState message={t('common.loading')} />;
  }

  return (
    <Box>
      <PageHeader
        overline={t('dashboard.overline')}
        title={t('dashboard.pageTitle')}
        subtitle={t('dashboard.pageSubtitle')}
        actions={(
          <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={() => void loadDashboardBase()}>
            {t('dashboard.actions.refresh')}
          </Button>
        )}
      />

      {error ? <Alert severity={usingMockData ? 'info' : 'error'} sx={{ mb: 3 }}>{error}</Alert> : null}

      <Grid container spacing={2} sx={{ mb: 2.25 }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            title={t('kpi.totalCo2')}
            value={formatKg(latestCalculation.totalEmissionsKgCo2e)}
            icon={<EqualizerRoundedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            title={t('kpi.co2PerM2')}
            value={formatKgCo2e(latestCalculation.co2PerM2Kg)}
            icon={<ApartmentRoundedIcon fontSize="small" />}
            accentColor="#3E7BFA"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            title={t('kpi.co2PerEmployee')}
            value={formatKgCo2e(latestCalculation.co2PerEmployeeKg)}
            icon={<GroupsRoundedIcon fontSize="small" />}
            accentColor="#D38B2C"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            title={t('dashboard.kpi.calculations')}
            value={formatNumber(summary.calculationCount)}
            caption={t('dashboard.kpi.activeSites', { count: summary.siteCount })}
            icon={<TuneRoundedIcon fontSize="small" />}
            accentColor="#4B5E77"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.2}>
        <Grid size={12}>
          <SiteSummaryCard
            name={selectedSite?.siteName ?? t('dashboard.mockSiteName', { defaultValue: MOCK_SITE_NAME })}
            code={selectedSite?.siteCode ?? 'DEMO'}
            location={t('dashboard.referenceSiteHint')}
            updatedAt={`${t('dashboard.sections.history.lastUpdate')}: ${formatDateTime(latestCalculation.calculatedAt)}`}
            action={!usingMockData ? (
              <TextField
                select
                label={t('dashboard.selectSite')}
                value={selectedSiteId}
                onChange={(event) => setSelectedSiteId(event.target.value)}
                sx={{ minWidth: { xs: 220, md: 290 } }}
              >
                {topSites.map((site) => (
                  <MenuItem key={site.siteId} value={site.siteId}>
                    {site.siteName} ({site.siteCode})
                  </MenuItem>
                ))}
              </TextField>
            ) : undefined}
          >
            <MetricHighlight
              title={t('dashboard.metric.total')}
              value={formatKg(summary.totalEmissionsKgCo2e)}
              helper={`${t('dashboard.metric.avgCo2PerM2')}: ${formatKgCo2e(summary.averageCo2PerM2Kg)}`}
              chipLabel={t('dashboard.metric.version', { version: latestCalculation.versionNo })}
              icon={<EqualizerRoundedIcon fontSize="small" />}
            />
          </SiteSummaryCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title={t('dashboard.sections.breakdown.title')}
            subtitle={t('dashboard.sections.breakdown.subtitle')}
          >
            <EmissionDonutChart
              constructionEmissions={latestCalculation.constructionEmissionsKgCo2e}
              exploitationEmissions={latestCalculation.operationEmissionsKgCo2e}
            />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title={t('dashboard.sections.materials.title')}
            subtitle={t('dashboard.sections.materials.subtitle')}
          >
            {materialData.length === 0 ? (
              <EmptyState
                title={t('dashboard.empty.materialsTitle')}
                description={t('dashboard.empty.materialsDescription')}
              />
            ) : (
              <MaterialBarChart data={materialData} />
            )}
          </SectionCard>
        </Grid>

        <Grid size={12}>
          <SectionCard
            title={t('dashboard.sections.history.title')}
            subtitle={t('dashboard.sections.history.subtitle')}
          >
            {historyData.length === 0 ? (
              <EmptyState
                title={t('dashboard.empty.historyTitle')}
                description={t('dashboard.empty.historyDescription')}
              />
            ) : (
              <EmissionHistoryChart data={historyData} />
            )}
          </SectionCard>
        </Grid>

        <Grid size={12}>
          <SectionCard
            title={t('dashboard.sections.sites.title')}
            subtitle={t('dashboard.sections.sites.subtitle')}
          >
            {siteRows.length === 0 ? (
              <ErrorState
                message={t('dashboard.empty.noSites')}
                retryLabel={t('dashboard.actions.refresh')}
                onRetry={() => void loadDashboardBase()}
              />
            ) : (
              <ModernTable
                columns={siteColumns}
                rows={siteRows}
                getRowId={(row) => row.siteId}
                emptyMessage={t('dashboard.empty.noSites')}
              />
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
