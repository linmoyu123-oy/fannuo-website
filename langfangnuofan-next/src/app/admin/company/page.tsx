'use client';

import { useState, useEffect } from 'react';

const defaultFields = [
  { key: 'company_name', label: '公司名称', type: 'text' },
  { key: 'company_name_en', label: '公司英文名称', type: 'text' },
  { key: 'slogan', label: '标语', type: 'text' },
  { key: 'about_content', label: '关于我们（内容）', type: 'textarea' },
  { key: 'address', label: '地址', type: 'text' },
  { key: 'phone', label: '电话', type: 'text' },
  { key: 'email', label: '邮箱', type: 'text' },
  { key: 'working_hours', label: '工作时间', type: 'text' },
  { key: 'facebook_url', label: 'Facebook 链接', type: 'text' },
  { key: 'whatsapp_url', label: 'WhatsApp 链接', type: 'text' },
];

export default function AdminCompanyPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/company');
        setForm(await res.json() as Record<string, string>);
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const token = localStorage.getItem('admin_token');
    await fetch('/api/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {defaultFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="textarea-field"
                  rows={6}
                  value={form[field.key] || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              ) : (
                <input
                  className="input-field"
                  value={form[field.key] || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? '保存中...' : '保存修改'}
            </button>
            {saved && <span className="text-green-600 text-sm">已保存</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
