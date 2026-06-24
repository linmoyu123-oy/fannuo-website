'use client';

import { useState, useEffect, useCallback } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import ProductCard from '@/components/ProductCard';
import { useLang } from '@/lib/LanguageProvider';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category_id: number;
  specs: string;
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const { t } = useLang();

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProducts(d);
    }).catch(() => {});
    fetch('/api/categories').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setCategories(d);
    }).catch(() => {});
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category_id === Number(catFilter);
    return matchSearch && matchCat;
  });

  const getCategoryName = useCallback((catId: number) => {
    return categories.find(c => c.id === catId)?.name || '';
  }, [categories]);

  return (
    <>
      <PublicHeader />
      <section className="page-banner">
        <div className="container-custom">
          <h1>{t('products.banner.title')}</h1>
          <p>{t('products.banner.sub')}</p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder={t('products.search')}
              className="input-field flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="select-field sm:w-48" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
              <option value="">{t('products.all')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{ ...p, category_name: getCategoryName(p.category_id) }}
                  onDetail={(prod) => setSelected({ ...prod, category_name: getCategoryName(prod.category_id) })}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-20">{t('products.empty')}</p>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="float-right text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300 text-2xl" onClick={() => setSelected(null)}>&times;</button>
            {selected.image && (
              <img src={selected.image} alt={selected.title} className="w-full h-72 object-cover rounded-xl mb-6 shadow-md" />
            )}
            <h2 className="text-2xl font-bold text-primary-900 mb-3">{selected.title}</h2>
            {selected.category_name && (
              <span className="inline-block bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full mb-4">
                {selected.category_name}
              </span>
            )}
            <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>
            {selected.specs && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <strong className="text-sm text-gray-700">{t('products.specs')}</strong>
                <pre className="text-sm text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">{selected.specs}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </>
  );
}
