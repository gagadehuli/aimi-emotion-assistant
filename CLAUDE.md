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
- `app/(tabs)/weekly.tsx` — "周报" tab. On focus reads `storage.listMoodRecordsForWeek()` and the week's chat messages, then aggregates: per-day buckets coloured by each day's dominant mood, the dominant mood across the week (drives both the description and the local Aimi suggestion template), and top keywords from a curated list (`KEYWORDS` in the file) counted against user messages. **No live AI call** — suggestions are local templates so opening the tab is free. Empty state ("这周还没有情绪记录") has a "去聊天" button that `router.replace("/chat")`.
- `app/(tabs)/treehole.tsx` — "树洞" tab. Reads `storage.listTreePosts({category?})` on focus and on category change. The "开始创作" pill opens `<CreatePostDialog>` (title + content + horizontal category chip from `TREEHOLE_POST_CATEGORIES`); on submit calls `storage.createTreePost`, switches active category to the new post's category, and refetches. Each card supports tap-to-like (`storage.incrementTreePostLike`) and long-press-to-delete (Alert two-step → `storage.deleteTreePost`). Card hue is derived from the post's category (`CATEGORY_HUES` in `DiscoveryGrid`) so SQLite never has to store visual fields.
- `app/(tabs)/profile.tsx` — "我的" tab. Settings gear in `ProfileHeader` now `router.push("/settings")` (the inline two-stage clear-data Alert moved into the settings page). The 智能体 tab reads from `storage.listAgents()` on focus; "+ 创建AI智能体" pill opens `<CreateAgentDialog>` (name + intro) which calls `storage.createAgent` and refreshes. Works/Favorites tabs still read from `mocks/MOCK_WORKS` / `MOCK_FAVORITES` — they will be migrated when works/favorites screens get rebuilt.
- `app/settings.tsx` — Top-level Stack route reachable from the profile gear. Renders `AppHeader` with a back button and three sections: 本地数据 (清除本地数据 → two-step `Alert` → `storage.wipeAll()` → `router.replace("/chat")`), AI (current model + current mode read from `EXPO_PUBLIC_AI_PROVIDER` / `EXPO_PUBLIC_AI_PROXY_URL`), 关于 (Aimi about info, disclaimer placeholder, version from `expo-constants`).

`chat.tsx` lives outside the `(tabs)` group, so the tab bar correctly does not appear on it.

TS path alias: `@/*` → repo root (see `tsconfig.json`). Prefer `@/components/...`, `@/constants/theme`, `@/storage` over relative paths in new code.

### Directory layout

