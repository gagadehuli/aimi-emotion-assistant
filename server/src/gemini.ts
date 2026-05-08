import type { ClientMessage } from "./types";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiArgs = {
  apiKey: string;
  model: string;
  systemInstruction: string;
  messages: ClientMessage[];
  signal?: AbortSignal;
};

export async function callGemini(args: GeminiArgs): Promise<string> {
  const { apiKey, model, systemInstruction, messages, signal } = args;
  const url = `${ENDPOINT}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(
    apiKey,
  )}`;

  const contents = messages.map((m) => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.85,
      topP: 0.9,
      // 给 Aimi 留够把一段心情说完的空间。中文 1 字 ≈ 1 token，
      // 1024 ≈ 8 - 12 句中文，正常陪伴语境足够，且仍不至于让模型写长篇大论。
      maxOutputTokens: 1024,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`gemini ${res.status}: ${txt.slice(0, 240)}`);
  }

  const data: unknown = await res.json();
  const text = pickText(data);
  if (!text) throw new Error("gemini empty response");
  return text;
}

function pickText(data: unknown): string {
  if (!isRecord(data)) return "";
  const candidates = data["candidates"];
  if (!Array.isArray(candidates) || candidates.length === 0) return "";
  const first = candidates[0];
  if (!isRecord(first)) return "";
  const content = first["content"];
  if (!isRecord(content)) return "";
  const parts = content["parts"];
  if (!Array.isArray(parts) || parts.length === 0) return "";
  const part = parts[0];
  if (!isRecord(part)) return "";
  const t = part["text"];
  return typeof t === "string" ? t.trim() : "";
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
