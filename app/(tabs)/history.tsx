import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppHeader } from "../ui/AppHeader";
import { IconButton } from "../ui/IconButton";
import { Screen } from "../ui/Screen";
import { theme } from "../ui/theme";

const memories = [
  {
    title: "今天的情绪记录",
    time: "刚刚",
    date: "2026.04.25",
    content: "你说今天有点累，但还是想继续把 Aimi 做出来。",
  },
  {
    title: "关于作品集",
    time: "昨天",
    date: "2026.04.24",
    content: "你希望这个 App 能成为投前端实习的核心项目。",
  },
  {
    title: "关于 Aimi",
    time: "3天前",
    date: "2026.04.22",
    content: "Aimi 不只是聊天工具，而是能记录、陪伴和整理情绪的助手。",
  },
];

export default function HistoryScreen() {
  const router = useRouter();

  function goToChat() {
    router.push("/chat");
  }

  function createNewChat() {
    router.push("/chat");
  }

  function openSearch() {
    console.log("后面这里可以做搜索历史记录功能");
  }

  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="历史记忆"
        left={
          <IconButton onPress={openSearch}>
            <Ionicons name="search-outline" size={23} color={theme.colors.brand} />
          </IconButton>
        }
        right={
          <IconButton onPress={createNewChat}>
            <Ionicons name="create-outline" size={23} color={theme.colors.brand} />
          </IconButton>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.bigTitle}>Aimi 记得这些</Text>
        <Text style={styles.subtitle}>
          这里会沉淀你和 Aimi 的重要对话、情绪和生活片段。
        </Text>

        {memories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.72}
            onPress={goToChat}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>

              <Text style={styles.cardTime}>{item.time}</Text>
            </View>

            <Text style={styles.cardContent}>{item.content}</Text>

            <View style={styles.cardBottom}>
              <Text style={styles.continueText}>点击继续这段对话</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#B76B43" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 120,
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#B76B43",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: "#7C7568",
    textAlign: "center",
  },
  card: {
    marginTop: 22,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
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
    color: "#5E4E41",
  },
  cardDate: {
    marginTop: 5,
    fontSize: 12,
    color: "#B3A99A",
  },
  cardTime: {
    fontSize: 12,
    color: "#A89F90",
  },
  cardContent: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: "#736B60",
  },
  cardBottom: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1E8D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continueText: {
    fontSize: 12,
    color: "#B76B43",
  },
});