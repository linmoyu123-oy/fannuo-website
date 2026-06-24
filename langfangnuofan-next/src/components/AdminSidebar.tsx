'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/LanguageProvider';

const menuItems = (t: (k: string) => string) => [
  { href: '/admin/dashboard', label: t('admin.sidebar.dashboard'), icon: '📊' },
  { href: '/admin/products', label: t('admin.sidebar.products'), icon: '📦' },
  { href: '/admin/categories', label: t('admin.sidebar.categories'), icon: '🏷️' },
  { href: '/admin/messages', label: t('admin.sidebar.messages'), icon: '✉️' },
  { href: '/admin/banners', label: t('admin.sidebar.banners'), icon: '🖼️' },
  { href: '/admin/company', label: t('admin.sidebar.company'), icon: '🏢' },
];

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const { t } = useLang();
  const items = menuItems(t);

  return (
    <>
      <aside className="admin-sidebar">
        <div className="p-5 border-b border-primary-700 text-center">
          <Link href="/admin/dashboard" className="text-white font-bold text-lg tracking-wider">
            凡诺外贸
          </Link>
          <p className="text-primary-300 text-xs mt-1">管理系统</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-primary-700">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary-300 hover:text-white hover:bg-primary-800 transition-colors mb-1"
          >
            <span>🌐</span> {t('admin.sidebar.front')}
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary-300 hover:text-white hover:bg-primary-800 transition-colors w-full"
          >
            <span>🚪</span> {t('admin.sidebar.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around py-2 px-1">
        {items.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${
                isActive ? 'text-primary-900 font-semibold' : 'text-gray-500'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
