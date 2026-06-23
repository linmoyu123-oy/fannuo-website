import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '廊坊凡诺外贸有限公司',
  description: '专业外贸服务，连接全球市场',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
