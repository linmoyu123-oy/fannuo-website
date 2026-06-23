'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category_id: number;
  specs: string;
  category_name?: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProducts(d.slice(0, 4));
    }).catch(() => {});
    fetch('/api/company').then(r => r.json()).then((d: any) => {
      if (d.about_content) {
        const el = document.getElementById('aboutPreview');
        if (el) el.textContent = d.about_content;
      }
    }).catch(() => {});
    fetch('/api/news').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setNews(d.slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <>
      <PublicHeader />
      <HeroBanner />

      {/* About section */}
      <section className="py-16 md:py-20">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h2 className="section-title">关于我们</h2>
          <p id="aboutPreview" className="text-gray-600 leading-relaxed mb-8">
            廊坊凡诺外贸有限公司是一家专业的国际贸易企业，致力于为客户提供优质的产品和卓越的服务。公司位于河北省廊坊市，依托京津冀地区的产业优势，将中国制造推向全球市场。
          </p>
          <Link href="/about" className="btn-primary">了解更多</Link>
        </div>
      </section>

      {/* Products section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title">产品展示</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">暂无产品数据</p>
          )}
          <div className="text-center mt-10">
            <Link href="/products" className="btn-primary">查看全部产品</Link>
          </div>
        </div>
      </section>

      {/* News section */}
      <section className="py-16 md:py-20">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="section-title">新闻动态</h2>
          {news.length > 0 ? (
            <div className="space-y-6">
              {news.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <p className="text-sm text-gray-400 mb-1">{item.date}</p>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">暂无新闻</p>
          )}
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
