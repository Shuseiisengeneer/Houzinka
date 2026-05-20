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
 * ブレークイーブン(法人化分岐点)を返す。
 *
 * 「その売上以降、上限(5000万)までずっと法人化が有利であり続ける最小の売上」を分岐点とする。
 * 低売上域では国民年金が定額(20.4万)であるのに対し法人の社会保険料が役員報酬比例で
 * 小さくなるため、メリット曲線が非単調になり一時的に法人有利へ振れることがある。
 * その低売上のノイズ交点は無視し、安定して法人有利になる点だけを採用する。
 *
 * 上限売上まで法人有利が続かない場合(=分岐点なし)は null を返す。
 */
export function findBreakeven(
  expenseRate: number,
  hasSpouse: boolean,
  ratio: number = INTERNAL_RESERVE_RATIO,
): number | null {
  const trend = buildTrend(expenseRate, hasSpouse, 5000, 100, ratio);
  // 上限売上から下へ走査し、法人有利が途切れる手前までを分岐点候補とする。
  let breakeven: number | null = null;
  for (let i = trend.length - 1; i >= 0; i--) {
    if (trend[i].corp > trend[i].solo) {
      breakeven = trend[i].revenue;
    } else {
      break;
    }
  }
  return breakeven;
}
