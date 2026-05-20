/**
 * 給与所得控除(法人化時、役員報酬に適用)。
 * 単位はすべて「万円」。
 */

/**
 * 給与収入(万円)から給与所得控除額(万円)を求める。
 */
export function salaryDeduction(salaryMan: number): number {
  const s = Math.max(0, salaryMan);
  if (s <= 162.5) return 55;
  if (s <= 180) return s * 0.4 - 10;
  if (s <= 360) return s * 0.3 + 8;
  if (s <= 660) return s * 0.2 + 44;
  if (s <= 850) return s * 0.1 + 110;
  return 195;
}
