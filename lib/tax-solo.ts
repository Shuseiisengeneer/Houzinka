/**
 * 個人事業(青色申告想定)の年間手取り計算。
 * 単位はすべて「万円」。概算シミュレーション用。
 */

import { incomeTax } from './income-tax';

/** 青色申告特別控除 */
export const BLUE_DEDUCTION = 65;
/** 基礎控除 */
export const BASIC_DEDUCTION = 48;
/** 配偶者控除 */
export const SPOUSE_DEDUCTION = 38;
/** 国民年金(年額・固定) */
export const NATIONAL_PENSION = 20.4;

export interface SoloInput {
  /** 年商売上(万円) */
  revenue: number;
  /** 経費率(%) 0〜80 */
  expenseRate: number;
  /** 配偶者の有無 */
  hasSpouse: boolean;
}

export interface SoloResult {
  revenue: number;
  expenses: number;
  /** 事業所得 = 売上 - 経費 */
  businessIncome: number;
  blueDeduction: number;
  basicDeduction: number;
  spouseDeduction: number;
  nationalPension: number;
  /** 国民健康保険 */
  nationalHealth: number;
  taxableIncome: number;
  incomeTaxAmount: number;
  residentTax: number;
  /** 年間手取り */
  takehome: number;
}

/**
 * 国民健康保険(概算): 事業所得の10%、上限100万円。
 */
export function nationalHealthInsurance(businessIncome: number): number {
  return Math.min(Math.max(0, businessIncome) * 0.1, 100);
}

/**
 * 個人事業の年間手取りを計算する。
 */
export function calcSolo({ revenue, expenseRate, hasSpouse }: SoloInput): SoloResult {
  const expenses = revenue * (expenseRate / 100);
  const businessIncome = revenue - expenses;

  const spouseDeduction = hasSpouse ? SPOUSE_DEDUCTION : 0;
  const nationalHealth = nationalHealthInsurance(businessIncome);

  const totalDeduction =
    BLUE_DEDUCTION + BASIC_DEDUCTION + spouseDeduction + NATIONAL_PENSION + nationalHealth;

  const taxableIncome = Math.max(0, businessIncome - totalDeduction);
  const incomeTaxAmount = incomeTax(taxableIncome);
  const residentTax = taxableIncome * 0.1;

  const takehome =
    businessIncome - incomeTaxAmount - residentTax - NATIONAL_PENSION - nationalHealth;

  return {
    revenue,
    expenses,
    businessIncome,
    blueDeduction: BLUE_DEDUCTION,
    basicDeduction: BASIC_DEDUCTION,
    spouseDeduction,
    nationalPension: NATIONAL_PENSION,
    nationalHealth,
    taxableIncome,
    incomeTaxAmount,
    residentTax,
    takehome,
  };
}
