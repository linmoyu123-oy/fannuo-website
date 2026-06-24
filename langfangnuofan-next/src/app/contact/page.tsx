'use client';

import { useState, useEffect } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { useLang } from '@/lib/LanguageProvider';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companyInfo, setCompanyInfo] = useState<Record<string, string>>({});
  const { t } = useLang();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/company');
        setCompanyInfo(await res.json() as Record<string, string>);
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('请填写姓名、邮箱和留言');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error || '提交失败');
      }
    } catch {
      setError('网络错误，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PublicHeader />
      <section className="page-banner">
        <div className="container-custom">
          <h1>{t('contact.banner.title')}</h1>
          <p>{t('contact.banner.sub')}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-primary-900 mb-8">{t('contact.info.title')}</h2>
              <div className="space-y-6">
                {[
                  { label: t('contact.address'), value: companyInfo.address || '河北省廊坊市大城县', icon: '📍' },
                  { label: t('contact.phone'), value: companyInfo.phone || '19832518858', icon: '📞' },
                  { label: t('contact.email'), value: companyInfo.email || 'lmoyu7838@gmail.com', icon: '✉️' },
                  { label: t('contact.hours'), value: companyInfo.working_hours || t('contact.hours'), icon: '🕐' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors duration-200">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-sm text-gray-500 mb-0.5">{item.label}</h3>
                      <p className="text-gray-800 font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary-900 mb-8">{t('contact.form.title')}</h2>
              {success ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-6 text-center">
                  <p className="font-semibold text-lg mb-1">{t('contact.form.success')}</p>
                  <p className="text-sm">{t('contact.form.success.desc')}</p>
                  <button className="btn-primary mt-4" onClick={() => setSuccess(false)}>{t('contact.form.continue')}</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('contact.form.name')}</label>
                    <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('contact.form.email')}</label>
                    <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('contact.form.phone')}</label>
                    <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('contact.form.company')}</label>
                    <input className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t('contact.form.message')}</label>
                    <textarea className="textarea-field" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-3 disabled:opacity-60">
                    {submitting ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
