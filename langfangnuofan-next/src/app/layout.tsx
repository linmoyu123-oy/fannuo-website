import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageProvider';

export const metadata: Metadata = {
  title: '廊坊凡诺外贸有限公司 | Langfang Fannuo Foreign Trade',
  description: '专业外贸服务，连接全球市场 — 廊坊凡诺外贸有限公司，为您提供优质的产品和卓越的国际贸易服务。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
