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
    <section className="relative bg-primary-900 overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '21/9' }}>
        {banners.map((banner, i) => (
          <img
            key={banner.id}
            src={banner.image}
            alt={banner.title || ''}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectFit: 'contain', objectPosition: 'center' }}
          />
        ))}
      </div>

      <div className="bg-black/60 backdrop-blur-sm">
        <div className="container-custom px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            {banners[current]?.link ? (
              <a href={banners[current].link} className="text-white hover:text-primary-200 transition-colors">
                <h2 className="text-base md:text-lg font-semibold truncate">
                  {banners[current]?.title || t('hero.default.title')}
                </h2>
              </a>
            ) : (
              <h2 className="text-base md:text-lg font-semibold text-white truncate">
                {banners[current]?.title || t('hero.default.title')}
              </h2>
            )}
          </div>
          {banners.length > 1 && (
            <div className="flex gap-1.5 flex-shrink-0 ml-4">
              {banners.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-white w-5' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all z-10"
            style={{ top: 'calc(50% - 24px)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all z-10"
            style={{ top: 'calc(50% - 24px)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </section>
  );
}
