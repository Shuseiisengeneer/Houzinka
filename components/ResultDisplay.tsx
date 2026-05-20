'use client';

interface Props {
  corpFavored: boolean;
  /** 有利な側との差額(万円・絶対値) */
  advantage: number;
  breakeven: number | null;
  revenue: number;
}

export default function ResultDisplay({ corpFavored, advantage, breakeven, revenue }: Props) {
  const amount = Math.round(advantage).toLocaleString();
  const accent = corpFavored ? 'text-brand' : 'text-accent';
  const bg = corpFavored ? 'bg-brand/5 border-brand/30' : 'bg-accent/5 border-accent/30';

  return (
    <div className="space-y-4">
      {/* 判定の数字 */}
      <div className={`rounded-2xl border ${bg} p-6 text-center`}>
        <p className="text-sm font-bold text-gray-500">
          年商{revenue.toLocaleString()}万円のあなたは
        </p>
        <p className={`mt-1 text-lg font-bold ${accent}`}>
          {corpFavored ? '法人化が有利' : '個人事業のほうがおトク'}
        </p>
        <p className={`mt-2 ${accent}`}>
          <span className="text-base font-bold">
            {corpFavored ? '法人化メリット 年' : '個人事業のほうが年'}
          </span>
          <span className="mx-1 text-5xl font-black tracking-tight">{amount}</span>
          <span className="text-base font-bold">{corpFavored ? '万円' : '万円おトク'}</span>
        </p>
      </div>

      {/* ブレークイーブン */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
        <p className="text-sm font-bold text-gray-500">あなたの法人化分岐点</p>
        <p className="mt-1">
          <span className="text-sm font-bold text-gray-700">年商</span>
          <span className="mx-1 text-4xl font-black text-brand">
            {breakeven !== null ? breakeven.toLocaleString() : '5,000超'}
          </span>
          <span className="text-sm font-bold text-gray-700">万円</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {breakeven !== null
            ? 'この売上を超えると法人化で手取りが増えはじめます'
            : '今の経費率では年商5,000万円までは個人事業が有利です'}
        </p>
      </div>
    </div>
  );
}
