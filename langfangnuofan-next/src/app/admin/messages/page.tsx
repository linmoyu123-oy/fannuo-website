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

  useEffect(() => {
    fetch('/api/messages').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setMessages(d);
    }).catch(() => {});
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
            {messages.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-400 py-12">暂无询盘</td></tr>
            ) : messages.map((m) => (
              <tr key={m.id}>
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
    </div>
  );
}
