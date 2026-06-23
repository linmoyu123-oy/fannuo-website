'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', sort_order: 0 });

  const loadData = async () => {
    const data = await fetch('/api/categories').then(r => r.json()).catch(() => []);
    if (Array.isArray(data)) setCategories(data);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', sort_order: 0 });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除？')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (editing) {
      await fetch(`/api/categories/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">共 {categories.length} 个分类</p>
        <button className="btn-primary btn-sm" onClick={openCreate}>添加分类</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>Slug</th>
                <th>排序</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-12">暂无分类</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="text-gray-500 text-sm">{cat.id}</td>
                  <td className="font-medium">{cat.name}</td>
                  <td className="text-gray-500 text-sm">{cat.slug}</td>
                  <td className="text-gray-500 text-sm">{cat.sort_order}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-secondary btn-sm" onClick={() => openEdit(cat)}>编辑</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>删除</button>
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
            <h2 className="text-xl font-bold text-gray-800 mb-6">{editing ? '编辑分类' : '添加分类'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">分类名称</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Slug（英文标识，如 electronics）</label>
                <input className="input-field" value={form.slug} onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  setForm({ ...form, slug });
                }} required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">排序（数字越小越靠前）</label>
                <input type="number" className="input-field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
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
