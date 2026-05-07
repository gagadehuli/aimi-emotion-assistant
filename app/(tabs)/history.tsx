import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { AppHeader } from "@/components/common/AppHeader";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";
import { MOCK_HISTORY_LIST, type ChatSession } from "@/mocks";

export default function HistoryScreen() {
  const router = useRouter();

  function openMemory(item: ChatSession) {
    router.push({
      pathname: "/chat",
      params: { recordId: item.id, date: item.date, title: item.title },
    });
  }

  function createNewChat() {
    router.push("/chat");
  }

  function openSearch() {
    // 阶段 2 占位：搜索历史记录会在阶段 3 接入
  }

  function swipeBackToChat() {
    router.push("/chat");
  }

  const swipeBack = Gesture.Pan()
    .activeOffsetX([-25, 9999])
    .failOffsetY([-12, 12])
    .onEnd((e) => {
      if (e.translationX < -60 && e.velocityX < -50) {
        runOnJS(swipeBackToChat)();
      }
    });

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

            {MOCK_HISTORY_LIST.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.72}
                onPress={() => openMemory(item)}
              >
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>

                <Text style={styles.cardContent} numberOfLines={2}>
                  {item.preview}
                </Text>

                <View style={styles.cardBottom}>
                  <Text style={styles.continueText}>点击继续这段对话</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color={theme.colors.brand}
                  />
                </View>
              </TouchableOpacity>
            ))}

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
