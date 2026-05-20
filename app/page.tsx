'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultDisplay from '@/components/ResultDisplay';
import ComparisonChart from '@/components/ComparisonChart';
import RevenueTrendChart from '@/components/RevenueTrendChart';
import ResultCard from '@/components/ResultCard';
import { calcSolo } from '@/lib/tax-solo';
import { calcCorp } from '@/lib/tax-corp';
import { buildTrend, findBreakeven } from '@/lib/breakeven';
import { APP_URL, FIRST_TOOL_URL, X_HANDLE, buildTweetUrl } from '@/lib/share';

/** 値の変化を delay ミリ秒だけ遅らせて返す */
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const man = (n: number) => Math.round(n).toLocaleString();

export default function Page() {
  const [revenue, setRevenue] = useState(1000);
  const [expenseRate, setExpenseRate] = useState(30);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const dRevenue = useDebounced(revenue);
  const dExpenseRate = useDebounced(expenseRate);
  const dHasSpouse = useDebounced(hasSpouse);

  const result = useMemo(() => {
    const solo = calcSolo({ revenue: dRevenue, expenseRate: dExpenseRate, hasSpouse: dHasSpouse });
    const corp = calcCorp({ revenue: dRevenue, expenseRate: dExpenseRate, hasSpouse: dHasSpouse });
    const breakeven = findBreakeven(dExpenseRate, dHasSpouse);
    const trend = buildTrend(dExpenseRate, dHasSpouse, 3000, 100);
    return { solo, corp, breakeven, trend };
  }, [dRevenue, dExpenseRate, dHasSpouse]);

  const advantage = result.corp.takehome - result.solo.takehome;
  const corpFavored = advantage > 0;

  const resultsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.3);

  // シェアカードのプレビューをコンテナ幅に合わせて縮小
  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const update = () => setPreviewScale(el.clientWidth / 1200);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 最初の入力操作のときだけ結果へスクロール
  useEffect(() => {
    if (interacted) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [interacted]);

  const touch = () => setInteracted(true);

  const saveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 630,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'houjinka-shindan.png';
      a.click();
    } catch {
      alert('画像の生成に失敗しました。少し時間をおいて再度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 pb-16">
      {/* ===== ヒーロー ===== */}
      <section className="pt-10 text-center">
        <p className="text-xs font-bold tracking-wider text-brand">
          副業の旨味終了点シミュレーター 第二弾
        </p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-gray-900 sm:text-3xl">
          個人事業 vs 法人化
          <br />
          損益分岐シミュレーター
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          年商と経費率を入れるだけ。
          <br />
          あなたが法人化すべきラインを3秒で診断。
        </p>
        <p className="mt-3 text-[11px] text-gray-400">
          ※概算シミュレーションです。個別の税務相談ではありません。
        </p>
        <a
          href={FIRST_TOOL_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs font-bold text-brand underline underline-offset-2"
        >
          → 第一弾「副業の旨味終了点シミュレーター」はこちら
        </a>
      </section>

      {/* ===== 入力フォーム ===== */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-black text-gray-900">3つ入れるだけ</h2>
        <div
          onPointerDown={touch}
          onKeyDown={touch}
          onChange={touch}
        >
          <InputForm
            revenue={revenue}
            expenseRate={expenseRate}
            hasSpouse={hasSpouse}
            onRevenue={setRevenue}
            onExpenseRate={setExpenseRate}
            onSpouse={setHasSpouse}
          />
        </div>
      </section>

      {/* ===== 結果セクション ===== */}
      <div ref={resultsRef} className="scroll-mt-4">
        <section className="mt-8">
          <ResultDisplay
            corpFavored={corpFavored}
            advantage={Math.abs(advantage)}
            breakeven={result.breakeven}
            revenue={dRevenue}
          />
        </section>

        {/* 比較棒グラフ */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-black text-gray-900">年間手取りの比較</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            年商{man(dRevenue)}万円・経費率{dExpenseRate}%での手取り(概算)
          </p>
          <div className="mt-2">
            <ComparisonChart solo={result.solo.takehome} corp={result.corp.takehome} />
          </div>
          <div className="flex justify-center gap-4 text-xs font-bold">
            <span className="text-accent">■ 個人事業</span>
            <span className="text-brand">■ 法人化</span>
          </div>
        </section>

        {/* 売上推移グラフ */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-black text-gray-900">売上ごとの法人化メリット</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            縦軸がプラスなら法人化が有利。安定してプラスへ転じる点が分岐点です。
          </p>
          <div className="mt-2">
            <RevenueTrendChart data={result.trend} breakeven={result.breakeven} />
          </div>
        </section>

        {/* 壁の説明 */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-black text-gray-900">法人化の「壁」を知っておく</h2>
          <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-gray-700">
            <li className="flex gap-2">
              <span className="text-accent">▲</span>
              <span>
                <b>赤字でも年7万円</b>:法人住民税の均等割は利益ゼロでも発生します。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">▲</span>
              <span>
                <b>社会保険が強制加入</b>:役員報酬のおよそ30%(労使合算)が保険料負担に。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">▲</span>
              <span>
                <b>設立・維持コスト</b>:設立費用(合同会社で約10万円〜)や税理士顧問料がかかります。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand">●</span>
              <span>
                <b>給与所得控除を使える</b>:役員報酬に給与所得控除が乗り、所得を法人と個人に分散できます。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand">●</span>
              <span>
                <b>内部留保・経費範囲の拡大</b>:利益を法人に残して再投資でき、経費にできる範囲も広がります。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand">●</span>
              <span>
                <b>消費税の壁</b>:年商1,000万円超で課税事業者に(個人・法人問わず)。法人成りで免税期間を作る戦略もあります。
              </span>
            </li>
          </ul>
          {dRevenue >= 1000 && (
            <p className="mt-3 rounded-lg bg-accent/10 px-3 py-2 text-xs font-bold text-accent-dark">
              あなたは年商1,000万円超 → 消費税の課税事業者ラインに該当します。
            </p>
          )}
        </section>

        {/* シェアカード */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-black text-gray-900">結果をシェアする</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            診断結果をXに投稿できます(1200×630pxの画像)。
          </p>

          {/* プレビュー(縮小表示) */}
          <div
            ref={previewWrapRef}
            className="mt-3 overflow-hidden rounded-lg border border-gray-200"
            style={{ height: 630 * previewScale }}
          >
            <div
              style={{
                width: 1200,
                height: 630,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
              }}
            >
              <ResultCard
                corpFavored={corpFavored}
                advantage={Math.abs(advantage)}
                breakeven={result.breakeven}
                revenue={dRevenue}
                expenseRate={dExpenseRate}
                hasSpouse={dHasSpouse}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={saveImage}
              disabled={saving}
              className="rounded-xl border border-brand bg-white px-4 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand/5 disabled:opacity-50"
            >
              {saving ? '生成中…' : '画像を保存'}
            </button>
            <a
              href={buildTweetUrl(result.breakeven)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Xでシェア
            </a>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            ※「画像を保存」で端末に保存 → Xの投稿画面で画像を添付すると、カード付きで投稿できます。
          </p>
        </section>
      </div>

      {/* ===== フッター ===== */}
      <footer className="mt-12 space-y-3 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
        <p className="font-bold text-gray-700">
          より精密な月次最適化・役員報酬最適化ツールを開発中。
        </p>
        <p>
          リリース通知の登録は{' '}
          <a
            href="https://example.com/notify"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand underline underline-offset-2"
          >
            こちら(後で差し替え)
          </a>
        </p>
        <p className="text-[11px] text-gray-400">
          概算です。実際の税額は税理士・税務署で必ずご確認ください。本ツールは特定の税務アドバイスを行うものではありません。
        </p>
        <p>
          <a
            href={FIRST_TOOL_URL}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand underline underline-offset-2"
          >
            第一弾「副業の旨味終了点シミュレーター」
          </a>
        </p>
        <p className="text-[11px] text-gray-400">
          作成: {X_HANDLE}（やすまろ） / {APP_URL.replace('https://', '')}
        </p>
      </footer>

      {/* 画像化用の隠しカード(実寸) */}
      <div
        aria-hidden
        style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}
      >
        <ResultCard
          ref={cardRef}
          corpFavored={corpFavored}
          advantage={Math.abs(advantage)}
          breakeven={result.breakeven}
          revenue={dRevenue}
          expenseRate={dExpenseRate}
          hasSpouse={dHasSpouse}
        />
      </div>
    </main>
  );
}
