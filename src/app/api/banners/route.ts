import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(
      'SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
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
    const { title, image, link } = await request.json();
    if (!image) {
      return NextResponse.json({ error: '图片URL不能为空' }, { status: 400 });
    }

    const db = getRequestContext().env.DB;
    const { results: existing } = await db.prepare('SELECT COUNT(*) as cnt FROM banners').all();
    const nextOrder = (existing as any)[0]?.cnt || 0;

    const { success } = await db.prepare(
      'INSERT INTO banners (title, image, link, sort_order) VALUES (?, ?, ?, ?)'
    ).bind(title || '', image, link || '', nextOrder).run();

    if (success) {
      const row = await db.prepare('SELECT * FROM banners ORDER BY id DESC LIMIT 1').first();
      return NextResponse.json(row, { status: 201 });
    }
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 });
    }

    const { title, image, link } = await request.json();
    const db = getRequestContext().env.DB;
    await db.prepare(
      'UPDATE banners SET title = ?, image = ?, link = ? WHERE id = ?'
    ).bind(title || '', image || '', link || '', id).run();

    const updated = await db.prepare('SELECT * FROM banners WHERE id = ?').bind(id).first();
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const guard = await adminGuard(request);
  if (guard) return guard;
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 });
    }

    const db = getRequestContext().env.DB;
    await db.prepare('DELETE FROM banners WHERE id = ?').bind(id).run();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
