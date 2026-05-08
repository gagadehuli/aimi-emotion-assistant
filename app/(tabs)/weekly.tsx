import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/common/AppHeader";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";
import {
  endOfThisWeek,
  startOfThisWeek,
  storage,
} from "@/storage";
import type { ChatMessage, Mood, MoodRecord } from "@/types/models";

const DAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];
const DAY_MS = 86_400_000;

const MOOD_META: Record<
  Mood,
  { label: string; emoji: string; color: string }
> = {
  calm: { label: "平静", emoji: "😌", color: "#CFE2C2" },
  happy: { label: "开心", emoji: "😊", color: "#F4B79E" },
  tired: { label: "疲惫", emoji: "😮‍💨", color: "#B67855" },
  anxious: { label: "焦虑", emoji: "😰", color: "#F5C56B" },
  sad: { label: "低落", emoji: "🥲", color: "#C9DDF6" },
};

const MOOD_DESCRIPTION: Record<Mood, string> = {
  calm: "这周你体验了更多的平静，情绪波动如同温柔的海浪。",
  happy: "这周你的好心情比较多，记得把它们留下来。",
  tired: "这周记录里出现最多的是疲惫，给自己一些喘息的空间也是被允许的。",
  anxious: "这周你提到不少焦虑，我们可以一点一点把它们梳理开。",
  sad: "这周你的心情有点低落，把感受说出来本身就是一种力量。",
};

const MOOD_SUGGESTION: Record<Mood, string> = {
  calm: "保持这种节奏。今晚也可以给自己一段安静的时间。",
  happy: "把让你开心的小事写下来，下次低落时翻出来看看。",
  tired: "给自己一个慢下来的晚上。把任务拆得更小一些。",
  anxious: "试试把最担心的事写下来，看到它就没那么大了。",
  sad: "你不用一个人扛。要不要和身边可信任的人聊几句？",
};

const KEYWORDS: string[] = [
  "累", "疲惫", "焦虑", "压力", "低落", "难过", "孤独", "烦", "生气",
  "开心", "平静", "放松", "感动", "希望", "喜欢",
  "作品集", "学习", "面试", "考试", "加班", "工作", "项目",
  "室友", "朋友", "家人", "妈妈", "爸爸",
  "睡不着", "失眠", "想哭",
  "担心", "害怕",
];

function formatRange(start: number): string {
  const a = new Date(start);
  const b = new Date(start + 6 * DAY_MS);
  return `${a.getMonth() + 1}月${a.getDate()}日 — ${b.getMonth() + 1}月${b.getDate()}日`;
}

function bucketByDay(records: MoodRecord[], weekStart: number) {
  const buckets: { count: number; tally: Partial<Record<Mood, number>> }[] = [];
  for (let i = 0; i < 7; i += 1) buckets.push({ count: 0, tally: {} });
  for (const r of records) {
    const idx = Math.floor((r.createdAt - weekStart) / DAY_MS);
    if (idx < 0 || idx >= 7) continue;
    buckets[idx].count += 1;
    buckets[idx].tally[r.mood] = (buckets[idx].tally[r.mood] ?? 0) + 1;
  }
  return buckets;
}

function dominantMood(records: MoodRecord[]): Mood | null {
  if (records.length === 0) return null;
  const tally = new Map<Mood, number>();
  for (const r of records) tally.set(r.mood, (tally.get(r.mood) ?? 0) + 1);
  let best: Mood | null = null;
  let bestN = 0;
  for (const [m, n] of tally) {
    if (n > bestN) {
      best = m;
      bestN = n;
    }
  }
  return best;
}

function bucketDominantMood(b: {
  tally: Partial<Record<Mood, number>>;
}): Mood | null {
  let best: Mood | null = null;
  let bestN = 0;
  for (const k of Object.keys(b.tally) as Mood[]) {
    const n = b.tally[k] ?? 0;
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  }
  return best;
}

function topKeywords(messages: ChatMessage[]): string[] {
  const text = messages
    .filter((m) => m.role === "user")
    .map((m) => m.text)
    .join("\n");
  if (!text.trim()) return [];
  const counts: { word: string; n: number }[] = [];
  for (const w of KEYWORDS) {
    let n = 0;
    let from = 0;
    while (true) {
      const i = text.indexOf(w, from);
      if (i === -1) break;
      n += 1;
      from = i + w.length;
    }
    if (n > 0) counts.push({ word: w, n });
  }
  counts.sort((a, b) => b.n - a.n);
  return counts.slice(0, 5).map((c) => c.word);
}

type WeeklyData = {
  weekStart: number;
  moodCount: number;
  buckets: ReturnType<typeof bucketByDay>;
  dominant: Mood | null;
  keywords: string[];
};

