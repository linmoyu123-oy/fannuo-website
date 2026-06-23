import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare('SELECT key, value FROM company_info').all();

    const data: Record<string, string> = {};
    for (const row of results as any[]) {
      data[row.key] = row.value;
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const body: Record<string, string> = await request.json();
    const db = getRequestContext().env.DB;

    for (const [key, value] of Object.entries(body)) {
      await db.prepare(
        'INSERT INTO company_info (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
      ).bind(key, value, value).run();
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
