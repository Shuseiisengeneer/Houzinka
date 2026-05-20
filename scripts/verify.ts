/**
 * 計算ロジック検証スクリプト。
 * 実行: npm run verify
 */

import { calcSolo } from '../lib/tax-solo';
import { calcCorp, INTERNAL_RESERVE_RATIO } from '../lib/tax-corp';
import { findBreakeven } from '../lib/breakeven';

const r = (n: number) => Math.round(n * 10) / 10;
const be = (n: number | null) => (n === null ? '分岐点なし' : `${n}万円`);

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
  const bev = findBreakeven(c.expenseRate, c.hasSpouse);
  console.log(`【${c.label}】`);
  console.log(`  個人事業 手取り: ${r(solo.takehome)} 万円`);
  console.log(`  法人化   手取り: ${r(corp.takehome)} 万円`);
  console.log(
    `  差額: ${r(Math.abs(diff))} 万円 → ${diff > 0 ? '法人化が有利' : '個人事業が有利'}`,
  );
  console.log(`  ブレークイーブン: ${be(bev)}\n`);
}

console.log('========== 内部留保係数スイープ(修正後ロジック) ==========\n');
console.log('  係数  | 独身20% | 独身30% | 配偶20% | 配偶30%');
console.log('  ------|---------|---------|---------|--------');
for (const ratio of [0.85, 0.9, 0.95, 1.0]) {
  const cells = [
    findBreakeven(20, false, ratio),
    findBreakeven(30, false, ratio),
    findBreakeven(20, true, ratio),
    findBreakeven(30, true, ratio),
  ].map((v) => be(v).padStart(8));
  console.log(`  ${ratio.toFixed(2)}  |${cells.join(' |')}`);
}
console.log('\n  目標: 独身20% → 1000〜1500万 / 経費率30% → 1200〜1800万');
