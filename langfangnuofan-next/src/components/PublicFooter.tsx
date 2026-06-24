'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageProvider';

export default function PublicFooter() {
  const [info, setInfo] = useState({ phone: '', email: '', address: '' });
  const { t } = useLang();

  useEffect(() => {
    fetch('/api/company').then(r => r.json()).then(d => {
      if (d && typeof d === 'object') setInfo(d as { phone: string; email: string; address: string });
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">{t('footer.company')}</h4>
            <p className="text-sm leading-relaxed">{t('footer.slogan')}</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">{t('footer.quicklinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li>{t('contact.phone')}：{info.phone || '19832518858'}</li>
              <li>{t('contact.email')}：{info.email || 'lmoyu7838@gmail.com'}</li>
              <li>{t('contact.address')}：{info.address || '河北省廊坊市大城县'}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-800">
        <div className="container-custom py-4 text-center text-xs text-primary-300">
          &copy; 2026 {t('footer.company')} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
