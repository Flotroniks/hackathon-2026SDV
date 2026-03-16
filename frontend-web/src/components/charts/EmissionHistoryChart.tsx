import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatKg } from '../../utils/formatters';

export interface EmissionHistoryPoint {
  date: string;
  totalEmissions: number;
}

interface EmissionHistoryChartProps {
  data: EmissionHistoryPoint[];
}

export function EmissionHistoryChart({ data }: EmissionHistoryChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}t`} />
          <Tooltip
            formatter={(value: number) => formatKg(value)}
            contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          />
          <Line
            type="monotone"
            dataKey="totalEmissions"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2563eb' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
