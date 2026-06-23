import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM messages ORDER BY created_at DESC'
    ).all();
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message } = await request.json() as { name: string; email: string; phone?: string; company?: string; message: string };

    if (!name || !email || !message) {
      return NextResponse.json({ error: '姓名、邮箱和留言为必填项' }, { status: 400 });
    }

    const db = getRequestContext().env.DB;
    const { success } = await db.prepare(
      'INSERT INTO messages (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)'
    ).bind(name, email, phone || '', company || '', message).run();

    if (success) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    return NextResponse.json({ error: '提交失败' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
