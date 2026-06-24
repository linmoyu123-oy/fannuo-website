'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import { useLang } from '@/lib/LanguageProvider';

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

const whyItems = (t: (k: string) => string) => [
  { icon: '🏆', title: t('home.why.team'), desc: t('home.why.team.desc') },
  { icon: '✅', title: t('home.why.quality'), desc: t('home.why.quality.desc') },
  { icon: '🚚', title: t('home.why.logistics'), desc: t('home.why.logistics.desc') },
  { icon: '💬', title: t('home.why.service'), desc: t('home.why.service.desc') },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { t } = useLang();

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
            <h2 className="section-title">{t('home.about.title')}</h2>
            <p id="aboutPreview" className="text-gray-600 leading-relaxed mb-10 text-lg">
              廊坊凡诺外贸有限公司是一家专业的国际贸易企业，致力于为客户提供优质的产品和卓越的服务。公司位于河北省廊坊市，依托京津冀地区的产业优势，将中国制造推向全球市场。
            </p>
            <Link href="/about" className="btn-primary">{t('home.about.more')}</Link>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-custom">
            <h2 className="section-title">{t('home.products.title')}</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((p, i) => (
                  <div key={p.id} className={`animate-fade-in-up animate-delay-${i + 1}`}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-12">{t('home.products.empty')}</p>
            )}
            <div className="text-center mt-12">
              <Link href="/products" className="btn-secondary">{t('home.products.all')}</Link>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="py-20 md:py-28">
          <div className="container-custom text-center max-w-3xl mx-auto">
            <h2 className="section-title">{t('home.why.title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {whyItems(t).map((item, i) => (
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
