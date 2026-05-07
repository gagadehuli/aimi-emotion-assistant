import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  label: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
};

export function PrimaryPill({ label, icon = "sparkles", onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={theme.colors.brandDeep}
        style={styles.icon}
      />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  pressed: { opacity: 0.85 },
  icon: { marginRight: 8 },
  text: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
});
