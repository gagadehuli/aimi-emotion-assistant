import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { AppHeader } from "@/components/common/AppHeader";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { RenameDialog } from "@/components/history/RenameDialog";
import { SessionActionSheet } from "@/components/history/SessionActionSheet";
import { theme } from "@/constants/theme";
import { storage } from "@/storage";
import type { ChatSession } from "@/types/models";

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "刚刚";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  return formatDate(ts);
}

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [renameTarget, setRenameTarget] = useState<ChatSession | null>(null);

  const refresh = useCallback(async () => {
    const list = await storage.listSessions();
    setSessions(list);
    setLoaded(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const list = await storage.listSessions();
        if (cancelled) return;
        setSessions(list);
        setLoaded(true);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  function openMemory(item: ChatSession) {
    router.push({
      pathname: "/chat",
      params: { recordId: item.id },
    });
  }

  function createNewChat() {
    router.push("/chat");
  }

  function openSearch() {
    // 阶段 5 接搜索
  }

  function swipeBackToChat() {
    router.push("/chat");
  }

  function openSheet(item: ChatSession) {
    setActiveSession(item);
  }

  function closeSheet() {
    setActiveSession(null);
  }

  function onRenameTap() {
    if (!activeSession) return;
    const target = activeSession;
    setActiveSession(null);
    setRenameTarget(target);
  }

  async function onRenameSubmit(title: string) {
    if (!renameTarget) return;
    const target = renameTarget;
    setRenameTarget(null);
    await storage.renameSession(target.id, title);
    await refresh();
  }

  async function onTogglePin() {
    if (!activeSession) return;
    const target = activeSession;
    setActiveSession(null);
    await storage.setPinned(target.id, target.pinnedAt === null);
    await refresh();
  }

  function onDeleteTap() {
    if (!activeSession) return;
    const target = activeSession;
    setActiveSession(null);
    Alert.alert(
      "删除这段对话？",
      `「${target.title}」会被永久删除，且不可恢复。`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            await storage.deleteSession(target.id);
            await refresh();
          },
        },
      ],
    );
  }

  const swipeBack = Gesture.Pan()
    .activeOffsetX([-25, 9999])
    .failOffsetY([-12, 12])
    .onEnd((e) => {
      if (e.translationX < -60 && e.velocityX < -50) {
        runOnJS(swipeBackToChat)();
      }
    });

  const isEmpty = loaded && sessions.length === 0;

  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="历史记忆"
        left={
          <IconButton onPress={openSearch}>
            <Ionicons
              name="search-outline"
              size={23}
              color={theme.colors.brand}
            />
          </IconButton>
        }
        right={
          <IconButton onPress={createNewChat}>
            <Ionicons
              name="create-outline"
              size={23}
              color={theme.colors.brand}
            />
          </IconButton>
        }
      />

      <GestureDetector gesture={swipeBack}>
        <View style={styles.flex}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.bigTitle}>Aimi 记得这些</Text>
            <Text style={styles.subtitle}>
              这里会沉淀你和 Aimi 的重要对话、情绪和生活片段。
            </Text>

            {isEmpty ? (
              <Pressable
                onPress={createNewChat}
                style={({ pressed }) => [
                  styles.emptyCard,
                  pressed && styles.emptyCardPressed,
                ]}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={theme.colors.brand}
                />
                <Text style={styles.emptyText}>
                  这里还空着，点这里新建一段对话。
                </Text>
              </Pressable>
            ) : null}

            {sessions.map((item) => {
              const pinned = item.pinnedAt !== null;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.72}
                  onPress={() => openMemory(item)}
                  onLongPress={() => openSheet(item)}
                  delayLongPress={280}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.cardTitleWrap}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDate}>
                        {formatDate(item.updatedAt)}
                      </Text>
                    </View>
                    <View style={styles.cardTopRight}>
                      {pinned ? (
                        <Ionicons
                          name="bookmark"
                          size={14}
                          color={theme.colors.brand}
                          style={styles.pinIcon}
                        />
                      ) : null}
                      <Text style={styles.cardTime}>
                        {formatRelative(item.updatedAt)}
                      </Text>
                    </View>
                  </View>

                  {item.lastPreview ? (
                    <Text style={styles.cardContent} numberOfLines={2}>
                      {item.lastPreview}
                    </Text>
                  ) : null}

                  <View style={styles.cardBottom}>
                    <Text style={styles.continueText}>点击继续这段对话</Text>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={16}
                      color={theme.colors.brand}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={styles.swipeHintRow}>
              <Ionicons
                name="chevron-back-outline"
                size={14}
                color={theme.colors.textSubtle}
              />
              <Text style={styles.swipeHint}>左滑回到聊天</Text>
            </View>
          </ScrollView>
        </View>
      </GestureDetector>

      <SessionActionSheet
        visible={activeSession !== null}
        isPinned={activeSession?.pinnedAt !== null && activeSession?.pinnedAt !== undefined}
        onClose={closeSheet}
        onRename={onRenameTap}
        onTogglePin={onTogglePin}
        onDelete={onDeleteTap}
      />

      <RenameDialog
        visible={renameTarget !== null}
        initialTitle={renameTarget?.title ?? ""}
        onCancel={() => setRenameTarget(null)}
        onSubmit={onRenameSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 140,
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: theme.colors.brand,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  emptyCard: {
    marginTop: 28,
    padding: 22,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bgWarm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  emptyCardPressed: { opacity: 0.7 },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  card: {
    marginTop: 22,
    padding: 18,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitleWrap: { flex: 1 },
  cardTopRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  pinIcon: { marginRight: 6 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  cardDate: {
    marginTop: 5,
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
  cardTime: {
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
  cardContent: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textMuted,
  },
  cardBottom: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continueText: {
    fontSize: 12,
    color: theme.colors.brand,
  },
  swipeHintRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  swipeHint: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
});
