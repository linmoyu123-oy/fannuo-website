'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
  sort_order: number;
  is_active: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', image: '', link: '' });

  const loadData = async () => {
    const data = await fetch('/api/banners').then(r => r.json()).catch(() => []);
    if (Array.isArray(data)) setBanners(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1920;
        const maxH = 1080;
        let w = img.width, h = img.height;
        if (w > maxW) { h = h * maxW / w; w = maxW; }
        if (h > maxH) { w = w * maxH / h; h = maxH; }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        setForm(f => ({ ...f, image: c.toDataURL('image/jpeg', 0.8) }));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', image: '', link: '' });
    setShowModal(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, image: b.image, link: b.link });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除？')) return;
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/banners?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (editing) {
      await fetch(`/api/banners?id=${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    loadData();
  };

  const moveBanner = async (idx: number, dir: number) => {
    const newBanners = [...banners];
    const target = idx + dir;
    if (target < 0 || target >= newBanners.length) return;
    [newBanners[idx], newBanners[target]] = [newBanners[target], newBanners[idx]];
    newBanners.forEach((b, i) => b.sort_order = i);
    const token = localStorage.getItem('admin_token');
    await fetch('/api/banners/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newBanners.map(b => ({ id: b.id, sort_order: b.sort_order }))),
    });
    setBanners(newBanners);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">共 {banners.length} 张轮播图</p>
        <button className="btn-primary btn-sm" onClick={openCreate}>添加轮播图</button>
      </div>

      <div className="space-y-4">
        {banners.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">暂无轮播图</div>
        ) : banners.map((b, i) => (
          <div key={b.id} className="card flex flex-col sm:flex-row gap-4 p-4">
            <img src={b.image} alt={b.title} className="w-full sm:w-52 h-28 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 mb-1">{b.title || '未命名'}</p>
              <p className="text-xs text-gray-400 truncate">{b.image}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="btn-secondary btn-sm" onClick={() => moveBanner(i, -1)} disabled={i === 0}>上移</button>
              <button className="btn-secondary btn-sm" onClick={() => moveBanner(i, 1)} disabled={i === banners.length - 1}>下移</button>
              <button className="btn-secondary btn-sm" onClick={() => openEdit(b)}>编辑</button>
              <button className="btn-danger btn-sm" onClick={() => handleDelete(b.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="float-right text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{editing ? '编辑轮播图' : '添加轮播图'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">图片 URL *</label>
                <input className="input-field mb-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
                <input type="file" accept="image/*" className="text-sm text-gray-500" onChange={handleFile} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">标题</label>
                <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">链接</label>
                <input className="input-field" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
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
