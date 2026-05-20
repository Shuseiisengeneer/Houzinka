/**
 * 計算ロジック検証スクリプト。
 * 実行: npm run verify
 */

import { calcSolo } from '../lib/tax-solo';
import { calcCorp, INTERNAL_RESERVE_RATIO } from '../lib/tax-corp';
import { findBreakeven } from '../lib/breakeven';

const r = (n: number) => Math.round(n * 10) / 10;

interface Case {
  label: string;
  revenue: number;
  expenseRate: number;
  hasSpouse: boolean;
}

const cases: Case[] = [
  { label: '売上800万 / 経費率20% / 独身', revenue: 800, expenseRate: 20, hasSpouse: false },
  { label: '売上1500万 / 経費率30% / 配偶者あり', revenue: 1500, expenseRate: 30, hasSpouse: true },
  { label: '売上3000万 / 経費率20% / 独身', revenue: 3000, expenseRate: 20, hasSpouse: false },
];

console.log(`========== サンプル計算結果(内部留保係数 ${INTERNAL_RESERVE_RATIO}) ==========\n`);

for (const c of cases) {
  const solo = calcSolo(c);
  const corp = calcCorp(c);
  const diff = corp.takehome - solo.takehome;
  console.log(`【${c.label}】`);
  console.log(`  個人事業 手取り: ${r(solo.takehome)} 万円`);
  console.log(`  法人化   手取り: ${r(corp.takehome)} 万円`);
  console.log(
    `    (内訳: 個人手取り ${r(corp.personalTakehome)} + 法人内残留 ${r(corp.corpRetained)}×${INTERNAL_RESERVE_RATIO}=${r(corp.corpRetainedAdjusted)})`,
  );
  console.log(
    `  差額: ${r(Math.abs(diff))} 万円 → ${diff > 0 ? '法人化が有利' : '個人事業が有利'}\n`,
  );
}

console.log('========== ブレークイーブン売上 ==========\n');
console.log(`  独身      : ${findBreakeven(20, false) ?? '5000万超'} 万円 (経費率20%)`);
console.log(`  配偶者あり: ${findBreakeven(20, true) ?? '5000万超'} 万円 (経費率20%)\n`);

console.log('========== 内部留保係数スイープ(独身・経費率20%) ==========\n');
for (const ratio of [0.85, 0.9, 0.95, 1.0]) {
  const be = findBreakeven(20, false, ratio);
  console.log(`  係数 ${ratio.toFixed(2)} → ブレークイーブン ${be ?? '5000万超'} 万円`);
}
