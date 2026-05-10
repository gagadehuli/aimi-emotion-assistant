import * as SQLite from "expo-sqlite";
import { SEED_AGENTS, SEED_SESSIONS, SEED_TREE_POSTS } from "@/mocks";

const DB_NAME = "aimi.db";
// Current schema version: 6 (kept inline in migrate() so each step is self-contained)
const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = init();
  return dbPromise;
}

async function init() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync("PRAGMA foreign_keys = ON;");
  await migrate(db);
  await maybeSeedSessions(db);
  await maybeSeedTreePosts(db);
  await maybeSeedAgents(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
  const current = row?.user_version ?? 0;
  if (current < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        last_preview TEXT NOT NULL DEFAULT ''
      );
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated
        ON chat_sessions(updated_at DESC);

      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session
        ON chat_messages(session_id, created_at);

      CREATE TABLE IF NOT EXISTS mood_records (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        mood TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        note TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tree_posts (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_alias TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        intro TEXT NOT NULL,
        hue TEXT NOT NULL,
        is_private INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      PRAGMA user_version = 1;
    `);
  }
  if (current < 2) {
    await db.execAsync(`
      ALTER TABLE chat_sessions ADD COLUMN pinned_at INTEGER;
      PRAGMA user_version = 2;
    `);
  }
  if (current < 3) {
    await db.execAsync(`
      ALTER TABLE chat_messages ADD COLUMN source TEXT;
      PRAGMA user_version = 3;
    `);
  }
  if (current < 4) {
    // mood_records 表在 v1 已建；这一步只补 created_at 索引，Weekly 周报按时间窗口扫表
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_mood_records_created
        ON mood_records(created_at DESC);
      PRAGMA user_version = 4;
    `);
  }
  if (current < 5) {
    // 树洞本地点赞计数；老数据 likes 默认 0
    await db.execAsync(`
      ALTER TABLE tree_posts ADD COLUMN likes INTEGER NOT NULL DEFAULT 0;
      CREATE INDEX IF NOT EXISTS idx_tree_posts_created
        ON tree_posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tree_posts_category
        ON tree_posts(category);
      PRAGMA user_version = 5;
    `);
  }
  if (current < 6) {
    // 本设备的"是否已点赞"标记，让点赞变成 toggle。老行 is_liked 默认 0。
    await db.execAsync(`
      ALTER TABLE tree_posts ADD COLUMN is_liked INTEGER NOT NULL DEFAULT 0;
      PRAGMA user_version = 6;
    `);
  }
}

async function maybeSeedSessions(db: SQLite.SQLiteDatabase) {
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'seeded';",
  );
  if (seeded?.value === "1") return;

  const now = Date.now();
  for (const s of SEED_SESSIONS) {
    const sessionTs = now - s.daysAgo * DAY_MS;
    const lastMsg = s.messages[s.messages.length - 1];
    const preview = lastMsg ? lastMsg.text : "";
    await db.runAsync(
      `INSERT INTO chat_sessions (id, title, created_at, updated_at, last_preview)
       VALUES (?, ?, ?, ?, ?);`,
      [s.id, s.title, sessionTs, sessionTs, preview],
    );
    let i = 0;
    for (const m of s.messages) {
      const msgTs = sessionTs + i;
      i += 1;
      await db.runAsync(
        `INSERT INTO chat_messages (id, session_id, role, text, created_at)
         VALUES (?, ?, ?, ?, ?);`,
        [`${s.id}_msg_${i}`, s.id, m.role, m.text, msgTs],
      );
    }
  }
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded', '1');",
  );
}

async function maybeSeedTreePosts(db: SQLite.SQLiteDatabase) {
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'tree_seeded';",
  );
  if (seeded?.value === "1") return;

  const now = Date.now();
  for (const p of SEED_TREE_POSTS) {
    const ts = now - p.hoursAgo * HOUR_MS;
    await db.runAsync(
      `INSERT INTO tree_posts (id, category, title, content, author_alias, likes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [p.id, p.category, p.title, p.content, p.authorAlias, 0, ts],
    );
  }
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES ('tree_seeded', '1');",
  );
}

async function maybeSeedAgents(db: SQLite.SQLiteDatabase) {
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'agents_seeded';",
  );
  if (seeded?.value === "1") return;

  const now = Date.now();
  let i = 0;
  for (const a of SEED_AGENTS) {
    const ts = now - i * 60_000; // 之间间隔 1 分钟，保证排序稳定
    i += 1;
    await db.runAsync(
      `INSERT INTO agents (id, name, intro, hue, is_private, created_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [a.id, a.name, a.intro, a.hue, a.isPrivate ? 1 : 0, ts],
    );
  }
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES ('agents_seeded', '1');",
  );
}
