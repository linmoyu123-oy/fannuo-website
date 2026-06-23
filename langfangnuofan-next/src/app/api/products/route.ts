import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `).all();
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;

  try {
    const { title, category_id, image, description, specs } = await request.json() as { title: string; category_id?: number; image?: string; description?: string; specs?: string };
    if (!title) {
      return NextResponse.json({ error: '产品名称不能为空' }, { status: 400 });
    }
    const db = getRequestContext().env.DB;
    const { success } = await db.prepare(`
      INSERT INTO products (category_id, title, description, image, specs, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(category_id || 0, title, description || '', image || '', specs || '').run();

    if (success) {
      const row = await db.prepare('SELECT * FROM products ORDER BY id DESC LIMIT 1').first();
      return NextResponse.json(row, { status: 201 });
    }
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
