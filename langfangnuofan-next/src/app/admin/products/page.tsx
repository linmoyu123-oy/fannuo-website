'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  title: string;
  category_id: number;
  image: string;
  description: string;
  specs: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ title: '', category_id: 0, image: '', description: '', specs: '' });

  const loadData = async () => {
    const [p, c] = await Promise.all([
      fetch('/api/products').then(r => r.json()).catch(() => []),
      fetch('/api/categories').then(r => r.json()).catch(() => []),
    ]);
    if (Array.isArray(p)) setProducts(p);
    if (Array.isArray(c)) setCategories(c);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', category_id: 0, image: '', description: '', specs: '' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ title: p.title, category_id: p.category_id, image: p.image, description: p.description, specs: p.specs });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除此产品？')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const url = editing ? `/api/products/${editing.id}` : '/api/products';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">共 {products.length} 个产品</p>
        <button className="btn-primary btn-sm" onClick={openCreate}>添加产品</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>图片</th>
                <th>名称</th>
                <th>分类</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-12">暂无产品</td></tr>
              ) : products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt="" className="w-14 h-14 object-cover rounded-lg" />
                    ) : (
                      <span className="text-gray-300 text-xs">无图</span>
                    )}
                  </td>
                  <td className="font-medium">{p.title}</td>
                  <td className="text-gray-500">{categories.find(c => c.id === p.category_id)?.name || '-'}</td>
                  <td className="text-gray-500 text-sm">{new Date(p.updated_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-secondary btn-sm" onClick={() => openEdit(p)}>编辑</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(p.id)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="float-right text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{editing ? '编辑产品' : '添加产品'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">产品名称</label>
                <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">分类</label>
                <select className="select-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}>
                  <option value={0}>无分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">图片 URL</label>
                <input className="input-field" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">描述</label>
                <textarea className="textarea-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">规格参数</label>
                <textarea className="textarea-field" rows={4} value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>取消</button>
                <button type="submit" className="btn-primary">{editing ? '保存' : '创建'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
