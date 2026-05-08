# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Aimi (艾米) is an Expo / React Native app — a Chinese-language emotion-journaling AI companion for young users. It is **not** a medical product; all relevant pages must carry a gentle disclaimer. UI copy is intentionally Chinese — preserve it when editing.

## Commands

```bash
npm install
npm start              # expo start (interactive)
npm run android        # expo start --android
npm run ios            # expo start --ios
npm run web            # expo start --web
npm run lint           # expo lint (eslint flat config + eslint-config-expo)
npm run typecheck      # tsc --noEmit (strict mode is on)
```

No test runner is configured.

The legacy `scripts/reset-project.js` (which wipes `app/`, `components/`, `hooks/`, `constants/`) has been moved to `_disabled/scripts/reset-project.js` and removed from `package.json`. Do not run it.

## Architecture

### Routing — expo-router file-based, typed routes ON

`expo-router/entry` is the app entry (see `package.json#main`). `app.json` has `experiments.typedRoutes: true`, `experiments.reactCompiler: true`, `newArchEnabled: true`. Scheme is `aimi`.

Adding a new route file under `app/` will trigger Expo CLI to regenerate `.expo/types/router.d.ts` on next `expo start`. If `tsc` complains about a new pathname, run `expo start` once to refresh that file. **Never put non-route files (UI components) inside `app/`** — Expo will treat them as routes (e.g. `app/ui/Screen.tsx` would generate a `/ui/Screen` route). Components live in `components/`.

Route layout:

