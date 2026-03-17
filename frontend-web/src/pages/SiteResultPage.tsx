import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { calculateSite, fetchCalculationHistory, fetchLatestCalculation } from '../api/calculationApi';
import client from '../api/client';
import { fetchSite } from '../api/siteApi';
import type { CalculationHistoryItemResponse, CalculationResponse } from '../types/calculation';
import type { SiteResponse } from '../types/site';
import { formatDateTime, formatKg, formatNumber } from '../utils/formatters';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import ExploitationForm from '../components/forms/ExploitationForm';

type EnergyType = 'electricity' | 'gas' | 'mix';

interface ExploitationFormValues {
  annualEnergyConsumptionKwh: number | '';
  energyType: EnergyType;
  employeeCount: number | '';
  occupancyRate: number | '';
  parkingSpaces: number | '';
  commutingDistanceKmPerDayPerEmployee: number | '';
  itEquipmentCount: number | '';
  estimatedItConsumptionKwh: number | '';
  comment: string;
}

interface ExploitationPayload {
  siteId: number | string;
  annualEnergyConsumptionKwh: number;
  energyType: EnergyType;
  employeeCount: number;
  occupancyRate: number;
  parkingSpaces: number;
  commutingDistanceKmPerDayPerEmployee: number;
  itEquipmentCount: number;
  estimatedItConsumptionKwh: number | null;
  comment: string;
}

function toExploitationEnergyType(energySource: SiteResponse['energySource']): EnergyType {
  if (energySource === 'NATURAL_GAS') {
    return 'gas';
  }
  if (energySource === 'ELECTRICITY_GRID') {
    return 'electricity';
  }
  return 'mix';
}

async function saveSiteExploitationData(payload: ExploitationPayload) {
  const { data } = await client.post(`/sites/${payload.siteId}/operations`, payload);
  return data;
}

export function SiteResultPage() {
  const { t } = useTranslation();
  const { siteId } = useParams<{ siteId: string }>();
  const [site, setSite] = useState<SiteResponse | null>(null);
  const [latest, setLatest] = useState<CalculationResponse | null>(null);
  const [history, setHistory] = useState<CalculationHistoryItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [operationsSuccess, setOperationsSuccess] = useState('');
  const [operationsError, setOperationsError] = useState('');

  async function loadData() {
    if (!siteId) {
      return;
    }
    setIsLoading(true);
    try {
      const [siteResponse, historyResponse] = await Promise.all([
        fetchSite(siteId),
        fetchCalculationHistory(siteId),
      ]);
      setSite(siteResponse);
      setHistory(historyResponse);
      if (historyResponse.length > 0) {
        const latestResponse = await fetchLatestCalculation(siteId);
        setLatest(latestResponse);
      } else {
        setLatest(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [siteId]);

  async function runCalculation() {
    if (!siteId) {
      return;
    }
    setError('');
    try {
      await calculateSite(siteId);
      await loadData();
    } catch {
      setError(t('siteResult.errors.calculationFailed'));
    }
  }

  async function handleExploitationSubmit(payload: ExploitationPayload) {
    setOperationsError('');
    setOperationsSuccess('');
    try {
      await saveSiteExploitationData(payload);
      setOperationsSuccess(t('siteResult.operations.success'));
    } catch {
      setOperationsError(t('siteResult.operations.error'));
      throw new Error('operations_save_failed');
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!site) {
    return <AlertBanner type="error" message={t('siteResult.errors.siteNotFound')} />;
  }

  const exploitationInitialValues: Partial<ExploitationFormValues> = {
    annualEnergyConsumptionKwh: site.annualEnergyConsumptionKwh,
    energyType: toExploitationEnergyType(site.energySource),
    employeeCount: site.employeeCount,
    parkingSpaces: site.parkingSpaces,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{site.name}</h1>
          <p className="text-sm text-base-content/70">{site.code} - {site.city}</p>
        </div>
        <div className="space-x-2">
          <Link className="btn btn-outline" to={`/sites/${site.id}/edit`}>
            {t('common.actions.edit')}
          </Link>
          <button className="btn btn-primary" onClick={runCalculation}>
            {t('siteResult.actions.runCalculation')}
          </button>
        </div>
      </div>
      {error ? <AlertBanner type="error" message={error} /> : null}
      {latest ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="stat rounded-xl bg-base-200">
            <div className="stat-title">{t('siteResult.kpi.total')}</div>
            <div className="stat-value text-primary">{formatKg(latest.totalEmissionsKgCo2e)}</div>
          </div>
          <div className="stat rounded-xl bg-base-200">
            <div className="stat-title">{t('siteResult.kpi.construction')}</div>
            <div className="stat-value text-secondary">{formatKg(latest.constructionEmissionsKgCo2e)}</div>
          </div>
          <div className="stat rounded-xl bg-base-200">
            <div className="stat-title">{t('siteResult.kpi.operation')}</div>
            <div className="stat-value text-accent">{formatKg(latest.operationEmissionsKgCo2e)}</div>
          </div>
          <div className="stat rounded-xl bg-base-200">
            <div className="stat-title">{t('siteResult.kpi.co2m2')}</div>
            <div className="stat-value text-lg">{formatNumber(latest.co2PerM2Kg)} {t('common.units.kg')}</div>
          </div>
        </div>
      ) : (
        <AlertBanner type="info" message={t('siteResult.noCalculation')} />
      )}

      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">{t('siteResult.history.title')}</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>{t('siteResult.history.version')}</th>
                  <th>{t('siteResult.history.total')}</th>
                  <th>{t('siteResult.history.construction')}</th>
                  <th>{t('siteResult.history.operation')}</th>
                  <th>{t('siteResult.history.date')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>v{item.versionNo}</td>
                    <td>{formatKg(item.totalEmissionsKgCo2e)}</td>
                    <td>{formatKg(item.constructionEmissionsKgCo2e)}</td>
                    <td>{formatKg(item.operationEmissionsKgCo2e)}</td>
                    <td>{formatDateTime(item.calculatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{t('siteResult.operations.title')}</h2>
        {operationsSuccess ? <AlertBanner type="success" message={operationsSuccess} /> : null}
        {operationsError ? <AlertBanner type="error" message={operationsError} /> : null}
        <ExploitationForm
          site={{ id: site.id, name: site.name, code: site.code, city: site.city, country: site.country }}
          initialValues={exploitationInitialValues}
          onSubmit={handleExploitationSubmit}
        />
      </div>
    </div>
  );
}
