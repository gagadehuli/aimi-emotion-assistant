import type {
  Agent,
  AiSource,
  ChatMessage,
  ChatRole,
  ChatSession,
  Mood,
  MoodRecord,
  TreePost,
} from "@/types/models";
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
  source: string | null;
};

type MoodRow = {
  id: string;
  session_id: string | null;
  mood: string;
  intensity: number;
  note: string | null;
  created_at: number;
};

type TreePostRow = {
  id: string;
  category: string;
  title: string;
  content: string;
  author_alias: string | null;
  likes: number;
  is_liked: number;
  created_at: number;
};

type AgentRow = {
  id: string;
  name: string;
  intro: string;
  hue: string;
  is_private: number;
  created_at: number;
};

function rowToTreePost(r: TreePostRow): TreePost {
  return {
    id: r.id,
    category: r.category,
    title: r.title,
    content: r.content,
    authorAlias: r.author_alias,
    likes: r.likes,
    liked: r.is_liked === 1,
    createdAt: r.created_at,
  };
}

function rowToAgent(r: AgentRow): Agent {
  return {
    id: r.id,
    name: r.name,
    intro: r.intro,
    hue: r.hue,
    isPrivate: r.is_private === 1,
    createdAt: r.created_at,
  };
}

const TREE_POST_COLUMNS =
  "id, category, title, content, author_alias, likes, is_liked, created_at";

const AGENT_COLUMNS = "id, name, intro, hue, is_private, created_at";

const VALID_MOODS: ReadonlySet<Mood> = new Set([
  "calm",
  "happy",
  "tired",
  "anxious",
  "sad",
]);

function normalizeMood(s: string): Mood {
  return VALID_MOODS.has(s as Mood) ? (s as Mood) : "calm";
}

function rowToMood(r: MoodRow): MoodRecord {
  return {
    id: r.id,
    sessionId: r.session_id,
    mood: normalizeMood(r.mood),
    intensity: r.intensity,
    note: r.note,
    createdAt: r.created_at,
  };
}

const MOOD_COLUMNS = "id, session_id, mood, intensity, note, created_at";

function startOfThisWeek(now: number = Date.now()): number {
  const d = new Date(now);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offsetDays = day === 0 ? 6 : day - 1; // 距本周一过去几天
  const monday = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() - offsetDays,
    0,
    0,
    0,
    0,
  );
  return monday.getTime();
}

function endOfThisWeek(now: number = Date.now()): number {
  return startOfThisWeek(now) + 7 * 86_400_000;
}

function startOfToday(now: number = Date.now()): number {
  const d = new Date(now);
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    0,
    0,
    0,
    0,
  ).getTime();
}

export { endOfThisWeek, startOfThisWeek, startOfToday };

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
    source: normalizeSource(r.source),
  };
}

