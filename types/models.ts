export type ChatRole = "user" | "ai";

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatRole;
  text: string;
  createdAt: number;
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
