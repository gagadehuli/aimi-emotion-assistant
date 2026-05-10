export type ChatRole = "user" | "ai";

// AI 回复来源：gemini = 真实 AI；safety = 安全模板；mock = 离线/降级随机回复
export type AiSource = "gemini" | "safety" | "mock";

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatRole;
  text: string;
  createdAt: number;
  source: AiSource | null;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastPreview: string;
  pinnedAt: number | null;
};

export type Setting = {
  key: string;
  value: string;
};

export type Mood = "calm" | "happy" | "tired" | "anxious" | "sad";

export type MoodRecord = {
  id: string;
  sessionId: string | null;
  mood: Mood;
  intensity: number;
  note: string | null;
  createdAt: number;
};

export type TreePost = {
  id: string;
  category: string;
  title: string;
  content: string;
  authorAlias: string | null;
  likes: number;
  liked: boolean;
  createdAt: number;
};

export type Agent = {
  id: string;
  name: string;
  intro: string;
  hue: string;
  isPrivate: boolean;
  createdAt: number;
};
