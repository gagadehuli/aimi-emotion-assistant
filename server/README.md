# aimi-server

Local AI proxy for the Aimi Expo app. Holds the Gemini API key on the server side
so the mobile bundle never touches it.

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env, paste your real GEMINI_API_KEY
npm run dev          # tsx watch, listens on 0.0.0.0:8787
```

`server/.env` is gitignored. Never commit it.

## Endpoints

- `GET /api/health` — `{ ok, model, hasKey }`
- `POST /api/chat` — body `{ messages: { role: "user"|"ai", text: string }[] }`
  - Server classifies safety on the last user message:
    - `crisis` / `high` → returns a fixed safety template, **does not** call Gemini
    - `medium` → calls Gemini with a gentler system prompt
    - `normal` → calls Gemini with the standard system prompt
  - Success: `{ ok: true, text, source: "gemini"|"safety", level }`
  - Upstream error: `{ ok: false, reason }` with HTTP 502/503

## Where to point the Expo app

In the project root `.env`:

```
EXPO_PUBLIC_AI_PROXY_URL=http://<your-lan-ip>:8787
EXPO_PUBLIC_AI_PROVIDER=proxy
```

Find your Windows LAN IPv4:

```powershell
ipconfig | Select-String "IPv4"
```

Pick the `192.168.x.x` (or `10.x.x.x`) entry that's on the same WiFi as your phone.
You cannot use `127.0.0.1` — that means the phone itself.

After editing `.env`, restart Expo with `npx expo start --clear`.

## Notes

- Gemini's REST endpoint is blocked from inside mainland China; run the server on a
  network that can reach `generativelanguage.googleapis.com`.
- The model name is read from `GEMINI_MODEL` at startup. Change it in `.env` to swap
  models — never hardcode a model name in the source.
