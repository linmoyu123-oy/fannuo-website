'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PublicFooter() {
  const [info, setInfo] = useState({ phone: '', email: '', address: '' });

  useEffect(() => {
    fetch('/api/company').then(r => r.json()).then(d => {
      if (d && typeof d === 'object') setInfo(d as { phone: string; email: string; address: string });
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">廊坊凡诺外贸有限公司</h4>
            <p className="text-sm leading-relaxed">专业外贸服务，连接全球市场</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">产品中心</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">联系方式</h4>
            <ul className="space-y-2 text-sm">
              <li>电话：{info.phone || '0316-XXXXXXX'}</li>
              <li>邮箱：{info.email || 'info@fangfanuo.com'}</li>
              <li>地址：{info.address || '河北省廊坊市XXXX'}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-800">
        <div className="container-custom py-4 text-center text-xs text-primary-300">
          &copy; 2026 廊坊凡诺外贸有限公司 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}