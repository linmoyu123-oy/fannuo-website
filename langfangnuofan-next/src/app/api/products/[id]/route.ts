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
    const { title, category_id, image, description, specs } = await request.json();
    const db = getRequestContext().env.DB;

    const existing = await db.prepare('SELECT id FROM products WHERE id = ?').bind(id).first();
    if (!existing) {
      return NextResponse.json({ error: '浜у搧涓嶅瓨鍦? }, { status: 404 });
    }

    await db.prepare(`
      UPDATE products SET title = ?, category_id = ?, image = ?, description = ?, specs = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(title, category_id || 0, image || '', description || '', specs || '', id).run();

    const updated = await db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).bind(id).first();

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
    await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
