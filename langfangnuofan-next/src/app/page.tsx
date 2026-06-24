'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProducts(d.slice(0, 4));
    }).catch(() => {});
    (async () => {
      try {
        const res = await fetch('/api/company');
        const d = await res.json() as Record<string, string>;
        if (d.about_content) {
          const el = document.getElementById('aboutPreview');
          if (el) el.textContent = d.about_content;
        }
      } catch {}
    })();
  }, []);

  return (
    <>
      <PublicHeader />
      <HeroBanner />

      <RevealSection>
        <section className="py-20 md:py-28">
          <div className="container-custom text-center max-w-3xl mx-auto">
            <h2 className="section-title">关于我们</h2>
            <p id="aboutPreview" className="text-gray-600 leading-relaxed mb-10 text-lg">
              廊坊凡诺外贸有限公司是一家专业的国际贸易企业，致力于为客户提供优质的产品和卓越的服务。公司位于河北省廊坊市，依托京津冀地区的产业优势，将中国制造推向全球市场。
            </p>
            <Link href="/about" className="btn-primary">了解更多 →</Link>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-custom">
            <h2 className="section-title">产品展示</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((p, i) => (
                  <div key={p.id} className={`animate-fade-in-up animate-delay-${i + 1}`}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-12">暂无产品数据</p>
            )}
            <div className="text-center mt-12">
              <Link href="/products" className="btn-secondary">查看全部产品 →</Link>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="py-20 md:py-28">
          <div className="container-custom text-center max-w-3xl mx-auto">
            <h2 className="section-title">为什么选择我们</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: '🏆', title: '专业团队', desc: '经验丰富的外贸团队' },
                { icon: '✅', title: '品质保证', desc: '严格质量控制体系' },
                { icon: '🚚', title: '高效物流', desc: '快速可靠全球运输' },
                { icon: '💬', title: '售后无忧', desc: '完善售后服务体系' },
              ].map((item, i) => (
                <div key={item.title} className={`card-static p-6 text-center animate-fade-in-up animate-delay-${i + 1} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-primary-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <PublicFooter />
    </>
  );
}
