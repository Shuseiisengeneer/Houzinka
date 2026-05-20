/**
 * X(Twitter)シェア用のヘルパー。
 */

/** このアプリの公開URL(GitHub Pages 想定) */
export const APP_URL = 'https://shuseiisengeneer.github.io/houzinka/';
/** 第一弾「副業の旨味終了点シミュレーター」 */
export const FIRST_TOOL_URL = 'https://shuseiisengeneer.github.io/hukugyo_zeikin/';
/** 作者の X ハンドル */
export const X_HANDLE = '@0yen_helloworld';

/**
 * ツイート本文を組み立てる。
 */
export function buildTweetText(breakeven: number | null): string {
  const point = breakeven ? `年商${breakeven}万円` : '年商5000万円以上';
  return `私の法人化分岐点は${point}でした。あなたも → ${APP_URL} #個人開発 #副業 #法人化`;
}

/**
 * X の intent URL を組み立てる。
 */
export function buildTweetUrl(breakeven: number | null): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(buildTweetText(breakeven))}`;
}