```
app/                       routes only
  _layout.tsx, index.tsx, chat.tsx, settings.tsx
  (tabs)/_layout.tsx, history.tsx, weekly.tsx, treehole.tsx, profile.tsx
components/
  aimi/                    Aimi-brand visuals (BreathingOrb)
  common/                  cross-screen shells (Screen, AppHeader, IconButton, PrimaryPill)
  chat/                    MessageList, ChatInput, MoodQuickRecord
  history/                 SessionActionSheet, RenameDialog
  treehole/                CategoryTabs, DiscoveryGrid, CreatePostDialog
  profile/                 ProfileHeader, SegmentedTabs, WorksGrid, AgentList, CreateAgentDialog
constants/
  theme.ts                 single source of design tokens
types/
  models.ts                ChatRole, AiSource, ChatMessage, ChatSession, Setting, Mood, MoodRecord, TreePost, Agent
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

- `listSessions()` — chat sessions ordered by pinned then `updated_at DESC`
- `getSession(id)` — `{ session, messages }` or `null`
- `createSession(title)` — returns the new `ChatSession`
- `appendMessage(sessionId, role, text, source?)` — also bumps `updated_at` and `last_preview` on the session
- `renameSession(id, title)` / `setPinned(id, pinned)` / `deleteSession(id)`
- `createMoodRecord({sessionId?, mood, intensity?, note?})` / `listMoodRecords({since?, until?})` / `listMoodRecordsForWeek(now?)` / `hasMoodRecordToday(now?)` / `deleteMoodRecord(id)`
- `listTreePosts({category?})` / `createTreePost({category, title, content, authorAlias?})` / `deleteTreePost(id)` / `toggleTreePostLike(id)` — toggles `is_liked` on the row and adjusts `likes` ±1 in a single UPDATE; returns the updated post or `null`
- `listAgents()` / `createAgent({name, intro, hue?, isPrivate?})` / `deleteAgent(id)`
- `wipeAll()` — `DELETE` from every data table and from `settings`, then re-inserts `seeded='1'`, `tree_seeded='1'`, `agents_seeded='1'` so **none** of the three seeders will run again. Tables themselves are preserved.
- `getSetting(key)` / `setSetting(key, value)`
- `startOfThisWeek(now?)` / `endOfThisWeek(now?)` / `startOfToday(now?)` — exposed helpers; week boundaries are local-time Mon 00:00 → next Mon 00:00

Tables: `chat_sessions`, `chat_messages`, `mood_records`, `tree_posts`, `agents`, `settings`. Stages 3–4 use the chat tables; stage 5A activates `mood_records`; stage 5B activates `tree_posts` (with `likes` column from migration v5) and `agents` (created via `CreateAgentDialog`). Three first-launch seeders write `SEED_SESSIONS`, `SEED_TREE_POSTS`, and `SEED_AGENTS` from `mocks/index.ts`, each gated by its own `settings` flag (`seeded`, `tree_seeded`, `agents_seeded`).

### Mocks

`mocks/index.ts` is the single source of stub data while later stages do not yet have real backends.

- `SEED_SESSIONS`, `SEED_TREE_POSTS`, `SEED_AGENTS` are consumed *only* by the database seeders in `storage/database.ts` on first launch (each gated by its own `settings.*_seeded` flag).
- `MOCK_AI_REPLIES` is the AI fallback when the proxy backend is unreachable (see "AI integration" below).
- `TREEHOLE_CATEGORIES` (full list, including "发现" the all-filter) and `TREEHOLE_POST_CATEGORIES` (creation list, "发现" excluded) are read by `(tabs)/treehole.tsx` and `<CreatePostDialog>`.
- `MOCK_PROFILE`, `MOCK_WORKS`, `MOCK_FAVORITES` are still read directly by `(tabs)/profile.tsx` for the works/favorites grids; they will be migrated when those screens get rebuilt.

UI screens must not import `SEED_*` directly; they always go through `storage`.

### AI integration

Aimi never calls Gemini directly from the device. The Expo app talks to a small Node proxy (`server/`); the proxy holds the Gemini API key, runs safety classification, and forwards normal/medium messages to Gemini. The mobile bundle never sees the key.

Components:

- `server/` — TypeScript + Express + tsx. Endpoints `GET /api/health`, `POST /api/chat`. Reads `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`, `ALLOWED_ORIGINS` from `server/.env` (gitignored). The model name is **always read from env**; never hardcoded in source. Default model in `.env.example` is `gemini-2.5-flash` — change `.env` to swap models without touching code.
- `services/ai.ts` — only AI entry point for the app. `replyTo(history) → { text, source, level }`. Order: client safety mirror → no proxy / forced mock → POST to proxy → mock fallback on any error. Never throws.
- `services/safety.ts` — client-side mirror of the `crisis` and `high` levels. If the user types a self-harm phrase and the backend is unreachable, the app still returns a safety template instead of a random mock line. Templates and patterns must stay in sync with `server/src/safety.ts`.
- `app/chat.tsx` — calls `replyTo([...messages, userMsg])`, persists the AI message via `storage.appendMessage(sid, "ai", text, source)`. Shows three pulsing dots in `<MessageList thinking>` while waiting; disables `<ChatInput>` so users can't double-send.
- `MessageList` — when an AI message has `source === "mock"`, renders a tiny "本地回复" gray label in the bubble corner. `safety` and `gemini` replies show no badge. The thinking bubble shows "正在听你说" + 3 pulsing dots while waiting on `replyTo`. Bubbles support `onLongPressMessage`; `chat.tsx` wires that to `expo-clipboard` `setStringAsync` + `Alert.alert("已复制")`.
- `MoodQuickRecord` — small card rendered as MessageList footer **after** the user has at least one user→AI exchange in the current chat instance, **and** today's `mood_records` count is 0 (`storage.hasMoodRecordToday()`). Lets the user tap one of 5 mood chips (calm/happy/tired/anxious/sad). On tap calls `storage.createMoodRecord({sessionId, mood, intensity: 3, note: lastUserText.slice(0,30)})`, then collapses to "已记录到本周情绪". One recording per day — once the day already has a record, the card is suppressed in every fresh chat instance for the rest of that local day.

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
