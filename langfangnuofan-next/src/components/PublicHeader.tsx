'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/LanguageProvider';

const navLinks = (t: (k: string) => string) => [
  { href: '/', label: t('nav.home') },
  { href: '/about', label: t('nav.about') },
  { href: '/products', label: t('nav.products') },
  { href: '/contact', label: t('nav.contact') },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, toggleLang, lang } = useLang();
  const links = navLinks(t);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-primary-900/95 backdrop-blur-md shadow-xl' : 'bg-primary-900 shadow-lg'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-wider whitespace-nowrap">
            廊坊凡诺外贸有限公司
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-primary-700 text-white' : 'text-primary-100 hover:text-white hover:bg-primary-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={toggleLang}
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary-400 text-primary-100 hover:bg-primary-700 transition-colors"
            >
              {t('lang.switch')}
            </button>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-primary-400 text-primary-100"
            >
              {t('lang.switch')}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-primary-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="菜单"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-primary-700 pt-2">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm ${
                    isActive ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-800'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
