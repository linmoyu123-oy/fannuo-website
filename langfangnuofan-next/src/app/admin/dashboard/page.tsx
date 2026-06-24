'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, messages: 0, categories: 0, banners: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()).catch(() => []),
      fetch('/api/messages').then(r => r.json()).catch(() => []),
      fetch('/api/categories').then(r => r.json()).catch(() => []),
      fetch('/api/banners').then(r => r.json()).catch(() => []),
    ]).then(([products, messages, categories, banners]) => {
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        banners: Array.isArray(banners) ? banners.length : 0,
      });
      if (Array.isArray(messages)) setRecentMessages(messages.slice(0, 5));
    });
  }, []);

  const cards = [
    { label: '产品总数', value: stats.products, color: 'bg-blue-500' },
    { label: '询盘总数', value: stats.messages, color: 'bg-green-500' },
    { label: '分类数', value: stats.categories, color: 'bg-purple-500' },
    { label: '轮播图数', value: stats.banners, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={card.label} className={`stat-card animate-fade-in-up animate-delay-${i + 1}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {card.value}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-static">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">最新询盘</h3>
          <span className="badge-primary">{recentMessages.length} 条</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>邮箱</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.length > 0 ? recentMessages.map((m: any) => (
                <tr key={m.id}>
                  <td className="font-medium">{m.name}</td>
                  <td className="text-gray-500">{m.email}</td>
                  <td className="text-gray-500">{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="text-center text-gray-400 py-12">暂无询盘</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
