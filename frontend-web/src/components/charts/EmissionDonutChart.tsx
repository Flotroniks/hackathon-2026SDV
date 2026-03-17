import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatKg } from '../../utils/formatters';

interface EmissionDonutChartProps {
  constructionEmissions: number;
  exploitationEmissions: number;
}

const COLORS = ['#0f766e', '#fb923c'];

export function EmissionDonutChart({
  constructionEmissions,
  exploitationEmissions,
}: EmissionDonutChartProps) {
  const { t } = useTranslation();

  const data = [
    { name: t('charts.construction'), value: constructionEmissions },
    { name: t('charts.exploitation'), value: exploitationEmissions },
  ];

  const total = constructionEmissions + exploitationEmissions;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatKg(value)}
            contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-base-content">
            <tspan x="50%" dy="-0.4em" className="text-xs opacity-70">
              {t('charts.total')}
            </tspan>
            <tspan x="50%" dy="1.4em" className="text-base font-semibold">
              {formatKg(total)}
            </tspan>
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