export default function WeeklyScreen() {
  const router = useRouter();
  const [data, setData] = useState<WeeklyData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const weekStart = startOfThisWeek();
        const weekEnd = endOfThisWeek();
        const moods = await storage.listMoodRecordsForWeek();
        const sessions = await storage.listSessions();
        const sessionIds = sessions
          .filter(
            (s) => s.updatedAt >= weekStart || s.createdAt < weekEnd,
          )
          .map((s) => s.id);
        const allMessages: ChatMessage[] = [];
        for (const sid of sessionIds) {
          const r = await storage.getSession(sid);
          if (!r) continue;
          for (const m of r.messages) {
            if (m.createdAt >= weekStart && m.createdAt < weekEnd) {
              allMessages.push(m);
            }
          }
        }
        if (cancelled) return;
        setData({
          weekStart,
          moodCount: moods.length,
          buckets: bucketByDay(moods, weekStart),
          dominant: dominantMood(moods),
          keywords: topKeywords(allMessages),
        });
        setLoaded(true);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  if (!loaded || !data) {
    return (
      <Screen backgroundColor={theme.colors.bg}>
        <AppHeader title="周报" border={false} />
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>正在整理你的本周心流…</Text>
        </View>
      </Screen>
    );
  }

  const isEmpty = data.moodCount === 0;

  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader title="周报" border={false} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.weekText}>本周 {formatRange(data.weekStart)}</Text>

        {isEmpty ? (
          <EmptyState onGoChat={() => router.replace("/chat")} />
        ) : (
          <Loaded data={data} />
        )}
      </ScrollView>
    </Screen>
  );
}

function EmptyState({ onGoChat }: { onGoChat: () => void }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>这周还没有情绪记录</Text>
      <Text style={styles.emptyDesc}>
        和 Aimi 聊聊后，可以顺手记录一下此刻心情。
      </Text>
      <Pressable
        onPress={onGoChat}
        style={({ pressed }) => [
          styles.emptyBtn,
          pressed && styles.emptyBtnPressed,
        ]}
      >
        <Ionicons name="chatbubble-outline" size={16} color={theme.colors.brandDeep} />
        <Text style={styles.emptyBtnText}>去聊天</Text>
      </Pressable>
    </View>
  );
}

function Loaded({ data }: { data: WeeklyData }) {
  const dominant = data.dominant;
  const description = dominant
    ? MOOD_DESCRIPTION[dominant]
    : "这周你刚开始记录，先看看节奏。";
  const suggestion = dominant
    ? MOOD_SUGGESTION[dominant]
    : "记录会让你慢慢看见自己的情绪走向。";

  const maxCount = Math.max(1, ...data.buckets.map((b) => b.count));

  return (
    <>
      <Text style={styles.title}>你的本周{"\n"}心流报告</Text>
      <Text style={styles.desc}>{description}</Text>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>情绪记录</Text>
          {dominant ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                主要 {MOOD_META[dominant].emoji} {MOOD_META[dominant].label}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.chartArea}>
          {data.buckets.map((b, i) => {
            const dom = bucketDominantMood(b);
            const color = dom
              ? MOOD_META[dom].color
              : theme.colors.borderStrong;
            const ratio = b.count / maxCount;
            const height = b.count === 0 ? 8 : 30 + ratio * 100;
            return (
              <View key={i} style={styles.barWrap}>
                <View
                  style={[styles.bar, { height, backgroundColor: color }]}
                />
                <Text style={styles.barLabel}>{DAY_LABELS[i]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.smallCard}>
          <Text style={styles.smallEmoji}>🌤️</Text>
          <Text style={styles.smallTitle}>本周关键词</Text>
          <Text style={styles.smallText}>
            {data.keywords.length > 0
              ? data.keywords.join("、")
              : "聊天里还没出现常见情绪词，继续聊就会有。"}
          </Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.smallEmoji}>🍊</Text>
          <Text style={styles.smallTitle}>Aimi 建议</Text>
          <Text style={styles.smallText}>{suggestion}</Text>
        </View>
      </View>

      <Text style={styles.fineprint}>
        Aimi 的建议来自本地模板，不是医疗判断。
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 140,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  weekText: {
    fontSize: 12,
    color: theme.colors.textSubtle,
    textAlign: "center",
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "500",
    color: theme.colors.brand,
    textAlign: "center",
  },
  desc: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  chartCard: {
    marginTop: 36,
    padding: 20,
    height: 250,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.brandDeep,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
  },
  badgeText: {
    fontSize: 11,
    color: theme.colors.text,
    fontWeight: "600",
  },
  chartArea: {
    flex: 1,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 24,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  barLabel: {
    marginTop: 10,
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
  summaryRow: {
    marginTop: 28,
    flexDirection: "row",
    gap: 14,
  },
  smallCard: {
    flex: 1,
    minHeight: 116,
    padding: 18,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  smallEmoji: { fontSize: 26 },
  smallTitle: {
    marginTop: 10,
    fontSize: 13,
    color: theme.colors.brandDeep,
    fontWeight: "600",
  },
  smallText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.textMuted,
  },
  fineprint: {
    marginTop: 24,
    fontSize: 11,
    color: theme.colors.textSubtle,
    textAlign: "center",
  },
  emptyWrap: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.brand,
    textAlign: "center",
  },
  emptyDesc: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  emptyBtnPressed: { opacity: 0.85 },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.brandDeep,
  },
});
