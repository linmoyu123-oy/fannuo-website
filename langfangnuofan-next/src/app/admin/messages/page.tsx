'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Message | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/messages')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMessages(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>电话</th>
              <th>公司</th>
              <th>留言</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12"><span className="text-gray-400">加载中...</span></td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-400 py-12">暂无询盘</td></tr>
            ) : messages.map((m) => (
              <tr key={m.id} className="cursor-pointer" onClick={() => setDetail(m)}>
                <td className="text-sm text-gray-500 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                <td className="font-medium">{m.name}</td>
                <td className="text-gray-500">{m.email}</td>
                <td className="text-gray-500">{m.phone || '-'}</td>
                <td className="text-gray-500">{m.company || '-'}</td>
                <td className="max-w-xs text-gray-600">
                  <p className="truncate">{m.message}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">询盘详情</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex"><dt className="w-20 text-gray-500">姓名</dt><dd className="font-medium">{detail.name}</dd></div>
              <div className="flex"><dt className="w-20 text-gray-500">邮箱</dt><dd>{detail.email}</dd></div>
              <div className="flex"><dt className="w-20 text-gray-500">电话</dt><dd>{detail.phone || '-'}</dd></div>
              <div className="flex"><dt className="w-20 text-gray-500">公司</dt><dd>{detail.company || '-'}</dd></div>
              <div className="flex"><dt className="w-20 text-gray-500">时间</dt><dd>{new Date(detail.created_at).toLocaleString()}</dd></div>
              <div><dt className="text-gray-500 mb-1">留言内容</dt><dd className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{detail.message}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
