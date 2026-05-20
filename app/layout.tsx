import type { Metadata } from 'next';
import './globals.css';

const title = '個人事業 vs 法人化 損益分岐シミュレーター';
const description =
  '年商と経費率を入れるだけ。あなたが法人化すべきラインを3秒で診断。登録不要・無料の概算シミュレーションです。';

export const metadata: Metadata = {
  metadataBase: new URL('https://shuseiisengeneer.github.io'),
  title,
  description,
  keywords: ['法人化', '個人事業主', '損益分岐', '副業', '節税', 'シミュレーター'],
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'ja_JP',
    siteName: title,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
