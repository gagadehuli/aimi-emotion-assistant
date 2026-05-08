import type { ChatMessage, ChatRole, ChatSession } from "@/types/models";
import { getDb } from "./database";

type SessionRow = {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
  last_preview: string;
  pinned_at: number | null;
};

type MessageRow = {
  id: string;
  session_id: string;
  role: string;
  text: string;
  created_at: number;
};

function rowToSession(r: SessionRow): ChatSession {
  return {
    id: r.id,
    title: r.title,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    lastPreview: r.last_preview,
    pinnedAt: r.pinned_at,
  };
}

function rowToMessage(r: MessageRow): ChatMessage {
  return {
    id: r.id,
    sessionId: r.session_id,
    role: r.role === "ai" ? "ai" : "user",
    text: r.text,
    createdAt: r.created_at,
  };
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const SESSION_COLUMNS =
  "id, title, created_at, updated_at, last_preview, pinned_at";

const SESSION_ORDER =
  "ORDER BY (pinned_at IS NULL), pinned_at DESC, updated_at DESC";

export const storage = {
  async listSessions(): Promise<ChatSession[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<SessionRow>(
      `SELECT ${SESSION_COLUMNS}
         FROM chat_sessions
         ${SESSION_ORDER};`,
    );
    return rows.map(rowToSession);
  },

  async getSession(
    id: string,
  ): Promise<{ session: ChatSession; messages: ChatMessage[] } | null> {
    const db = await getDb();
    const sRow = await db.getFirstAsync<SessionRow>(
      `SELECT ${SESSION_COLUMNS}
         FROM chat_sessions
        WHERE id = ?;`,
      [id],
    );
    if (!sRow) return null;
    const mRows = await db.getAllAsync<MessageRow>(
      `SELECT id, session_id, role, text, created_at
         FROM chat_messages
        WHERE session_id = ?
        ORDER BY created_at ASC;`,
      [id],
    );
    return {
      session: rowToSession(sRow),
      messages: mRows.map(rowToMessage),
    };
  },

  async createSession(title: string): Promise<ChatSession> {
    const db = await getDb();
    const id = makeId("s");
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO chat_sessions (id, title, created_at, updated_at, last_preview)
       VALUES (?, ?, ?, ?, ?);`,
      [id, title, now, now, ""],
    );
    return {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      lastPreview: "",
      pinnedAt: null,
    };
  },

  async appendMessage(
    sessionId: string,
    role: ChatRole,
    text: string,
  ): Promise<ChatMessage> {
    const db = await getDb();
    const id = makeId("m");
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO chat_messages (id, session_id, role, text, created_at)
       VALUES (?, ?, ?, ?, ?);`,
      [id, sessionId, role, text, now],
    );
    await db.runAsync(
      `UPDATE chat_sessions
          SET updated_at = ?, last_preview = ?
        WHERE id = ?;`,
      [now, text, sessionId],
    );
    return { id, sessionId, role, text, createdAt: now };
  },

  async renameSession(id: string, title: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "UPDATE chat_sessions SET title = ? WHERE id = ?;",
      [title, id],
    );
  },

  async setPinned(id: string, pinned: boolean): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "UPDATE chat_sessions SET pinned_at = ? WHERE id = ?;",
      [pinned ? Date.now() : null, id],
    );
  },

  async deleteSession(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM chat_sessions WHERE id = ?;", [id]);
  },

  async wipeAll(): Promise<void> {
    const db = await getDb();
    await db.execAsync(`
      DELETE FROM chat_messages;
      DELETE FROM chat_sessions;
      DELETE FROM mood_records;
      DELETE FROM tree_posts;
      DELETE FROM agents;
      DELETE FROM settings;
      INSERT INTO settings (key, value) VALUES ('seeded', '1');
    `);
  },

  async getSetting(key: string): Promise<string | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM settings WHERE key = ?;",
      [key],
    );
    return row?.value ?? null;
  },

  async setSetting(key: string, value: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
      [key, value],
    );
  },
};