function normalizeSource(s: string | null): AiSource | null {
  if (s === "gemini" || s === "safety" || s === "mock") return s;
  return null;
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

const MESSAGE_COLUMNS = "id, session_id, role, text, created_at, source";

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
      `SELECT ${MESSAGE_COLUMNS}
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
    source: AiSource | null = null,
  ): Promise<ChatMessage> {
    const db = await getDb();
    const id = makeId("m");
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO chat_messages (id, session_id, role, text, created_at, source)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [id, sessionId, role, text, now, source],
    );
    await db.runAsync(
      `UPDATE chat_sessions
          SET updated_at = ?, last_preview = ?
        WHERE id = ?;`,
      [now, text, sessionId],
    );
    return { id, sessionId, role, text, createdAt: now, source };
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
    // 清空数据后把所有 seeder flag 都置位，下次启动不会再补回种子内容。
    await db.execAsync(`
      DELETE FROM chat_messages;
      DELETE FROM chat_sessions;
      DELETE FROM mood_records;
      DELETE FROM tree_posts;
      DELETE FROM agents;
      DELETE FROM settings;
      INSERT INTO settings (key, value) VALUES ('seeded', '1');
      INSERT INTO settings (key, value) VALUES ('tree_seeded', '1');
      INSERT INTO settings (key, value) VALUES ('agents_seeded', '1');
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

  async createMoodRecord(input: {
    sessionId?: string | null;
    mood: Mood;
    intensity?: number;
    note?: string | null;
  }): Promise<MoodRecord> {
    const db = await getDb();
    const id = makeId("mr");
    const now = Date.now();
    const intensity = clampIntensity(input.intensity ?? 3);
    const sessionId = input.sessionId ?? null;
    const note = input.note ?? null;
    await db.runAsync(
      `INSERT INTO mood_records (id, session_id, mood, intensity, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [id, sessionId, input.mood, intensity, note, now],
    );
    return {
      id,
      sessionId,
      mood: input.mood,
      intensity,
      note,
      createdAt: now,
    };
  },

  async listMoodRecords(range?: {
    since?: number;
    until?: number;
  }): Promise<MoodRecord[]> {
    const db = await getDb();
    const since = range?.since;
    const until = range?.until;
    if (since !== undefined && until !== undefined) {
      const rows = await db.getAllAsync<MoodRow>(
        `SELECT ${MOOD_COLUMNS}
           FROM mood_records
          WHERE created_at >= ? AND created_at < ?
          ORDER BY created_at ASC;`,
        [since, until],
      );
      return rows.map(rowToMood);
    }
    const rows = await db.getAllAsync<MoodRow>(
      `SELECT ${MOOD_COLUMNS}
         FROM mood_records
         ORDER BY created_at DESC;`,
    );
    return rows.map(rowToMood);
  },

  async listMoodRecordsForWeek(now: number = Date.now()): Promise<MoodRecord[]> {
    return this.listMoodRecords({
      since: startOfThisWeek(now),
      until: endOfThisWeek(now),
    });
  },

  async hasMoodRecordToday(now: number = Date.now()): Promise<boolean> {
    const db = await getDb();
    const start = startOfToday(now);
    const end = start + 86_400_000;
    const row = await db.getFirstAsync<{ n: number }>(
      "SELECT COUNT(*) AS n FROM mood_records WHERE created_at >= ? AND created_at < ?;",
      [start, end],
    );
    return (row?.n ?? 0) > 0;
  },

  async deleteMoodRecord(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM mood_records WHERE id = ?;", [id]);
  },

  async listTreePosts(filter?: {
    category?: string;
  }): Promise<TreePost[]> {
    const db = await getDb();
    if (filter?.category) {
      const rows = await db.getAllAsync<TreePostRow>(
        `SELECT ${TREE_POST_COLUMNS}
           FROM tree_posts
          WHERE category = ?
          ORDER BY created_at DESC;`,
        [filter.category],
      );
      return rows.map(rowToTreePost);
    }
    const rows = await db.getAllAsync<TreePostRow>(
      `SELECT ${TREE_POST_COLUMNS}
         FROM tree_posts
         ORDER BY created_at DESC;`,
    );
    return rows.map(rowToTreePost);
  },

  async createTreePost(input: {
    category: string;
    title: string;
    content: string;
    authorAlias?: string | null;
  }): Promise<TreePost> {
    const db = await getDb();
    const id = makeId("tp");
    const now = Date.now();
    const author = input.authorAlias ?? null;
    await db.runAsync(
      `INSERT INTO tree_posts (id, category, title, content, author_alias, likes, is_liked, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, input.category, input.title, input.content, author, 0, 0, now],
    );
    return {
      id,
      category: input.category,
      title: input.title,
      content: input.content,
      authorAlias: author,
      likes: 0,
      liked: false,
      createdAt: now,
    };
  },

  async deleteTreePost(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM tree_posts WHERE id = ?;", [id]);
  },

  async toggleTreePostLike(id: string): Promise<TreePost | null> {
    const db = await getDb();
    // 一句 UPDATE 完成 toggle：is_liked 取反，likes 在已赞时减 1（不低于 0）、否则加 1
    await db.runAsync(
      `UPDATE tree_posts
          SET is_liked = CASE WHEN is_liked = 1 THEN 0 ELSE 1 END,
              likes    = CASE
                           WHEN is_liked = 1 THEN MAX(likes - 1, 0)
                           ELSE likes + 1
                         END
        WHERE id = ?;`,
      [id],
    );
    const row = await db.getFirstAsync<TreePostRow>(
      `SELECT ${TREE_POST_COLUMNS} FROM tree_posts WHERE id = ?;`,
      [id],
    );
    return row ? rowToTreePost(row) : null;
  },

  async listAgents(): Promise<Agent[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<AgentRow>(
      `SELECT ${AGENT_COLUMNS}
         FROM agents
         ORDER BY created_at DESC;`,
    );
    return rows.map(rowToAgent);
  },

  async createAgent(input: {
    name: string;
    intro: string;
    hue?: string;
    isPrivate?: boolean;
  }): Promise<Agent> {
    const db = await getDb();
    const id = makeId("ag");
    const now = Date.now();
    const hue = input.hue ?? pickAgentHue(input.name);
    const isPrivate = input.isPrivate ?? false;
    await db.runAsync(
      `INSERT INTO agents (id, name, intro, hue, is_private, created_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [id, input.name, input.intro, hue, isPrivate ? 1 : 0, now],
    );
    return {
      id,
      name: input.name,
      intro: input.intro,
      hue,
      isPrivate,
      createdAt: now,
    };
  },

  async deleteAgent(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM agents WHERE id = ?;", [id]);
  },
};

function clampIntensity(n: number): number {
  if (!Number.isFinite(n)) return 3;
  if (n < 1) return 1;
  if (n > 5) return 5;
  return Math.round(n);
}

const AGENT_HUE_PALETTE = [
  "#F4B79E",
  "#A89FE0",
  "#F5C56B",
  "#82AB7E",
  "#7CA3D6",
  "#E69CA9",
];

function pickAgentHue(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return AGENT_HUE_PALETTE[Math.abs(h) % AGENT_HUE_PALETTE.length];
}
