import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM categories ORDER BY sort_order ASC, id ASC'
    ).all();
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const { name, slug, sort_order } = await request.json();
    if (!name || !slug) {
      return NextResponse.json({ error: '名称和Slug不能为空' }, { status: 400 });
    }
    const db = getRequestContext().env.DB;

    const existing = await db.prepare('SELECT id FROM categories WHERE slug = ?').bind(slug).first();
    if (existing) {
      return NextResponse.json({ error: 'Slug 已存在' }, { status: 400 });
    }

    const { success } = await db.prepare(
      'INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)'
    ).bind(name, slug, sort_order || 0).run();

    if (success) {
      const row = await db.prepare('SELECT * FROM categories ORDER BY id DESC LIMIT 1').first();
      return NextResponse.json(row, { status: 201 });
    }
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
