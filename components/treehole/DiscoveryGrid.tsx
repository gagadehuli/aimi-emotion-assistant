import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import type { TreePost } from "@/types/models";

type Props = {
  posts: TreePost[];
  onLike?: (post: TreePost) => void;
  onLongPress?: (post: TreePost) => void;
};

const CATEGORY_HUES: Record<string, [string, string]> = {
  发现: ["#EFD9B0", "#C7965C"],
  萌宠: ["#FFF1C9", "#E2BC6E"],
  宝宝: ["#FFD7CE", "#F0A38B"],
  插画: ["#C9DDF6", "#7CA3D6"],
  logo: ["#3F3744", "#7C5577"],
  日常分享: ["#F8C9A7", "#E89972"],
  治愈: ["#CFE2C2", "#82AB7E"],
  心情: ["#FFE0E5", "#E69CA9"],
  灵感: ["#D7C7EC", "#9B82C6"],
};

const FALLBACK_HUES: [string, string] = ["#F8C9A7", "#E89972"];

const HEIGHTS = [180, 200, 220, 240];

function huesFor(category: string): [string, string] {
  return CATEGORY_HUES[category] ?? FALLBACK_HUES;
}

function heightFor(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return HEIGHTS[Math.abs(h) % HEIGHTS.length];
}

export function DiscoveryGrid({ posts, onLike, onLongPress }: Props) {
  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>这里还空着，去开始创作吧。</Text>
      </View>
    );
  }
  const left: TreePost[] = [];
  const right: TreePost[] = [];
  posts.forEach((p, i) => (i % 2 === 0 ? left : right).push(p));
  return (
    <View style={styles.row}>
      <View style={styles.col}>
        {left.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onLike={onLike}
            onLongPress={onLongPress}
          />
        ))}
      </View>
      <View style={styles.col}>
        {right.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onLike={onLike}
            onLongPress={onLongPress}
          />
        ))}
      </View>
    </View>
  );
}

function PostCard({
  post,
  onLike,
  onLongPress,
}: {
  post: TreePost;
  onLike?: (post: TreePost) => void;
  onLongPress?: (post: TreePost) => void;
}) {
  const [hue1, hue2] = huesFor(post.category);
  const height = heightFor(post.id);
  return (
    <Pressable
      onLongPress={onLongPress ? () => onLongPress(post) : undefined}
      delayLongPress={350}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.image, { height, backgroundColor: hue1 }]}>
        <View style={[styles.imageTone, { backgroundColor: hue2 }]} />
        <Text style={styles.categoryTag}>{post.category}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {post.title}
        </Text>
        {post.content ? (
          <Text style={styles.content} numberOfLines={2}>
            {post.content}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <View style={[styles.miniAvatar, { backgroundColor: hue2 }]} />
          <Text style={styles.author} numberOfLines={1}>
            {post.authorAlias ?? "匿名"}
          </Text>
          <Pressable
            hitSlop={6}
            onPress={onLike ? () => onLike(post) : undefined}
            style={({ pressed }) => [
              styles.likeBtn,
              pressed && styles.cardPressed,
            ]}
          >
            <Ionicons
              name={post.liked ? "heart" : "heart-outline"}
              size={13}
              color={post.liked ? "#E0625B" : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.likeCount,
                post.liked && styles.likeCountActive,
              ]}
            >
              {post.likes}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
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
  cardPressed: { opacity: 0.85 },
  image: { position: "relative" },
  imageTone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    opacity: 0.55,
  },
  categoryTag: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    color: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.32)",
    borderRadius: 999,
    overflow: "hidden",
  },
  meta: { paddingHorizontal: 10, paddingVertical: 10 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  content: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.textMuted,
  },
  metaRow: {
    marginTop: 8,
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
  likeBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  likeCount: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  likeCountActive: {
    color: "#E0625B",
    fontWeight: "600",
  },
});
