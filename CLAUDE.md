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

- `app/_layout.tsx` — root `Stack` wrapped in `SafeAreaProvider`, headers hidden globally.
- `app/index.tsx` — first-launch dispatcher: reads `storage.getOnboardingSeen()` then `router.replace('/chat' | '/onboarding')`. Renders an `ActivityIndicator` while deciding.
- `app/onboarding.tsx` — Welcome page. `BreathingOrb` + brand + "开始" button → sets onboarding flag → `/chat`.
- `app/chat.tsx` — Chat screen. Header: `[search] Aimi [create]`. Search currently navigates to `/(tabs)/history` (Stage 2 placeholder until real search lands). Create resets to a fresh chat. Reads `recordId` / `date` / `title` via `useLocalSearchParams` to switch between live-chat mode and read-only history-replay mode. Real send / AI / persistence land in later stages.
- `app/(tabs)/_layout.tsx` — Bottom tab bar (`history`, `weekly`, `treehole`, `profile`); `initialRouteName="history"`. Tab bar is positioned absolute with translucent background, so screens render under it — leave bottom padding when adding scrollable content.
- `app/(tabs)/history.tsx` — "对话" tab; cards push `/chat` with `{ recordId, date, title }` params.

`chat.tsx` and `onboarding.tsx` live outside the `(tabs)` group, so the tab bar correctly does not appear on those screens.

TS path alias: `@/*` → repo root (see `tsconfig.json`). Prefer `@/components/...`, `@/constants/theme`, `@/storage` over relative paths in new code.

### Directory layout

```
app/                       routes only
  _layout.tsx, index.tsx, onboarding.tsx, chat.tsx
  (tabs)/_layout.tsx, history.tsx, weekly.tsx, treehole.tsx, profile.tsx
components/
  aimi/                    Aimi-brand visuals (BreathingOrb)
  common/                  cross-screen shells (Screen, AppHeader, IconButton)
  chat/                    (planned) MessageList / Bubble / Input
constants/
  theme.ts                 single source of design tokens
storage/
  index.ts                 storage interface (currently AsyncStorage-backed; SQLite in stage 3)
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

`storage/index.ts` exposes a small async interface (currently `getOnboardingSeen` / `setOnboardingSeen`). Implementation is `@react-native-async-storage/async-storage` for now. Stage 3 will replace the implementation with `expo-sqlite` while keeping the same interface — call sites should never touch AsyncStorage directly.
