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
- `app/chat.tsx` — Chat screen. Header: `[reorder-two] Aimi [create]`. Left icon (two short bars) navigates to `/(tabs)/history`. Right icon resets to a fresh chat. Reads `recordId` / `date` / `title` via `useLocalSearchParams` to seed an existing session. Three states share the same input box: empty (no messages → big centered `BreathingOrb`), chatting (messages + mock AI replies from `mocks/MOCK_AI_REPLIES`), history (seeded from `mocks/MOCK_CHAT_SESSIONS` + can keep typing). Keyboard show/hide listeners drive a reanimated `translateY` on the orb.
- `app/(tabs)/_layout.tsx` — Bottom tab bar (`history`, `weekly`, `treehole`, `profile`); `initialRouteName="history"`. Tab bar is `position: 'absolute'` with translucent background, so screens render under it — leave bottom padding when adding scrollable content.
- `app/(tabs)/history.tsx` — "对话" tab; cards push `/chat` with `{ recordId, date, title }` params. A `react-native-gesture-handler` `Pan` detects a right-to-left swipe (translationX < -60 with leftward velocity, vertical motion ≥12px cancels) and pushes `/chat`.

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
  treehole/                CategoryTabs, DiscoveryGrid
  profile/                 ProfileHeader, SegmentedTabs, WorksGrid, AgentList
constants/
  theme.ts                 single source of design tokens
mocks/
  index.ts                 central mock data (chat sessions / treehole posts / profile / works / agents)
storage/
  index.ts                 placeholder stub; stage 3 will fill in expo-sqlite-backed methods
_disabled/                 quarantined files; do not delete or execute
```

### Theme — single source of truth

All design tokens live in `constants/theme.ts`: `colors` (Aimi warm palette), `radius`, `spacing`, `typography`, `shadow`. Import as `import { theme } from "@/constants/theme"`. Do **not** create a second theme file or a parallel light/dark `Colors` palette.

Color values are still hard-coded inline in many older screens (e.g. `#FFA07A`, `#9B8276` in `app/chat.tsx`). When refactoring, prefer pulling from `theme.colors` if a matching token exists; otherwise extend `theme.colors` rather than scattering hex codes.

### Screen pattern

```tsx
<Screen backgroundColor={theme.colors.bg}>
  <AppHeader title="…" left={<IconButton …/>} right={<IconButton …/>} />
  …
</Screen>
```

`Screen` wraps `SafeAreaView` (top/left/right edges only — bottom is owned by the tab bar). Pass `withHorizontalPadding` if you want `theme.spacing.xl` gutters. Icons come from `@expo/vector-icons` (`Ionicons`).

### Storage

`storage/index.ts` is currently an empty placeholder (`export {}`). Stage 3 will populate it with `expo-sqlite`-backed methods (chats / messages / mood records / tree posts / settings) and that is the only file UI code should ever touch for persistence. `@react-native-async-storage/async-storage` is still in `package.json` from the earlier onboarding-flag implementation; nothing imports it currently and it can be removed in stage 3 cleanup.

### Mocks

`mocks/index.ts` is the single source of stub data while stage 2 does not have a real database. Anywhere that will eventually read from SQLite — chat sessions / treehole posts / profile works / agents / favorites — currently imports its arrays from here. Keep new mock data centralized in this file so stage 3 can swap it for SQLite reads without spelunking through screens.
