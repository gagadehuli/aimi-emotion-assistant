import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import type { WorkCard } from "@/mocks";

type Props = { works: WorkCard[] };

export function WorksGrid({ works }: Props) {
  const left: WorkCard[] = [];
  const right: WorkCard[] = [];
  works.forEach((w, i) => (i % 2 === 0 ? left : right).push(w));
  return (
    <View style={styles.row}>
      <View style={styles.col}>
        {left.map((w) => (
          <Card key={w.id} item={w} />
        ))}
      </View>
      <View style={styles.col}>
        {right.map((w) => (
          <Card key={w.id} item={w} />
        ))}
      </View>
    </View>
  );
}

function Card({ item }: { item: WorkCard }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.image, { backgroundColor: item.hue1 }]}>
        <View style={[styles.imageTone, { backgroundColor: item.hue2 }]} />
        <View style={styles.playPill}>
          <Ionicons name="play" size={10} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
      <View style={styles.meta}>
        <View style={[styles.miniAvatar, { backgroundColor: item.hue2 }]} />
        <Text style={styles.author} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.hot}>{item.hot}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 16,
  },
  col: { flex: 1, gap: 14 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pressed: { opacity: 0.85 },
  image: {
    aspectRatio: 0.78,
    position: "relative",
  },
  imageTone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    opacity: 0.7,
  },
  playPill: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 10,
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
