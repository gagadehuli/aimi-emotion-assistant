import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

type Props<T extends string> = {
  tabs: readonly T[];
  active: T;
  onSelect: (t: T) => void;
};

export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onSelect,
}: Props<T>) {
  return (
    <View style={styles.row}>
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <Pressable
            key={t}
            onPress={() => onSelect(t)}
            style={styles.item}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t}
            </Text>
            {isActive ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 14,
    paddingHorizontal: 22,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 28,
  },
  item: {
    paddingVertical: 12,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  labelActive: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  underline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.text,
  },
});
