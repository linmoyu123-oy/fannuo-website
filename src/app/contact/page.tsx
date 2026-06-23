'use client';

import { useState, useEffect } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companyInfo, setCompanyInfo] = useState<Record<string, string>>({});

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
        const data = await res.json();
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
          <h1>联系我们</h1>
          <p>Contact Us</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-primary-900 mb-8">联系方式</h2>
              <div className="space-y-6">
                {[
                  { label: '地址', value: companyInfo.address || '河北省廊坊市广阳区XXXX' },
                  { label: '电话', value: companyInfo.phone || '0316-XXXXXXX' },
                  { label: '邮箱', value: companyInfo.email || 'info@fangfanuo.com' },
                  { label: '工作时间', value: companyInfo.working_hours || '周一至周五：9:00 - 18:00' },
                ].map((item) => (
                  <div key={item.label}>
                    <h3 className="text-sm text-gray-400 mb-1">{item.label}</h3>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary-900 mb-8">在线询盘</h2>
              {success ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-6 text-center">
                  <p className="font-semibold text-lg mb-1">提交成功!</p>
                  <p className="text-sm">我们会尽快与您联系。</p>
                  <button className="btn-primary mt-4" onClick={() => setSuccess(false)}>继续提交</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">姓名 *</label>
                    <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">邮箱 *</label>
                    <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">电话</label>
                    <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">公司名称</label>
                    <input className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">留言内容 *</label>
                    <textarea className="textarea-field" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-3 disabled:opacity-60">
                    {submitting ? '提交中...' : '提交询盘'}
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
