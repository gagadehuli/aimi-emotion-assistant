import { theme } from "@/constants/theme";

export type ChatRole = "user" | "ai";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

export type ChatSession = {
  id: string;
  title: string;
  date: string;
  time: string;
  preview: string;
  messages: ChatMessage[];
};

export const MOCK_CHAT_SESSIONS: Record<string, ChatSession> = {
  m_2026_04_25: {
    id: "m_2026_04_25",
    title: "今天的情绪记录",
    date: "2026.04.25",
    time: "刚刚",
    preview: "你说今天有点累，但还是想继续把 Aimi 做出来。",
    messages: [
      { id: "1", role: "ai", text: "今天过得怎么样？想不想跟我聊聊？" },
      { id: "2", role: "user", text: "有点累，不过还是想继续把 Aimi 做出来。" },
      {
        id: "3",
        role: "ai",
        text: "你已经一边累一边在前进了，这本身就很厉害。需要我帮你把今晚要做的事情排个顺序吗？",
      },
      { id: "4", role: "user", text: "嗯，先把欢迎页和聊天页的视觉骨架收一下。" },
      { id: "5", role: "ai", text: "好，那我帮你先记下来。明天早上想从这件事接着开始吗？" },
    ],
  },
  m_2026_04_24: {
    id: "m_2026_04_24",
    title: "关于作品集",
    date: "2026.04.24",
    time: "昨天",
    preview: "你希望这个 App 能成为投前端实习的核心项目。",
    messages: [
      { id: "1", role: "user", text: "我想把 Aimi 做成简历里最能打的项目。" },
      {
        id: "2",
        role: "ai",
        text: "听起来你对它已经有了具体的期待。最希望面试官从这个项目看到你哪一面？",
      },
      { id: "3", role: "user", text: "做产品的能力，不只是写代码。" },
      {
        id: "4",
        role: "ai",
        text: "嗯，那我们一起把「为什么做 Aimi」这条主线想清楚，会比堆功能更打动人。",
      },
    ],
  },
  m_2026_04_22: {
    id: "m_2026_04_22",
    title: "关于 Aimi",
    date: "2026.04.22",
    time: "3天前",
    preview: "Aimi 不只是聊天工具，而是能记录、陪伴和整理情绪的助手。",
    messages: [
      { id: "1", role: "user", text: "我希望 Aimi 不止是聊天工具。" },
      { id: "2", role: "ai", text: "嗯，你想让它替你记住什么？" },
      { id: "3", role: "user", text: "那些没人愿意听的小情绪。" },
      {
        id: "4",
        role: "ai",
        text: "好，我会替你把它们一点点收下来。等你某天想回头看的时候，它们会还在。",
      },
    ],
  },
};

export const MOCK_HISTORY_LIST: ChatSession[] = Object.values(MOCK_CHAT_SESSIONS);

export const MOCK_AI_REPLIES: string[] = [
  "我听到了。你愿意多说一点这件事让你最在意的部分吗？",
  "今天能把这种感觉说出来，已经是一种很温柔的力量了。",
  "如果把它拆成更小的一步，你最想先做哪一步？",
  "我会陪着你。先深吸一口气，再继续告诉我，好吗？",
  "嗯，我先把这一段记下来，等你想回头看的时候它都在。",
];

export const TREEHOLE_CATEGORIES: string[] = [
  "发现",
  "萌宠",
  "宝宝",
  "插画",
  "logo",
  "日常分享",
  "治愈",
  "心情",
  "灵感",
];

export type TreeholePost = {
  id: string;
  title: string;
  author: string;
  hot: string;
  hue1: string;
  hue2: string;
  height: number;
};

