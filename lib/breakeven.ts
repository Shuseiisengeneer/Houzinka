/**
 * ブレークイーブン(法人化分岐点)算出と売上推移データ生成。
 * 単位はすべて「万円」。
 */

import { calcSolo } from './tax-solo';
import { calcCorp, INTERNAL_RESERVE_RATIO } from './tax-corp';

export interface TrendPoint {
  /** 売上(万円) */
  revenue: number;
  /** 個人事業の年間手取り */
  solo: number;
  /** 法人化の年間総手取り */
  corp: number;
  /** 法人化メリット額(corp - solo、マイナスもあり) */
  advantage: number;
}

/**
 * 売上を step 刻みで振って、個人 vs 法人の手取り推移を返す。
 */
export function buildTrend(
  expenseRate: number,
  hasSpouse: boolean,
  maxRevenue = 5000,
  step = 100,
  ratio: number = INTERNAL_RESERVE_RATIO,
): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let revenue = step; revenue <= maxRevenue; revenue += step) {
    const solo = calcSolo({ revenue, expenseRate, hasSpouse }).takehome;
    const corp = calcCorp({ revenue, expenseRate, hasSpouse }, ratio).takehome;
    points.push({ revenue, solo, corp, advantage: corp - solo });
  }
  return points;
}

/**
 * 最初に法人化手取りが個人事業手取りを上回る売上(=ブレークイーブン)を返す。
 * 5000万まで上回らない場合は null。
 */
export function findBreakeven(
  expenseRate: number,
  hasSpouse: boolean,
  ratio: number = INTERNAL_RESERVE_RATIO,
): number | null {
  const trend = buildTrend(expenseRate, hasSpouse, 5000, 100, ratio);
  const hit = trend.find((p) => p.corp > p.solo);
  return hit ? hit.revenue : null;
}
