import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatKg } from '../../utils/formatters';

export interface MaterialEmissionBarItem {
  material: string;
  emissions: number;
}

interface MaterialBarChartProps {
  data: MaterialEmissionBarItem[];
}

export function MaterialBarChart({ data }: MaterialBarChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="material" angle={-20} textAnchor="end" height={56} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}t`} />
          <Tooltip
            formatter={(value: number) => formatKg(value)}
            cursor={{ fill: 'rgba(15, 118, 110, 0.08)' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="emissions" fill="#0f766e" radius={[8, 8, 0, 0]} maxBarSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
