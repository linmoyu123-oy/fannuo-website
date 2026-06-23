import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { extractToken } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const token = extractToken(request);
  if (!token) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const db = getRequestContext().env.DB;
    const row = await db.prepare(
      'SELECT id FROM admin_sessions WHERE token = ? AND expires_at > datetime(?)'
    ).bind(token, new Date().toISOString()).first();

    if (!row) {
      return NextResponse.json({ error: 'Token 无效或已过期' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: '验证失败' }, { status: 500 });
  }
}
