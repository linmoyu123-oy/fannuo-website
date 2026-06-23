import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const { name, slug, sort_order } = await request.json();
    const db = getRequestContext().env.DB;

    const existing = await db.prepare('SELECT id FROM categories WHERE id = ?').bind(id).first();
    if (!existing) {
      return NextResponse.json({ error: '鍒嗙被涓嶅瓨鍦? }, { status: 404 });
    }

    const slugConflict = await db.prepare(
      'SELECT id FROM categories WHERE slug = ? AND id != ?'
    ).bind(slug, id).first();
    if (slugConflict) {
      return NextResponse.json({ error: 'Slug 宸茶鍏朵粬鍒嗙被浣跨敤' }, { status: 400 });
    }

    await db.prepare(
      'UPDATE categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?'
    ).bind(name, slug, sort_order || 0, id).run();

    const updated = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const db = getRequestContext().env.DB;

    await db.prepare('UPDATE products SET category_id = 0 WHERE category_id = ?').bind(id).run();
    await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
