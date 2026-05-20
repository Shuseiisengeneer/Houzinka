/**
 * 法人化(マイクロ法人 + 役員報酬)の年間手取り計算。
 * 単位はすべて「万円」。概算シミュレーション用。
 */

import { incomeTax } from './income-tax';
import { salaryDeduction } from './salary-deduction';

/**
 * 内部留保係数。法人内に残した利益(税引後)を手取り換算するときの割引率。
 * 現実感覚(年商1000〜1500万付近で法人化分岐)に合わせて 1.0 に較正済み。
 * 配当時の二重課税を厳しめに見たい場合は 0.85〜0.95 に下げる(調整用パラメータ)。
 */
export const INTERNAL_RESERVE_RATIO = 1.0;
/** 法人住民税の均等割(年額・固定) */
export const CORP_EQUALIZATION_TAX = 7;
/** 役員報酬の上限(これ以上は法人に残す想定) */
export const MAX_OFFICER_SALARY = 660;
/** 法人に最低限残す利益 */
export const MIN_CORP_RESERVE = 50;
/** 社会保険料率(健保10% + 厚年18% + 雇用保険1.5%、労使合算) */
export const SOCIAL_INSURANCE_RATE = 0.3;
/** 基礎控除 */
export const BASIC_DEDUCTION = 48;
/** 配偶者控除 */
export const SPOUSE_DEDUCTION = 38;

export interface CorpInput {
  /** 年商売上(万円) */
  revenue: number;
  /** 経費率(%) 0〜80 */
  expenseRate: number;
  /** 配偶者の有無 */
  hasSpouse: boolean;
}

export interface CorpResult {
  revenue: number;
  expenses: number;
  /** 役員報酬 */
  officerSalary: number;
  /** 法人所得 = 売上 - 経費 - 役員報酬 */
  corpIncome: number;
  /** 法人税 */
  corpTax: number;
  /** 法人住民税均等割 */
  equalizationTax: number;
  /** 法人課税合計 */
  corpTaxTotal: number;
  /** 法人内残留(税引後) */
  corpRetained: number;
  /** 給与所得控除 */
  salaryDeductionAmount: number;
  /** 社会保険料 */
  socialInsurance: number;
  /** 課税給与 */
  taxableSalary: number;
  personalIncomeTax: number;
  personalResidentTax: number;
  /** 個人手取り */
  personalTakehome: number;
  /** 内部留保係数を掛けた法人内残留 */
  corpRetainedAdjusted: number;
  /** 法人化総手取り */
  takehome: number;
}

/**
 * 法人税(中小特例)を計算する。
 * 800万以下: 25%、800万超: 800×25% + 超過分×33%。
 */
export function corporateTax(corpIncome: number): number {
  const c = Math.max(0, corpIncome);
  if (c <= 800) return c * 0.25;
  return 800 * 0.25 + (c - 800) * 0.33;
}

/**
 * 法人化した場合の年間総手取りを計算する。
 * @param ratio 内部留保係数(省略時は INTERNAL_RESERVE_RATIO)
 */
export function calcCorp(
  { revenue, expenseRate, hasSpouse }: CorpInput,
  ratio: number = INTERNAL_RESERVE_RATIO,
): CorpResult {
  const expenses = revenue * (expenseRate / 100);
  const profit = revenue - expenses;

  const officerSalary = Math.max(0, Math.min(MAX_OFFICER_SALARY, profit - MIN_CORP_RESERVE));
  const corpIncome = profit - officerSalary;

  const corpTax = corporateTax(corpIncome);
  const corpTaxTotal = corpTax + CORP_EQUALIZATION_TAX;
  const corpRetained = corpIncome - corpTaxTotal;

  const salaryDeductionAmount = salaryDeduction(officerSalary);
  const socialInsurance = officerSalary * SOCIAL_INSURANCE_RATE;
  const spouseDeduction = hasSpouse ? SPOUSE_DEDUCTION : 0;

  const taxableSalary = Math.max(
    0,
    officerSalary - salaryDeductionAmount - socialInsurance - BASIC_DEDUCTION - spouseDeduction,
  );
  const personalIncomeTax = incomeTax(taxableSalary);
  const personalResidentTax = taxableSalary * 0.1;
  const personalTakehome =
    officerSalary - personalIncomeTax - personalResidentTax - socialInsurance;

  const corpRetainedAdjusted = corpRetained * ratio;
  const takehome = personalTakehome + corpRetainedAdjusted;

  return {
    revenue,
    expenses,
    officerSalary,
    corpIncome,
    corpTax,
    equalizationTax: CORP_EQUALIZATION_TAX,
    corpTaxTotal,
    corpRetained,
    salaryDeductionAmount,
    socialInsurance,
    taxableSalary,
    personalIncomeTax,
    personalResidentTax,
    personalTakehome,
    corpRetainedAdjusted,
    takehome,
  };
}
