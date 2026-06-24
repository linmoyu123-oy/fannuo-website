'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/LanguageProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetch('/api/admin/verify', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => { if (r.ok) router.replace('/admin/dashboard'); })
        .catch(() => {});
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json() as { token?: string; error?: string };
      if (res.ok) {
        localStorage.setItem('admin_token', data.token || '');
        router.replace('/admin/dashboard');
      } else {
        setError(data.error || '密码错误');
      }
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-900">{t('admin.login.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">廊坊凡诺外贸有限公司</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">{t('admin.login.password')}</label>
            <input
              type="password"
              className="input-field"
              placeholder={t('admin.login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? t('admin.login.loading') : t('admin.login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
