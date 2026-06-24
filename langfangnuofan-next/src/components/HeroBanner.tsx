'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLang } from '@/lib/LanguageProvider';

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setBanners(data);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (banners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="container-custom py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.default.title')}</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">{t('hero.default.sub')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[50vh] min-h-[360px] md:h-[65vh] md:min-h-[480px] overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      <div className="absolute inset-0 flex items-end justify-center text-center text-white z-10 pb-12 md:pb-20">
        <div className="container-custom px-4">
          {banners[current]?.link ? (
            <a href={banners[current].link} className="inline-block">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
                {banners[current]?.title || '廊坊凡诺外贸有限公司'}
              </h1>
            </a>
          ) : (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
              {banners[current]?.title || '廊坊凡诺外贸有限公司'}
            </h1>
          )}
          <p className="text-base sm:text-lg md:text-xl text-white/80 drop-shadow max-w-2xl mx-auto">
            {t('hero.default.sub')}
          </p>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
