import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

const TOKEN_EXPIRY_HOURS = 24;

export function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function getExpiresAt(): string {
  const d = new Date();
  d.setHours(d.getHours() + TOKEN_EXPIRY_HOURS);
  return d.toISOString();
}

export function getAdminPassword(): string {
  const ctx = getRequestContext();
  return ctx.env.ADMIN_PASSWORD || '';
}

export function extractToken(request: Request): string | null {
  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  const url = new URL(request.url);
  return url.searchParams.get('token') || null;
}

export async function requireAdmin(request: Request): Promise<boolean> {
  const token = extractToken(request);
  if (!token) return false;
  try {
    const db = getRequestContext().env.DB;
    const row = await db.prepare(
      'SELECT id FROM admin_sessions WHERE token = ? AND expires_at > datetime(?)'
    ).bind(token, new Date().toISOString()).first();
    return !!row;
  } catch {
    return false;
  }
}

export async function adminGuard(request: Request): Promise<Response | null> {
  const ok = await requireAdmin(request);
  if (!ok) {
    return NextResponse.json({ error: '未授权，请登录' }, { status: 401 });
  }
  return null;
}
