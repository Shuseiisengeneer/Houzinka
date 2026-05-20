/**
 * 所得税の累進テーブル(共通)。
 * 単位はすべて「万円」。
 */

export interface TaxBracket {
  /** この金額(万円)以下に適用 */
  limit: number;
  /** 税率 */
  rate: number;
  /** 控除額(万円) */
  deduction: number;
}

/** 所得税 速算表(課税所得・万円ベース) */
export const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { limit: 195, rate: 0.05, deduction: 0 },
  { limit: 330, rate: 0.1, deduction: 9.75 },
  { limit: 695, rate: 0.2, deduction: 42.75 },
  { limit: 900, rate: 0.23, deduction: 63.6 },
  { limit: 1800, rate: 0.33, deduction: 153.6 },
  { limit: 4000, rate: 0.4, deduction: 279.6 },
  { limit: Infinity, rate: 0.45, deduction: 479.6 },
];

/**
 * 課税所得(万円)から所得税額(万円)を求める。
 */
export function incomeTax(taxableMan: number): number {
  const t = Math.max(0, taxableMan);
  const bracket = INCOME_TAX_BRACKETS.find((b) => t <= b.limit)!;
  return Math.max(0, t * bracket.rate - bracket.deduction);
}