- `app/_layout.tsx` — root `Stack` wrapped in `GestureHandlerRootView` + `SafeAreaProvider`, headers hidden globally. The `GestureHandlerRootView` is required so any `<GestureDetector>` in the tree (e.g. history's left-swipe) actually receives gestures.
- `app/index.tsx` — entry redirect: `<Redirect href="/chat" />`. There is no welcome / onboarding screen; users land directly in chat.
- `app/chat.tsx` — Chat screen. Header: `[reorder-two] Aimi [create]`. Left icon (two short bars) navigates to `/(tabs)/history`. Right icon resets to a fresh chat (`router.replace("/chat")`). Reads optional `recordId` via `useLocalSearchParams` and loads that session via `storage.getSession()`. Three states share the same input box: empty (no messages → big centered `BreathingOrb`), chatting (messages persisted via `storage.appendMessage`, mock AI replies from `MOCK_AI_REPLIES`), history (loaded session + can keep typing — appended messages persist back into the same session). On first send of a fresh chat, lazily creates a session whose title is the first user message trimmed to 12 chars + `…` (fallback `今天的对话`). Keyboard show/hide listeners drive a reanimated `translateY` on the orb.
- `app/(tabs)/_layout.tsx` — Bottom tab bar (`history`, `weekly`, `treehole`, `profile`); `initialRouteName="history"`. Tab bar is `position: 'absolute'` with translucent background, so screens render under it — leave bottom padding when adding scrollable content.
- `app/(tabs)/history.tsx` — "对话" tab; cards push `/chat` with `{ recordId }` (chat then loads title/date from storage). Sessions list is read on focus via `storage.listSessions()`. A `react-native-gesture-handler` `Pan` detects a right-to-left swipe (translationX < -60 with leftward velocity, vertical motion ≥12px cancels) and pushes `/chat`.

`chat.tsx` lives outside the `(tabs)` group, so the tab bar correctly does not appear on it.

TS path alias: `@/*` → repo root (see `tsconfig.json`). Prefer `@/components/...`, `@/constants/theme`, `@/storage` over relative paths in new code.

### Directory layout

```
app/                       routes only
  _layout.tsx, index.tsx, chat.tsx
  (tabs)/_layout.tsx, history.tsx, weekly.tsx, treehole.tsx, profile.tsx
components/
  aimi/                    Aimi-brand visuals (BreathingOrb)
  common/                  cross-screen shells (Screen, AppHeader, IconButton, PrimaryPill)
  chat/                    MessageList, ChatInput
  history/                 SessionActionSheet, RenameDialog
  treehole/                CategoryTabs, DiscoveryGrid
  profile/                 ProfileHeader, SegmentedTabs, WorksGrid, AgentList
constants/
  theme.ts                 single source of design tokens
types/
  models.ts                ChatRole, AiSource, ChatMessage, ChatSession, Setting
mocks/
  index.ts                 central mock data; SEED_SESSIONS feeds the first-launch seeder
services/
  ai.ts                    proxy/mock dispatcher; only AI entry point for screens
  safety.ts                client-side mirror of crisis/high classifier (offline fallback)
storage/
  index.ts                 public async API; UI imports only from here
  database.ts              expo-sqlite singleton, migrations, seeder
server/                    Node proxy (excluded from Expo lint/tsc); see server/README.md
_disabled/                 quarantined files; do not delete or execute
```

### Theme — single source of truth

All design tokens live in `constants/theme.ts`: `colors` (Aimi warm palette), `radius`, `spacing`, `typography`, `shadow`. Import as `import { theme } from "@/constants/theme"`. Do **not** create a second theme file or a parallel light/dark `Colors` palette.

All app screens already route their colors through `theme.colors`. When you need a new color, extend `theme.colors` instead of inlining a hex literal. Inline `rgba(...)` is fine for one-off translucent overlays (e.g. cover-photo shading), since those don't belong in the shared palette.

### Screen pattern

```tsx
<Screen backgroundColor={theme.colors.bg}>
  <AppHeader title="…" left={<IconButton …/>} right={<IconButton …/>} />
  …
</Screen>
```

`Screen` wraps `SafeAreaView` (top/left/right edges only — bottom is owned by the tab bar). Pass `withHorizontalPadding` if you want `theme.spacing.xl` gutters. Icons come from `@expo/vector-icons` (`Ionicons`).

### Storage

`storage/index.ts` is the public async interface for local persistence — UI code should *only* import from `@/storage`, never from `expo-sqlite` directly. It is backed by `storage/database.ts`, which owns a single `expo-sqlite` connection (`aimi.db`), runs `PRAGMA user_version` migrations, and seeds `SEED_SESSIONS` on first launch (gated by `settings.seeded='1'`).

Public methods on `storage`:

- `listSessions()` — chat sessions ordered by `updated_at DESC`
- `getSession(id)` — `{ session, messages }` or `null`
- `createSession(title)` — returns the new `ChatSession`
- `appendMessage(sessionId, role, text)` — also bumps `updated_at` and `last_preview` on the session
- `deleteSession(id)` — cascades to messages
- `wipeAll()` — `DELETE` from every data table and from `settings`, then re-inserts `settings.seeded='1'` so the seeder will not run again. Tables themselves are preserved.
- `getSetting(key)` / `setSetting(key, value)`

Tables: `chat_sessions`, `chat_messages`, `mood_records`, `tree_posts`, `agents`, `settings`. Stage 3 only reads/writes the chat tables; the rest are reserved for stages 4–5.

### Mocks

`mocks/index.ts` is the single source of stub data while later stages do not yet have real backends. `SEED_SESSIONS` is consumed *only* by the database seeder on first launch. The other arrays — `MOCK_AI_REPLIES`, `MOCK_TREEHOLE_POSTS`, `TREEHOLE_CATEGORIES`, `MOCK_PROFILE`, `MOCK_WORKS`, `MOCK_FAVORITES`, `MOCK_AGENTS` — are read directly by their respective screens and will be migrated into SQLite when those screens get rebuilt in later stages. UI screens must not import `SEED_SESSIONS` directly; they go through `storage`. `MOCK_AI_REPLIES` is now also the **AI fallback** when the proxy backend is unreachable — see "AI integration" below.

### AI integration

Aimi never calls Gemini directly from the device. The Expo app talks to a small Node proxy (`server/`); the proxy holds the Gemini API key, runs safety classification, and forwards normal/medium messages to Gemini. The mobile bundle never sees the key.

Components:

- `server/` — TypeScript + Express + tsx. Endpoints `GET /api/health`, `POST /api/chat`. Reads `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`, `ALLOWED_ORIGINS` from `server/.env` (gitignored). The model name is **always read from env**; never hardcoded in source. Default model in `.env.example` is `gemini-2.5-flash` — change `.env` to swap models without touching code.
- `services/ai.ts` — only AI entry point for the app. `replyTo(history) → { text, source, level }`. Order: client safety mirror → no proxy / forced mock → POST to proxy → mock fallback on any error. Never throws.
- `services/safety.ts` — client-side mirror of the `crisis` and `high` levels. If the user types a self-harm phrase and the backend is unreachable, the app still returns a safety template instead of a random mock line. Templates and patterns must stay in sync with `server/src/safety.ts`.
- `app/chat.tsx` — calls `replyTo([...messages, userMsg])`, persists the AI message via `storage.appendMessage(sid, "ai", text, source)`. Shows three pulsing dots in `<MessageList thinking>` while waiting; disables `<ChatInput>` so users can't double-send.
- `MessageList` — when an AI message has `source === "mock"`, renders a tiny "本地回复" gray label in the bubble corner. `safety` and `gemini` replies show no badge.

Safety levels (server-side classifier is authoritative):

| Level | Trigger examples | Server behavior |
|---|---|---|
| `crisis` | "我现在就要…", "我马上要自杀" | Fixed crisis template (with hotlines + 120). Gemini never called. |
| `high` | "不想活", "想死", "想消失" | Fixed high-risk template (with 400-161-9995). Gemini never called. |
| `medium` | "撑不住", "一直睡不好" | Gemini with `SYSTEM_PROMPT_GENTLE` (more careful tone). |
| `normal` | everything else | Gemini with `SYSTEM_PROMPT_NORMAL`. |

Environment variables:

- Frontend (`.env` at project root): only `EXPO_PUBLIC_AI_PROXY_URL` (your LAN-IP backend) and `EXPO_PUBLIC_AI_PROVIDER` (`proxy` or `mock`). `EXPO_PUBLIC_*` is bundled into the client and is therefore **public** — never put a Gemini key here.
- Backend (`server/.env`): `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`, `ALLOWED_ORIGINS`.

Both `.env` files are gitignored. `*.example` files are committed and contain only placeholders.

Local dev: `cd server && npm run dev` listens on `0.0.0.0:8787`. Find your Windows LAN IPv4 with `ipconfig | Select-String "IPv4"`, set `EXPO_PUBLIC_AI_PROXY_URL=http://<that-ip>:8787` in the root `.env`, run `npx expo start --clear`. `EXPO_PUBLIC_*` are compile-time constants — restarting Expo with `--clear` is required after changing them.
