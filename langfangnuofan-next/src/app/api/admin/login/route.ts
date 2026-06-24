import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, getExpiresAt } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json() as { password: string };
    const ctx = getRequestContext();
    const adminPassword = (ctx.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD) as string | undefined;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    const token = generateToken();
    const expiresAt = getExpiresAt();

    const db = ctx.env.DB;
    await db.prepare(
      'INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)'
    ).bind(token, expiresAt).run();

    return NextResponse.json({ token, expiresAt });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '登录失败' }, { status: 500 });
  }
}
