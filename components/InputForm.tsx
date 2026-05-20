'use client';

import { useEffect, useState } from 'react';

interface Props {
  revenue: number;
  expenseRate: number;
  hasSpouse: boolean;
  onRevenue: (v: number) => void;
  onExpenseRate: (v: number) => void;
  onSpouse: (v: boolean) => void;
}

const REVENUE_MIN = 100;
const REVENUE_MAX = 5000;

export default function InputForm({
  revenue,
  expenseRate,
  hasSpouse,
  onRevenue,
  onExpenseRate,
  onSpouse,
}: Props) {
  // 数値入力欄は途中入力を許すため文字列でミラーする
  const [revText, setRevText] = useState(String(revenue));
  useEffect(() => {
    setRevText(String(revenue));
  }, [revenue]);

  const commitRevenue = () => {
    const n = parseInt(revText, 10);
    const clamped = Number.isFinite(n)
      ? Math.min(REVENUE_MAX, Math.max(REVENUE_MIN, n))
      : revenue;
    onRevenue(clamped);
    setRevText(String(clamped));
  };

  return (
    <div className="space-y-7">
      {/* 年商売上 */}
      <div>
        <div className="mb-2 flex items-end justify-between gap-3">
          <label htmlFor="revenue" className="text-sm font-bold text-gray-800">
            年商売上
          </label>
          <div className="flex items-center gap-1">
            <input
              id="revenue"
              type="number"
              inputMode="numeric"
              value={revText}
              min={REVENUE_MIN}
              max={REVENUE_MAX}
              step={100}
              onChange={(e) => {
                setRevText(e.target.value);
                const n = parseInt(e.target.value, 10);
                if (Number.isFinite(n)) onRevenue(n);
              }}
              onBlur={commitRevenue}
              className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-right text-base font-bold text-brand focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <span className="text-sm text-gray-500">万円</span>
          </div>
        </div>
        <input
          type="range"
          min={REVENUE_MIN}
          max={REVENUE_MAX}
          step={100}
          value={Math.min(REVENUE_MAX, Math.max(REVENUE_MIN, revenue))}
          onChange={(e) => onRevenue(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand"
          aria-label="年商売上スライダー"
        />
        <div className="mt-1 flex justify-between text-[11px] text-gray-400">
          <span>100万</span>
          <span>5,000万</span>
        </div>
      </div>

      {/* 経費率 */}
      <div>
        <div className="mb-2 flex items-end justify-between gap-3">
          <label htmlFor="expense" className="text-sm font-bold text-gray-800">
            経費率
          </label>
          <span className="text-base font-bold text-brand">{expenseRate}%</span>
        </div>
        <input
          id="expense"
          type="range"
          min={0}
          max={80}
          step={1}
          value={expenseRate}
          onChange={(e) => onExpenseRate(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand"
        />
        <div className="mt-1 flex justify-between text-[11px] text-gray-400">
          <span>0%</span>
          <span>80%</span>
        </div>
      </div>

      {/* 家族構成 */}
      <div>
        <span className="mb-2 block text-sm font-bold text-gray-800">家族構成</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '独身', value: false },
            { label: '配偶者あり', value: true },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onSpouse(opt.value)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors ${
                hasSpouse === opt.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-brand'
              }`}
              aria-pressed={hasSpouse === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
