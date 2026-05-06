import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppHeader } from "@/components/common/AppHeader";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";

const posts = [
  {
    emoji: "😊",
    from: "一名来自北京的同学",
    time: "男生",
    text: "今天也要加油呀，生活总是在清朗光的！",
    likes: 12,
    comments: 3,
  },
  {
    emoji: "🥺",
    from: "一名来自杭州的女生",
    time: "女生",
    text: "今天工作好累，想吃顿好的犒劳自己。",
    likes: 34,
    comments: 8,
  },
  {
    emoji: "🌸",
    from: "一名来自上海的女生",
    time: "女生",
    text: "有点想家了，晚上想给妈妈打个电话。",
    likes: 45,
    comments: 12,
  },
  {
    emoji: "✨",
    from: "一名来自深圳的男生",
    time: "男生",
    text: "刚看完一场超棒的电影，推荐给大家！",
    likes: 15,
    comments: 2,
  },
  {
    emoji: "🍀",
    from: "一名来自广州的同学",
    time: "男生",
    text: "今天捡到了一片很好看的树叶，分享给你们。",
    likes: 8,
    comments: 1,
    image: true,
  },
  {
    emoji: "😌",
    from: "一名来自南京的女生",
    time: "女生",
    text: "听着雨声入睡，觉得特别安心。",
    likes: 56,
    comments: 14,
  },
  {
    emoji: "❤️",
    from: "一名来自武汉的男生",
    time: "男生",
    text: "终于见到了好久不见的朋友，开心！",
    likes: 88,
    comments: 21,
  },
];

export default function TreeholeScreen() {
  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="匿名树洞"
        titleStyle={{ color: theme.colors.brand }}
        left={
          <IconButton>
            <Ionicons name="trail-sign-outline" size={22} color="#D86B3D" />
          </IconButton>
        }
        right={
          <IconButton>
            <Ionicons name="search-outline" size={22} color="#D86B3D" />
          </IconButton>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post, index) => (
          <View key={index} style={styles.postCard}>
            <View style={styles.userRow}>
              <View style={styles.emojiCircle}>
                <Text style={styles.emoji}>{post.emoji}</Text>
              </View>

              <View style={styles.userTextWrap}>
                <Text style={styles.from}>{post.from}</Text>
                <Text style={styles.gender}>{post.time}</Text>
              </View>
            </View>

            <Text style={styles.postText}>{post.text}</Text>

            {post.image && (
              <View style={styles.fakeImage}>
                <View style={styles.leaf} />
              </View>
            )}

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="heart-outline" size={14} color="#8F887B" />
                <Text style={styles.metaText}>{post.likes}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="chatbubble-outline" size={13} color="#8F887B" />
                <Text style={styles.metaText}>{post.comments}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.floatButton}>
        <Ionicons name="create-outline" size={23} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatButtonSecond}>
        <Ionicons name="chatbox-ellipses-outline" size={23} color="#FFFFFF" />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 120,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  postCard: {
    width: "47.5%",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF5D9",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 16,
  },
  userTextWrap: {
    marginLeft: 8,
    flex: 1,
  },
  from: {
    fontSize: 10,
    color: "#7D7669",
  },
  gender: {
    marginTop: 1,
    fontSize: 10,
    color: "#A59D91",
  },
  postText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#5C554B",
  },
  fakeImage: {
    marginTop: 12,
    height: 118,
    borderRadius: 18,
    backgroundColor: "#22351F",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  leaf: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#78A849",
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: "#8F887B",
  },
  floatButton: {
    position: "absolute",
    right: 20,
    bottom: 142,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#C76E42",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  floatButtonSecond: {
    position: "absolute",
    right: 20,
    bottom: 84,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#A44F34",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
});