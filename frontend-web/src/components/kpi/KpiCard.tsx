interface KpiCardProps {
  title: string;
  value: string;
  hint?: string;
}

export function KpiCard({ title, value, hint }: KpiCardProps) {
  return (
    <div className="card bg-base-200">
      <div className="card-body py-4">
        <p className="text-xs uppercase tracking-wider text-base-content/60">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {hint ? <p className="text-xs text-base-content/60">{hint}</p> : null}
      </div>
    </div>
  );
}
