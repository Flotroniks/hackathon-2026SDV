import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatKg } from '../../utils/formatters';

interface EmissionBreakdownChartProps {
  construction: number;
  operation: number;
}

const COLORS = ['#2f6f59', '#d9a84f'];

export function EmissionBreakdownChart({ construction, operation }: EmissionBreakdownChartProps) {
  const { t } = useTranslation();
  const data = [
    { name: t('charts.construction'), value: construction },
    { name: t('charts.operation'), value: operation },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatKg(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
