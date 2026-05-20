'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  solo: number;
  corp: number;
}

const SOLO_COLOR = '#EA580C';
const CORP_COLOR = '#0F766E';

export default function ComparisonChart({ solo, corp }: Props) {
  const data = [
    { name: '個人事業', value: Math.round(solo), fill: SOLO_COLOR },
    { name: '法人化', value: Math.round(corp), fill: CORP_COLOR },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 28, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 700 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} width={52} axisLine={false} tickLine={false} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={96}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v: number) => `${v.toLocaleString()}万円`}
            style={{ fontSize: 13, fontWeight: 700, fill: '#374151' }}
          />
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
