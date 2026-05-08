import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import type { Mood } from "@/types/models";

type MoodOption = {
  key: Mood;
  emoji: string;
  label: string;
};

const MOODS: MoodOption[] = [
  { key: "calm", emoji: "😌", label: "平静" },
  { key: "happy", emoji: "😊", label: "开心" },
  { key: "tired", emoji: "😮‍💨", label: "疲惫" },
  { key: "anxious", emoji: "😰", label: "焦虑" },
  { key: "sad", emoji: "🥲", label: "低落" },
];

type Props = {
  onPick: (mood: Mood) => void;
  recorded: boolean;
  recordedMood?: Mood | null;
};

export function MoodQuickRecord({ onPick, recorded, recordedMood }: Props) {
  if (recorded) {
    const picked = MOODS.find((m) => m.key === recordedMood);
    return (
      <View style={styles.recordedRow}>
        <Ionicons
          name="checkmark-circle"
          size={14}
          color={theme.colors.brand}
        />
        <Text style={styles.recordedText}>
          已记录到本周情绪
          {picked ? `  ${picked.emoji} ${picked.label}` : ""}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <Text style={styles.title}>记录一下此刻心情？</Text>
      <View style={styles.row}>
        {MOODS.map((m) => (
          <Pressable
            key={m.key}
            onPress={() => onPick(m.key)}
            style={({ pressed }) => [
              styles.chip,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={styles.label}>{m.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 6,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  chipPressed: { opacity: 0.6 },
  emoji: { fontSize: 24 },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  recordedRow: {
    marginTop: 6,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.bgWarm,
    borderRadius: theme.radius.md,
  },
  recordedText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
