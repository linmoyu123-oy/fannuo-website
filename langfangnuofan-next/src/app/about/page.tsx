'use client';

import { useState, useEffect } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const defaultContent =
  '廊坊凡诺外贸有限公司成立于2020年，总部位于河北省廊坊市，是一家专业从事国际贸易的综合服务企业。公司凭借优越的地理位置和深厚的行业资源，致力于为全球客户提供高品质的产品和一站式外贸解决方案。公司业务涵盖机械制造、建筑材料、家居用品、电子配件等多个领域，产品远销欧美、东南亚、中东等国家和地区。我们秉承"诚信为本、客户至上"的经营理念，与多家国际知名企业建立了长期稳定的合作关系。';

export default function AboutPage() {
  const [content, setContent] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/company');
        const d = await res.json() as Record<string, string>;
        if (d.about_content) setContent(d.about_content);
        if (d.company_name) setCompanyName(d.company_name);
      } catch {}
    })();
  }, []);

  return (
    <>
      <PublicHeader />
      <section className="page-banner">
        <div className="container-custom">
          <h1>关于我们</h1>
          <p>About Us</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-900 rounded-full inline-block"></span>
              公司简介
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-line">
              {content || defaultContent}
            </div>

            <h2 className="text-2xl font-bold text-primary-900 mt-12 mb-6">企业文化</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">使命</h3>
                <p className="text-sm text-gray-600">让中国制造走向世界，为客户创造最大价值</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">愿景</h3>
                <p className="text-sm text-gray-600">成为国际一流的贸易服务商</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="font-bold text-primary-900 mb-2">价值观</h3>
                <p className="text-sm text-gray-600">诚信、专业、创新、共赢</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary-900 mt-12 mb-6">为什么选择我们</h2>
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
