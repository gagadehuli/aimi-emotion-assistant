export type ClientRole = "user" | "ai";

export type ClientMessage = {
  role: ClientRole;
  text: string;
};

export type SafetyLevel = "normal" | "medium" | "high" | "crisis";

export type ReplySource = "gemini" | "safety";

export type ChatRequestBody = {
  messages: ClientMessage[];
};

export type ChatResponseOk = {
  ok: true;
  text: string;
  source: ReplySource;
  level: SafetyLevel;
};

export type ChatResponseFail = {
  ok: false;
  reason: string;
};

export type ChatResponse = ChatResponseOk | ChatResponseFail;
