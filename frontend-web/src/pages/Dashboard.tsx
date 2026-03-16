import { useEffect, useMemo, useState } from 'react';
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
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { KpiCards } from '../components/dashboard/KpiCards';
import type {
  CalculationHistoryItemResponse,
  CalculationMaterialBreakdownResponse,
  CalculationResponse,
} from '../types/calculation';
import type { DashboardSummaryResponse, TopSiteResponse } from '../types/dashboard';
import { formatDateTime } from '../utils/formatters';

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

function mapMaterials(materials: CalculationMaterialBreakdownResponse[]): MaterialEmissionBarItem[] {
  const buckets: Record<string, number> = {
    Beton: 0,
    Acier: 0,
    Verre: 0,
    Bois: 0,
    Autres: 0,
  };

  for (const material of materials) {
    if (material.materialType === 'CONCRETE') buckets.Beton += material.emissionKgCo2e;
    else if (material.materialType === 'STEEL') buckets.Acier += material.emissionKgCo2e;
    else if (material.materialType === 'GLASS') buckets.Verre += material.emissionKgCo2e;
    else if (material.materialType === 'WOOD') buckets.Bois += material.emissionKgCo2e;
    else buckets.Autres += material.emissionKgCo2e;
  }

  return Object.entries(buckets).map(([material, emissions]) => ({ material, emissions }));
}

function mapHistory(history: CalculationHistoryItemResponse[]): EmissionHistoryPoint[] {
  return history
    .slice()
    .sort((a, b) => new Date(a.calculatedAt).getTime() - new Date(b.calculatedAt).getTime())
    .map((item) => ({
      date: new Date(item.calculatedAt).toLocaleDateString('fr-FR', { month: 'short', day: '2-digit' }),
      totalEmissions: item.totalEmissionsKgCo2e,
    }));
}

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [topSites, setTopSites] = useState<TopSiteResponse[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [latestCalculation, setLatestCalculation] = useState<CalculationResponse | null>(null);
  const [history, setHistory] = useState<CalculationHistoryItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    Promise.all([fetchDashboardSummary(), fetchTopSites(8)])
      .then(([summaryResponse, topSitesResponse]) => {
        setSummary(summaryResponse);
        setTopSites(topSitesResponse);
        if (topSitesResponse.length > 0) {
          setSelectedSiteId(topSitesResponse[0].siteId);
        } else {
          setLatestCalculation(MOCK_CALCULATION);
          setHistory(MOCK_HISTORY);
          setUsingMockData(true);
          setError('Aucun calcul disponible: affichage de données mock pour la démo.');
        }
      })
      .catch(() => {
        setSummary(MOCK_SUMMARY);
        setLatestCalculation(MOCK_CALCULATION);
        setHistory(MOCK_HISTORY);
        setUsingMockData(true);
        setError('API indisponible: affichage de données mock pour la démo.');
      })
      .finally(() => setIsLoading(false));
  }, []);

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
      });
  }, [selectedSiteId, usingMockData]);

  const materialData = useMemo<MaterialEmissionBarItem[]>(() => {
    if (!latestCalculation) {
      return [];
    }
    return mapMaterials(latestCalculation.materialBreakdown);
  }, [latestCalculation]);

  const historyData = useMemo<EmissionHistoryPoint[]>(() => mapHistory(history), [history]);

  const selectedSite = useMemo(
    () => topSites.find((site) => site.siteId === selectedSiteId) ?? null,
    [topSites, selectedSiteId],
  );

  if (isLoading || !summary || !latestCalculation) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {error ? <AlertBanner type="info" message={error} /> : null}

      <KpiCards
        totalEmissions={latestCalculation.totalEmissionsKgCo2e}
        co2PerM2={latestCalculation.co2PerM2Kg}
        co2PerEmployee={latestCalculation.co2PerEmployeeKg}
        constructionEmissions={latestCalculation.constructionEmissionsKgCo2e}
        exploitationEmissions={latestCalculation.operationEmissionsKgCo2e}
      />

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="card-title">Site de référence</h2>
            <p className="text-sm text-base-content/70">
              {selectedSite ? `${selectedSite.siteName} (${selectedSite.siteCode})` : MOCK_SITE_NAME}
            </p>
          </div>
          {!usingMockData ? (
            <select
              className="select select-bordered w-full md:w-96"
              value={selectedSiteId}
              onChange={(event) => setSelectedSiteId(event.target.value)}
            >
              {topSites.map((site) => (
                <option key={site.siteId} value={site.siteId}>
                  {site.siteName} ({site.siteCode})
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">1. Répartition des émissions</h3>
            <p className="text-sm text-base-content/70">Part construction vs exploitation</p>
            <EmissionDonutChart
              constructionEmissions={latestCalculation.constructionEmissionsKgCo2e}
              exploitationEmissions={latestCalculation.operationEmissionsKgCo2e}
            />
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">2. Émissions par matériau</h3>
            <p className="text-sm text-base-content/70">Postes matériaux les plus émetteurs</p>
            <MaterialBarChart data={materialData} />
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">3. Évolution des émissions</h3>
          <p className="text-sm text-base-content/70">
            Dernière mise à jour: {formatDateTime(latestCalculation.calculatedAt)}
          </p>
          <EmissionHistoryChart data={historyData} />
        </div>
      </div>
    </div>
  );
}
