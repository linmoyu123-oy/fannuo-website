import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { extractToken } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (token) {
      const db = getRequestContext().env.DB;
      await db.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
