'use client';

import { useState, useEffect } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { useLang } from '@/lib/LanguageProvider';

export default function AboutPage() {
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/company');
        const d = await res.json() as Record<string, string>;
        if (d.about_content) setContent(d.about_content);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  return (
    <>
      <PublicHeader />
      <section className="page-banner">
        <div className="container-custom">
          <h1>{t('about.banner.title')}</h1>
          <p>{t('about.banner.sub')}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-900 rounded-full inline-block"></span>
              {t('about.intro.title')}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-line">
              {loaded ? (content || t('about.intro.empty')) : (
                <><span className="inline-block bg-gray-200 rounded w-full h-5 mb-2 animate-pulse" /><span className="inline-block bg-gray-200 rounded w-full h-5 mb-2 animate-pulse" /><span className="inline-block bg-gray-200 rounded w-2/3 h-5 animate-pulse" /></>
              )}
            </div>

            <h2 className="text-2xl font-bold text-primary-900 mt-12 mb-6">{t('about.culture.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">{t('about.culture.mission')}</h3>
                <p className="text-sm text-gray-600">{t('about.culture.mission.desc')}</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">{t('about.culture.vision')}</h3>
                <p className="text-sm text-gray-600">{t('about.culture.vision.desc')}</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">{t('about.culture.value')}</h3>
                <p className="text-sm text-gray-600">{t('about.culture.value.desc')}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary-900 mt-12 mb-6">{t('about.why.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: '专业团队', desc: '经验丰富的外贸团队，精通国际贸易规则和流程' },
                { title: '品质保证', desc: '严格的质量控制体系，确保每一批次产品符合标准' },
                { title: '高效物流', desc: '完善的物流网络，提供快速可靠的全球运输服务' },
                { title: '售后无忧', desc: '完善的售后服务体系，及时解决客户问题' },
              ].map((item) => (
                <div key={item.title} className="card p-6 text-center">
                  <h3 className="font-bold text-primary-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
