import { MOCK_AI_REPLIES } from "@/mocks";
import type { AiSource, ChatMessage } from "@/types/models";
import { clientSafetyCheck } from "./safety";

export type AiLevel = "normal" | "medium" | "high" | "crisis";

export type AiReply = {
  text: string;
  source: AiSource;
  level: AiLevel;
};

const PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL ?? "";
const PROVIDER = (process.env.EXPO_PUBLIC_AI_PROVIDER ?? "mock").toLowerCase();
const TIMEOUT_MS = 12_000;
const HISTORY_LIMIT = 10;

function pickMock(): string {
  return MOCK_AI_REPLIES[Math.floor(Math.random() * MOCK_AI_REPLIES.length)];
}

function mockReply(): AiReply {
  return { text: pickMock(), source: "mock", level: "normal" };
}

function isAiLevel(v: unknown): v is AiLevel {
  return v === "normal" || v === "medium" || v === "high" || v === "crisis";
}

export async function replyTo(history: ChatMessage[]): Promise<AiReply> {
  // 1. 客户端 safety 镜像：高风险 / 危机表达离线也要给安全模板，绝不让 mock 顶替。
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (lastUser) {
    const hit = clientSafetyCheck(lastUser.text);
    if (hit) {
      return { text: hit.text, source: "safety", level: hit.level };
    }
  }

  // 2. proxy 没配置或强制 mock。
  if (!PROXY_URL || PROVIDER !== "proxy") {
    return mockReply();
  }

  // 3. 调后端代理。任何异常都退到 mock。
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const url = `${PROXY_URL.replace(/\/$/, "")}/api/chat`;
    const payload = {
      messages: history.slice(-HISTORY_LIMIT).map((m) => ({
        role: m.role,
        text: m.text,
      })),
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      return mockReply();
    }
    const data: unknown = await res.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "ok" in data &&
      (data as { ok: unknown }).ok === true
    ) {
      const obj = data as Record<string, unknown>;
      const text = typeof obj.text === "string" ? obj.text.trim() : "";
      if (text.length === 0) return mockReply();
      const source: AiSource = obj.source === "safety" ? "safety" : "gemini";
      const level: AiLevel = isAiLevel(obj.level) ? obj.level : "normal";
      return { text, source, level };
    }
    return mockReply();
  } catch {
    return mockReply();
  } finally {
    clearTimeout(timer);
  }
}
