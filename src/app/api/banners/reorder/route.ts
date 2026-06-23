import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const items: { id: number; sort_order: number }[] = await request.json();
    const db = getRequestContext().env.DB;

    for (const item of items) {
      await db.prepare('UPDATE banners SET sort_order = ? WHERE id = ?')
        .bind(item.sort_order, item.id).run();
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
