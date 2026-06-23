-- ==================== 廊坊凡诺外贸有限公司 D1 数据库建表 SQL ====================
-- 在 Cloudflare Dashboard 的 D1 控制台执行，或使用 wrangler d1 execute

-- 产品分类表
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  specs TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 询盘消息表
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 公司信息表（key-value 结构）
CREATE TABLE IF NOT EXISTS company_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT ''
);

-- 管理员会话表
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

-- ==================== 初始数据 ====================

-- 插入默认公司信息
INSERT OR IGNORE INTO company_info (key, value) VALUES
  ('company_name', '廊坊凡诺外贸有限公司'),
  ('company_name_en', 'Langfang Fannuo Foreign Trade Co., Ltd.'),
  ('slogan', '专业外贸服务，连接全球市场'),
  ('about_content', '廊坊凡诺外贸有限公司是一家专业的国际贸易企业，致力于为客户提供优质的产品和卓越的服务。公司位于河北省廊坊市，依托京津冀地区的产业优势，将中国制造推向全球市场。'),
  ('address', '河北省廊坊市广阳区XXXX'),
  ('phone', '0316-XXXXXXX'),
  ('email', 'info@fangfanuo.com'),
  ('working_hours', '周一至周五：9:00 - 18:00');
