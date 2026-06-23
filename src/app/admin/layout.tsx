'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin') {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin');
      return;
    }
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) setAuthed(true);
      else {
        localStorage.removeItem('admin_token');
        router.replace('/admin');
      }
    }).catch(() => {
      localStorage.removeItem('admin_token');
      router.replace('/admin');
    }).finally(() => setLoading(false));
  }, [pathname, router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      await fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
    localStorage.removeItem('admin_token');
    router.replace('/admin');
  };

  if (pathname === '/admin') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      <main className="admin-main pb-20 md:pb-0">
        <div className="admin-header">
          <h2 className="text-lg font-semibold text-gray-800">
            {pathname === '/admin/dashboard' && '控制台'}
            {pathname === '/admin/products' && '产品管理'}
            {pathname === '/admin/categories' && '分类管理'}
            {pathname === '/admin/messages' && '询盘管理'}
            {pathname === '/admin/banners' && '轮播图管理'}
            {pathname === '/admin/company' && '公司信息'}
          </h2>
          <span className="text-sm text-gray-500">管理员</span>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
