import { formatKg, formatNumber } from '../../utils/formatters';

interface KpiCardsProps {
  totalEmissions: number;
  co2PerM2: number;
  co2PerEmployee: number | null;
  constructionEmissions: number;
  exploitationEmissions: number;
}

export function KpiCards({
  totalEmissions,
  co2PerM2,
  co2PerEmployee,
  constructionEmissions,
  exploitationEmissions,
}: KpiCardsProps) {
  const total = constructionEmissions + exploitationEmissions;
  const constructionShare = total > 0 ? (constructionEmissions / total) * 100 : 0;
  const exploitationShare = total > 0 ? (exploitationEmissions / total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body py-5">
          <p className="text-xs uppercase tracking-wide text-base-content/70">CO2 total</p>
          <p className="text-2xl font-semibold text-primary">{formatKg(totalEmissions)}</p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body py-5">
          <p className="text-xs uppercase tracking-wide text-base-content/70">CO2 par m²</p>
          <p className="text-2xl font-semibold">{formatNumber(co2PerM2)} kgCO2e</p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body py-5">
          <p className="text-xs uppercase tracking-wide text-base-content/70">CO2 par employé</p>
          <p className="text-2xl font-semibold">
            {co2PerEmployee === null ? 'N/A' : `${formatNumber(co2PerEmployee)} kgCO2e`}
          </p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body py-5">
          <p className="text-xs uppercase tracking-wide text-base-content/70">Construction vs Exploitation</p>
          <p className="text-2xl font-semibold">{constructionShare.toFixed(1)}% / {exploitationShare.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
