import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, getExpiresAt } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json() as { password: string };
    const ctx = getRequestContext();
    const db = ctx.env.DB;

    const envPassword = ctx.env.ADMIN_PASSWORD || (process as any).env?.ADMIN_PASSWORD;
    let adminPassword = envPassword as string | undefined;

    if (!adminPassword) {
      const row = await db.prepare("SELECT value FROM company_info WHERE key = 'admin_password'").first() as { value?: string } | null;
      adminPassword = row?.value;
    }

    if (!adminPassword) {
      return NextResponse.json({ error: '请先在 D1 数据库 company_info 表中设置 admin_password' }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    const token = generateToken();
    const expiresAt = getExpiresAt();

    await db.prepare(
      'INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)'
    ).bind(token, expiresAt).run();

    return NextResponse.json({ token, expiresAt });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || '登录失败' }, { status: 500 });
  }
}