export const MOCK_TREEHOLE_POSTS: TreeholePost[] = [
  { id: "p1", title: "今晚的晚霞", author: "小麦", hot: "1.2 万人共鸣", hue1: "#F8C9A7", hue2: "#E89972", height: 220 },
  { id: "p2", title: "和自己和解", author: "阿绿", hot: "8723 人共鸣", hue1: "#CFE2C2", hue2: "#82AB7E", height: 170 },
  { id: "p3", title: "清晨第一杯咖啡", author: "豆豆", hot: "3.4 万人共鸣", hue1: "#EFD9B0", hue2: "#C7965C", height: 240 },
  { id: "p4", title: "下班路上的风", author: "Jin", hot: "9201 人共鸣", hue1: "#D7C7EC", hue2: "#9B82C6", height: 200 },
  { id: "p5", title: "随手拍的猫", author: "Mooncake", hot: "5.6 万人共鸣", hue1: "#FFE0E5", hue2: "#E69CA9", height: 230 },
  { id: "p6", title: "今天也想被治愈", author: "蓝色信封", hot: "6182 人共鸣", hue1: "#C9DDF6", hue2: "#7CA3D6", height: 195 },
  { id: "p7", title: "深夜电台开始了", author: "Lin", hot: "1.7 万人共鸣", hue1: "#3F3744", hue2: "#7C5577", height: 210 },
  { id: "p8", title: "便利店买了热豆浆", author: "莎莎", hot: "742 人共鸣", hue1: "#FFF1C9", hue2: "#E2BC6E", height: 180 },
];

export type ProfileStats = {
  follow: number;
  fans: number;
  likes: number;
};

export type Profile = {
  name: string;
  id: string;
  bio: string;
  tags: string[];
  stats: ProfileStats;
};

export const MOCK_PROFILE: Profile = {
  name: "小米",
  id: "豆包号: 532478489",
  bio: "用 Aimi 记录每一天的小情绪。\n做点小作品，陪自己慢慢长大。",
  tags: ["25岁", "上海", "前端"],
  stats: { follow: 209, fans: 134, likes: 76 },
};

export type WorkCard = {
  id: string;
  title: string;
  author: string;
  hot: string;
  hue1: string;
  hue2: string;
};

export const MOCK_WORKS: WorkCard[] = [
  { id: "w1", title: "晚霞速写", author: "小米", hot: "17 人使用", hue1: "#F8C9A7", hue2: "#E89972" },
  { id: "w2", title: "深夜独白", author: "小米", hot: "5 人使用", hue1: "#3F3744", hue2: "#7C5577" },
  { id: "w3", title: "猫和我的早晨", author: "小米", hot: "18 人使用", hue1: "#FFE0E5", hue2: "#E69CA9" },
  { id: "w4", title: "情绪光谱", author: "小米", hot: "932 人使用", hue1: "#D7C7EC", hue2: "#7B68A8" },
  { id: "w5", title: "海边手绘", author: "小米", hot: "76 人使用", hue1: "#CFE2C2", hue2: "#82AB7E" },
  { id: "w6", title: "小宇宙", author: "小米", hot: "210 人使用", hue1: "#1D2244", hue2: "#5560A4" },
];

export const MOCK_FAVORITES: WorkCard[] = [
  { id: "f1", title: "写给自己的信", author: "海绵草", hot: "3.2 万收藏", hue1: "#FFE0BD", hue2: "#D08D55" },
  { id: "f2", title: "夜里的电台", author: "Lin", hot: "1.7 万收藏", hue1: "#1F1A2A", hue2: "#5A4F77" },
  { id: "f3", title: "情绪整理术", author: "小绿", hot: "8.4 千收藏", hue1: "#CDE7CF", hue2: "#7AB081" },
  { id: "f4", title: "今天读到的一段话", author: "默默", hot: "5.6 千收藏", hue1: "#FFD9DD", hue2: "#E599A6" },
];

export type AgentCard = {
  id: string;
  name: string;
  intro: string;
  hue: string;
  isPrivate?: boolean;
};

export const MOCK_AGENTS: AgentCard[] = [
  {
    id: "a_aimi",
    name: "Aimi",
    intro: "陪你说说话，也帮你记住每一种心情。Aimi 是这个 App 里默认陪你的那个声音。",
    hue: theme.colors.accent,
  },
  {
    id: "a_school",
    name: "同班晴儿",
    intro: "她是和你青梅竹马的同班高中生，性格开朗活泼有点小迷糊，在你忘带课本、考试焦虑时帮你打气。",
    hue: "#F5BFA5",
    isPrivate: true,
  },
  {
    id: "a_writer",
    name: "深夜写作者",
    intro: "凌晨陪你写完那篇稿子，会用一两句话戳中你卡住的地方。",
    hue: "#A89FE0",
  },
  {
    id: "a_canteen",
    name: "温柔的小食堂",
    intro: "今天该吃点什么、要不要吃水果、心情低落时要不要点一杯热的，让她替你想。",
    hue: "#F5C56B",
    isPrivate: true,
  },
];
