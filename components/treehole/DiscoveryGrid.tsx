import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import type { TreeholePost } from "@/mocks";

type Props = { posts: TreeholePost[] };

export function DiscoveryGrid({ posts }: Props) {
  const left: TreeholePost[] = [];
  const right: TreeholePost[] = [];
  posts.forEach((p, i) => (i % 2 === 0 ? left : right).push(p));
  return (
    <View style={styles.row}>
      <View style={styles.col}>
        {left.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </View>
      <View style={styles.col}>
        {right.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </View>
    </View>
  );
}

function PostCard({ post }: { post: TreeholePost }) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.image,
          { height: post.height, backgroundColor: post.hue1 },
        ]}
      >
        <View style={[styles.imageTone, { backgroundColor: post.hue2 }]} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {post.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.miniAvatar, { backgroundColor: post.hue2 }]} />
          <Text style={styles.author} numberOfLines={1}>
            {post.author}
          </Text>
          <Text style={styles.hot}>{post.hot}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 10,
  },
  col: { flex: 1, gap: 10 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image: { position: "relative" },
  imageTone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    opacity: 0.55,
  },
  meta: { paddingHorizontal: 10, paddingVertical: 10 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniAvatar: { width: 16, height: 16, borderRadius: 8 },
  author: {
    fontSize: 11,
    color: theme.colors.textMuted,
    flexShrink: 1,
  },
  hot: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    marginLeft: "auto",
  },
});
