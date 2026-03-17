import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ComparisonSiteItemResponse } from '../../types/calculation';
import { formatKg } from '../../utils/formatters';

interface ComparisonBarChartProps {
  items: ComparisonSiteItemResponse[];
}

export function ComparisonBarChart({ items }: ComparisonBarChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={items}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="siteCode" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatKg(value)} />
          <Bar dataKey="totalEmissionsKgCo2e" fill="#2f6f59" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
