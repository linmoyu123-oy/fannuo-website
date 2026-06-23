import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDB(): D1Database {
  const ctx = getRequestContext();
  return ctx.env.DB;
}
