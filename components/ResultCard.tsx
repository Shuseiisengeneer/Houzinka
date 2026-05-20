import { forwardRef } from 'react';
import { APP_URL, X_HANDLE } from '@/lib/share';

interface Props {
  corpFavored: boolean;
  /** 有利な側との差額(万円・絶対値) */
  advantage: number;
  breakeven: number | null;
  revenue: number;
  expenseRate: number;
  hasSpouse: boolean;
}

/**
 * X シェア用 1200×630 カード。html-to-image で画像化される対象 DOM。
 */
const ResultCard = forwardRef<HTMLDivElement, Props>(function ResultCard(
  { corpFavored, advantage, breakeven, revenue, expenseRate, hasSpouse },
  ref,
) {
  const accent = corpFavored ? '#0F766E' : '#EA580C';
  const amount = Math.round(advantage).toLocaleString();

  return (
    <div
      ref={ref}
      style={{
        width: 1200,
        height: 630,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px',
        background: '#ffffff',
        fontFamily:
          '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif',
        color: '#111827',
        borderTop: `14px solid ${accent}`,
      }}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: '#374151' }}>
          個人事業 vs 法人化 損益分岐シミュレーター
        </span>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#9CA3AF' }}>概算診断</span>
      </div>

      {/* メイン */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: accent }}>
          {corpFavored ? '法人化メリット' : '個人事業のほうがおトク'}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: accent }}>年</span>
          <span style={{ fontSize: 160, fontWeight: 900, color: accent, lineHeight: 1 }}>
            {amount}
          </span>
          <span style={{ fontSize: 56, fontWeight: 900, color: accent }}>
            万円{corpFavored ? '' : '差'}
          </span>
        </div>
        <div
          style={{
            marginTop: 20,
            padding: '12px 32px',
            borderRadius: 9999,
            background: '#0F766E',
            color: '#ffffff',
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          {breakeven !== null
            ? `法人化分岐点 年商${breakeven.toLocaleString()}万円`
            : '法人化分岐点なし(年商5,000万まで)'}
        </div>
      </div>

      {/* フッター */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#6B7280' }}>
          年商{revenue.toLocaleString()}万円 / 経費率{expenseRate}% /{' '}
          {hasSpouse ? '配偶者あり' : '独身'}
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 20, color: '#9CA3AF' }}>
            概算・個別の税務アドバイスではありません
          </span>
          <span style={{ fontSize: 22, fontWeight: 700, color: accent }}>
            {APP_URL.replace('https://', '')} {X_HANDLE}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ResultCard;
