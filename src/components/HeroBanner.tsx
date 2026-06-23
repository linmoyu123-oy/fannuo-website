'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setBanners(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="container-custom py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">廊坊凡诺外贸有限公司</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">专业外贸服务，连接全球市场</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[400px] md:h-[520px] overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${banner.image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {banners[current]?.title || '廊坊凡诺外贸有限公司'}
          </h1>
          <p className="text-xl text-white/80 drop-shadow">专业外贸服务，连接全球市场</p>
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
