import "dotenv/config";
import cors from "cors";
import express from "express";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import { callGemini } from "./gemini";

// 让 Node 内置 fetch 走系统已有的 HTTPS_PROXY / HTTP_PROXY。
// undici 默认不读这些环境变量，导致 fetch generativelanguage.googleapis.com 在被墙
// 网络下立刻失败。这里只在检测到代理变量时设置全局 dispatcher，其它代码完全不动。
const PROXY_URL =
  process.env.HTTPS_PROXY ??
  process.env.HTTP_PROXY ??
  process.env.https_proxy ??
  process.env.http_proxy;
if (PROXY_URL) {
  setGlobalDispatcher(new ProxyAgent(PROXY_URL));
  // eslint-disable-next-line no-console
  console.log(`[aimi-server] outbound via proxy ${PROXY_URL}`);
}
import { SYSTEM_PROMPT_GENTLE, SYSTEM_PROMPT_NORMAL } from "./prompts";
import { classify, safetyReply } from "./safety";
import type {
  ChatRequestBody,
  ChatResponse,
  ClientMessage,
} from "./types";

const PORT = Number(process.env.PORT ?? 8787);
const MODEL = (process.env.GEMINI_MODEL ?? "gemini-2.5-flash").trim();
const KEY = (process.env.GEMINI_API_KEY ?? "").trim();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "*").trim();
const TIMEOUT_MS = 12_000;
const HISTORY_LIMIT = 10;

const app = express();
app.use(
  cors({
    origin: ALLOWED_ORIGINS === "*" ? true : ALLOWED_ORIGINS.split(","),
  }),
);
app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: MODEL, hasKey: KEY.length > 0 });
});

app.post("/api/chat", async (req, res) => {
  const body = (req.body ?? {}) as Partial<ChatRequestBody>;
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages = rawMessages
    .filter(
      (m): m is ClientMessage =>
        m !== null &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "ai") &&
        typeof m.text === "string" &&
        m.text.length > 0,
    )
    .slice(-HISTORY_LIMIT);

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    const fail: ChatResponse = { ok: false, reason: "no user message" };
    res.status(400).json(fail);
    return;
  }

  const level = classify(lastUser.text);

  if (level === "crisis" || level === "high") {
    const ok: ChatResponse = {
      ok: true,
      text: safetyReply(level),
      source: "safety",
      level,
    };
    res.json(ok);
    return;
  }

  if (KEY.length === 0) {
    const fail: ChatResponse = {
      ok: false,
      reason: "missing GEMINI_API_KEY",
    };
    res.status(503).json(fail);
    return;
  }

  const systemInstruction =
    level === "medium" ? SYSTEM_PROMPT_GENTLE : SYSTEM_PROMPT_NORMAL;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const text = await callGemini({
      apiKey: KEY,
      model: MODEL,
      systemInstruction,
      messages,
      signal: ctrl.signal,
    });
    const ok: ChatResponse = { ok: true, text, source: "gemini", level };
    res.json(ok);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown";
    const fail: ChatResponse = { ok: false, reason };
    res.status(502).json(fail);
  } finally {
    clearTimeout(timer);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(
    `[aimi-server] listening on http://0.0.0.0:${PORT} (model=${MODEL}, hasKey=${KEY.length > 0})`,
  );
});
