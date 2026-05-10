import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import type { Agent } from "@/types/models";

type Props = { agents: Agent[] };

export function AgentList({ agents }: Props) {
  return (
    <View style={styles.col}>
      {agents.map((a) => (
        <Pressable
          key={a.id}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={[styles.avatar, { backgroundColor: a.hue }]}>
            <Text style={styles.avatarChar}>{a.name.charAt(0)}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.name}>{a.name}</Text>
            <Text numberOfLines={2} style={styles.intro}>
              {a.intro}
            </Text>
            {a.isPrivate ? (
              <View style={styles.privateRow}>
                <Ionicons
                  name="lock-closed"
                  size={11}
                  color={theme.colors.textSubtle}
                />
                <Text style={styles.privateText}>私密</Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pressed: { opacity: 0.85 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarChar: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.card,
  },
  body: { flex: 1, marginLeft: 14 },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  intro: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.textMuted,
  },
  privateRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  privateText: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
});
