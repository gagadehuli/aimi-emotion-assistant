# Aimi · 艾米

> 一个温和的中文 AI 情绪陪伴助手。陪你说说话，也帮你记住每一种心情。

![Expo](https://img.shields.io/badge/Expo-SDK%2054-000?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-personal--portfolio-lightgrey)

## TL;DR

Aimi 是一个面向中文年轻用户的 AI 情绪陪伴 App，从产品决策、UI、本地数据、
AI 接入到安全分级**全部独立完成**。

- **前端**：Expo SDK 54 + React Native + TypeScript（严格模式）+ expo-router
- **本地数据**：expo-sqlite 6 张表，schema 增量迁移到 v6
- **AI**：自建 Node 后端代理 Gemini，4 级安全分级，断网走 mock 兜底
- **6 个阶段、6 个 git 里程碑 commit、零云端依赖、零账号系统**

> ⚠️ **Aimi 不是医疗服务**。它不能替代心理咨询、医生诊断或紧急救助。详见
> App 内「设置 → 免责声明」或 `app/disclaimer.tsx`。

---

## 一句话介绍

中文 AI 情绪陪伴 App，本地 SQLite 持久化，自建 Node 代理保护 Gemini Key，
四级安全分级避免直接把高风险话题丢给大模型。

## 项目背景

我希望 Aimi 不止是一个聊天工具，而是能记录、陪伴、整理情绪的助手。它面向
中文年轻用户，语气温和、不说教、不诊断。同时它也是我面向前端实习与产品向
岗位的作品集项目，重点演示的是端到端独立完成能力：产品决策 → UI → 本地数据
→ AI 接入 → 安全策略 → 上架前置准备。

## 核心功能

| 功能 | 说明 |
|---|---|
| **Chat** | 三态：空态大呼吸光球 / 正常聊天 / 历史会话续聊；Gemini 真实回复；mock fallback；长按气泡复制 |
| **Mood 记录** | 每日一次，AI 回复后浮现 5 个 emoji，写入 `mood_records` |
| **History** | 会话列表，支持长按重命名 / 置顶 / 删除，左滑回 Chat |
| **Weekly 周报** | 从本地 `mood_records` 实时聚合：每日柱状图 + 主导情绪 + 关键词 + Aimi 建议（本地模板，不消耗 API 配额） |
| **Tree Hole 树洞** | 本地内容流，9 类分类，支持创作 / 点赞 toggle / 长按删除 |
| **Profile** | 个人主页 + 作品 / 智能体 / 收藏 三栏，支持自建 AI 智能体 |
| **Settings** | 清除本地数据（二段确认）/ 当前模型 / 当前模式 / 隐私政策 / 免责声明 |

## 安全策略

Aimi 把每条用户消息按 4 级处理：

| 等级 | 触发示例 | 处理 |
|---|---|---|
| `crisis` | "我现在就要…" | 固定危机模板（含 120 + 援助热线），**不调** Gemini |
| `high` | "不想活"、"想消失" | 固定高风险模板，**不调** Gemini |
| `medium` | "撑不住"、"一直睡不好" | Gemini + 更柔和的 system prompt |
| `normal` | 其它 | Gemini + 标准 system prompt |

`crisis` / `high` 同时在客户端镜像一遍，确保断网或后端不可达时仍能给出
安全模板而不是随机 mock 回复。

## 技术栈

**前端**

- Expo SDK 54 / React Native 0.81 / 新架构
- TypeScript strict
- expo-router v6（file-based + typed routes）
- expo-sqlite v16（本地持久化，6 张表，schema v6 增量迁移）
- react-native-reanimated v4（呼吸光球、思考点、键盘联动）
- react-native-gesture-handler（history 左滑、卡片长按）
- expo-clipboard（长按复制）

**后端 `server/`**

- Node + Express + tsx（无 build step）
- undici `setGlobalDispatcher(ProxyAgent)`，让 fetch 走系统 `HTTPS_PROXY`
- Google Gemini REST API（不依赖 SDK，零额外锁定）
- `GEMINI_MODEL` 从 `.env` 读取，换模型不动代码

**工程**

- ESLint flat config + `eslint-config-expo`
- TS 严格模式 + 路径别名 `@/*`
- `.env` / `server/.env` 双层 gitignore，永不进版本库
- Windows 一键启动脚本 `start-aimi.bat`：自动探测 LAN IP → 同步 `.env` →
  起 server → 起 Metro

## 项目架构

```
┌─────────────────────────────────────────────────────┐
│ Expo App (手机端)                                   │
│                                                     │
│  app/             routes (expo-router)              │
│   ├─ chat.tsx                                       │
│   ├─ settings.tsx / privacy.tsx / disclaimer.tsx    │
│   └─ (tabs)/  history / weekly / treehole / profile │
│                                                     │
│  components/      UI (aimi/common/chat/...)         │
│  services/        ai.ts (proxy / mock / safety)     │
│  storage/         index.ts → expo-sqlite            │
│  types/models.ts  ChatMessage / MoodRecord / ...    │
└──────────────┬──────────────────────────────────────┘
               │ HTTP /api/chat
               ▼
┌─────────────────────────────────────────────────────┐
│ aimi-server (你的电脑或 VPS)                        │
│                                                     │
│  src/                                               │
│   ├─ index.ts     express + safety dispatch         │
│   ├─ safety.ts    crisis/high/medium/normal         │
│   ├─ prompts.ts   NORMAL + GENTLE system prompts    │
│   └─ gemini.ts    raw fetch + ProxyAgent            │
│                                                     │
│  server/.env      GEMINI_API_KEY (永不进 git)        │
└──────────────┬──────────────────────────────────────┘
               │ HTTPS
               ▼
        Google Gemini API
```

## 截图

> 截图放在 `assets/screenshots/`，下次提交一并更新到这里。

| 页面 | 截图 |
|---|---|
| Chat（空态 + 真 AI 回复 + mood 记录） | _待补 `01-chat.png`_ |
| History（长按操作菜单 + 左滑回聊） | _待补 `02-history.png`_ |
| Weekly（柱状图 + 关键词 + 建议） | _待补 `03-weekly.png`_ |
| Tree Hole（分类切换 + 红心 toggle） | _待补 `04-treehole.png`_ |
| Profile + Settings | _待补 `05-profile.png` / `06-settings.png`_ |

## Demo 视频

> 30 秒到 1 分钟的演示视频链接放在这里。

_待补：B 站 / YouTube 不公开链接_

## 本地启动

### 前置

- Windows / macOS，Node 18+
- 手机装 Expo Go（同一 WiFi）
- 大陆开发：电脑跑着 VPN 或代理客户端，让后端能访问 Gemini

### 一键（Windows 推荐）

双击项目根的 `start-aimi.bat`。它会：

1. 探测当前 LAN IPv4
2. 把 IP 写进 `.env` 的 `EXPO_PUBLIC_AI_PROXY_URL`
3. 在两个新 cmd 窗口里启动 `aimi-server` 和 Expo Metro（`--clear`）

第一次运行前先把 `server/.env` 配好：

```bash
cd server
cp .env.example .env       # macOS / git-bash
# 或 Windows:  copy .env.example .env
notepad .env               # 把 GEMINI_API_KEY 填进去
```

### 手动

```bash
# 后端
cd server
cp .env.example .env       # 填 GEMINI_API_KEY
npm install
npm run dev                # 0.0.0.0:8787

# 前端（另开一个终端）
cp .env.example .env       # 填 LAN IP
npm install
npx expo start --clear
```

手机扫 Metro 输出的 QR 进 Expo Go。

### .env 配置

**根目录 `.env`**（前端，**永远不要在这里写 API Key**）：

```
EXPO_PUBLIC_AI_PROXY_URL=http://192.168.x.x:8787
EXPO_PUBLIC_AI_PROVIDER=proxy   # mock 走本地随机回复
```

**`server/.env`**（后端，gitignored）：

```
GEMINI_API_KEY=your-real-key-from-aistudio.google.com
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
ALLOWED_ORIGINS=*
```

`EXPO_PUBLIC_*` 是编译时常量，每次改 `.env` 后必须 `npx expo start --clear`。

## 已完成功能

- ✅ 路由 + 视觉骨架（4 个底部 tab + chat / settings / privacy / disclaimer）
- ✅ 本地 SQLite 持久化（6 张表 + schema v6 + 三类首启种子）
- ✅ Gemini 后端代理 + 4 级 safety + mock fallback + undici 系统代理支持
- ✅ Mood 情绪记录 + Weekly 真实聚合（关键词 + 主导情绪 + 本地建议模板）
- ✅ 树洞本地化（创作 / 分类 / 点赞 toggle / 长按删除）
- ✅ 自建 AI 智能体（最小流程）
- ✅ 设置二级页 + 隐私政策 + 免责声明
- ✅ 长按气泡复制
- ✅ 一键启动脚本 + LAN IP 自动同步

## 后续计划

- [ ] EAS Build → TestFlight + Android `.apk`，让 HR 能直接安装
- [ ] 把 `aimi-server` 部署到 VPS / Vercel / Railway，App 不再依赖电脑
- [ ] App 图标 + Splash 设计稿（目前用 Expo 默认 + 暖色背景）
- [ ] Profile 真实头像选择 / 编辑资料
- [ ] 更细的 NLP 情绪分析（替换关键词列表）
- [ ] Demo 视频 + 完整截图集

## 目录速览

```
app/                       routes (expo-router)
components/                UI 组件，按域分包
constants/theme.ts         单一设计 token 来源
mocks/                     首启种子数据（chat / treehole / agents）
services/                  ai.ts / safety.ts
storage/                   public API + sqlite database
types/models.ts            ChatMessage / MoodRecord / TreePost / Agent
server/                    Node 后端代理（独立 package.json）
assets/screenshots/        README 引用的截图
start-aimi.bat             Windows 一键启动
CLAUDE.md                  内部架构文档（给 Claude Code 看的）
```

## 安全 / 边界声明

- Aimi **不是医疗服务**，不能替代心理咨询师 / 医生 / 紧急救助
- 高风险表达走固定安全模板，建议用户联系身边可信任的人或当地紧急服务
- 所有聊天数据仅存在用户本地 SQLite，无云端账号 / 无云端数据库
- `GEMINI_API_KEY` 仅存在 `server/.env`，前端 bundle 永不接触

详见 App 内：

- 「设置 → 隐私政策」（`app/privacy.tsx`）
- 「设置 → 免责声明」（`app/disclaimer.tsx`）

## License

个人作品集项目，All Rights Reserved。代码与设计仅供面试与作品集展示用途，
未经作者同意请勿直接复用、二次发布或商业使用。如需引用或在你自己的项目里借
鉴某一部分（如 safety 分级思路、SQLite migration 模式），请先联系仓库 owner。
