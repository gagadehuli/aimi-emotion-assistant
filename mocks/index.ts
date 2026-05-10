import type { ChatRole } from "@/types/models";

export type SeedMessage = {
  role: ChatRole;
  text: string;
};

export type SeedSession = {
  id: string;
  title: string;
  daysAgo: number;
  messages: SeedMessage[];
};

export const SEED_SESSIONS: SeedSession[] = [
  {
    id: "m_2026_04_25",
    title: "今天的情绪记录",
    daysAgo: 0,
    messages: [
      { role: "ai", text: "今天过得怎么样？想不想跟我聊聊？" },
      { role: "user", text: "有点累，不过还是想继续把 Aimi 做出来。" },
      {
        role: "ai",
        text: "你已经一边累一边在前进了，这本身就很厉害。需要我帮你把今晚要做的事情排个顺序吗？",
      },
      { role: "user", text: "嗯，先把欢迎页和聊天页的视觉骨架收一下。" },
      {
        role: "ai",
        text: "好，那我帮你先记下来。明天早上想从这件事接着开始吗？",
      },
    ],
  },
  {
    id: "m_2026_04_24",
    title: "关于作品集",
    daysAgo: 1,
    messages: [
      { role: "user", text: "我想把 Aimi 做成简历里最能打的项目。" },
      {
        role: "ai",
        text: "听起来你对它已经有了具体的期待。最希望面试官从这个项目看到你哪一面？",
      },
      { role: "user", text: "做产品的能力，不只是写代码。" },
      {
        role: "ai",
        text: "嗯，那我们一起把「为什么做 Aimi」这条主线想清楚，会比堆功能更打动人。",
      },
    ],
  },
  {
    id: "m_2026_04_22",
    title: "关于 Aimi",
    daysAgo: 3,
    messages: [
      { role: "user", text: "我希望 Aimi 不止是聊天工具。" },
      { role: "ai", text: "嗯，你想让它替你记住什么？" },
      { role: "user", text: "那些没人愿意听的小情绪。" },
      {
        role: "ai",
        text: "好，我会替你把它们一点点收下来。等你某天想回头看的时候，它们会还在。",
      },
    ],
  },
];

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

// 创建帖子时可选分类（去掉"发现"，"发现" 是查看全部的入口而非真实分类）
export const TREEHOLE_POST_CATEGORIES: string[] = TREEHOLE_CATEGORIES.filter(
  (c) => c !== "发现",
);

export type SeedTreePost = {
  id: string;
  category: string;
  title: string;
  content: string;
  authorAlias: string;
  hoursAgo: number;
};

export const SEED_TREE_POSTS: SeedTreePost[] = [
  {
    id: "p1",
    category: "日常分享",
    title: "今晚的晚霞",
    content: "下班路上抬头看到一片橙紫色，发愣了几秒。",
    authorAlias: "小麦",
    hoursAgo: 2,
  },
  {
    id: "p2",
    category: "治愈",
    title: "和自己和解",
    content: "今天突然原谅了那个总是把事情搞砸的自己，像放下一块小石头。",
    authorAlias: "阿绿",
    hoursAgo: 6,
  },
  {
    id: "p3",
    category: "日常分享",
    title: "清晨第一杯咖啡",
    content: "煮咖啡的时候听到窗外鸟叫，忽然觉得早起也没那么糟。",
    authorAlias: "豆豆",
    hoursAgo: 14,
  },
  {
    id: "p4",
    category: "灵感",
    title: "下班路上的风",
    content: "灯一盏一盏亮起来，地铁口有人在弹吉他，城市的疲惫好像都温柔了一点。",
    authorAlias: "Jin",
    hoursAgo: 24,
  },
  {
    id: "p5",
    category: "萌宠",
    title: "随手拍的猫",
    content: "在便利店门口睡得四仰八叉，跟旁边人完全不熟。",
    authorAlias: "Mooncake",
    hoursAgo: 30,
  },
  {
    id: "p6",
    category: "治愈",
    title: "今天也想被治愈",
    content: "做完手头的事就准备早点睡。让自己歇一会儿不是浪费时间。",
    authorAlias: "蓝色信封",
    hoursAgo: 40,
  },
  {
    id: "p7",
    category: "心情",
    title: "深夜电台开始了",
    content: "戴上耳机的那一刻，世界瞬间变小，只剩下呼吸和声音。",
    authorAlias: "Lin",
    hoursAgo: 48,
  },
  {
    id: "p8",
    category: "日常分享",
    title: "便利店买了热豆浆",
    content: "捧在手里的时候才发现，原来一杯热的就够暖和半天。",
    authorAlias: "莎莎",
    hoursAgo: 60,
  },
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

export type SeedAgent = {
  id: string;
  name: string;
  intro: string;
  hue: string;
  isPrivate: boolean;
};

export const SEED_AGENTS: SeedAgent[] = [
  {
    id: "a_aimi",
    name: "Aimi",
    intro: "陪你说说话，也帮你记住每一种心情。Aimi 是这个 App 里默认陪你的那个声音。",
    hue: "#F4B79E",
    isPrivate: false,
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
    isPrivate: false,
  },
  {
    id: "a_canteen",
    name: "温柔的小食堂",
    intro: "今天该吃点什么、要不要吃水果、心情低落时要不要点一杯热的，让她替你想。",
    hue: "#F5C56B",
    isPrivate: true,
  },
];
