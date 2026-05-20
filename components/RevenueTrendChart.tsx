'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '@/lib/breakeven';

interface Props {
  data: TrendPoint[];
  breakeven: number | null;
}

export default function RevenueTrendChart({ data, breakeven }: Props) {
  const chartData = data.map((p) => ({
    revenue: p.revenue,
    advantage: Math.round(p.advantage),
  }));
  const showMarker = breakeven !== null && breakeven <= 3000;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 6 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="revenue"
          tick={{ fontSize: 10 }}
          tickFormatter={(v: number) => `${v / 100 === Math.round(v / 100) ? v : v}`}
          interval={4}
          axisLine={false}
          tickLine={false}
          label={{ value: '年商(万円)', position: 'insideBottomRight', offset: -4, fontSize: 10, fill: '#9CA3AF' }}
        />
        <YAxis
          tick={{ fontSize: 10 }}
          width={52}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}`}
        />
        <Tooltip
          formatter={(v: number) => [`${v.toLocaleString()}万円`, '法人化メリット']}
          labelFormatter={(l) => `年商 ${Number(l).toLocaleString()}万円`}
        />
        <ReferenceLine y={0} stroke="#9CA3AF" strokeWidth={1} />
        {showMarker && (
          <ReferenceLine
            x={breakeven as number}
            stroke="#0F766E"
            strokeDasharray="5 4"
            strokeWidth={2}
            label={{
              value: `分岐点 ${breakeven}万`,
              position: 'top',
              fontSize: 11,
              fontWeight: 700,
              fill: '#0F766E',
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="advantage"
          stroke="#0F766E"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
