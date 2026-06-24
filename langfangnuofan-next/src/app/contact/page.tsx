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
                {(companyInfo.facebook_url || companyInfo.whatsapp_url) && (
                  <div className="flex gap-3 pt-2">
                    {companyInfo.facebook_url && (
                      <a href={companyInfo.facebook_url} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        Facebook
                      </a>
                    )}
                    {companyInfo.whatsapp_url && (
                      <a href={companyInfo.whatsapp_url} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    )}
                  </div>
                )}
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
