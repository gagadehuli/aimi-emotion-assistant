import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
};

export function CategoryTabs({ categories, active, onSelect }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <Pressable
              key={c}
              onPress={() => onSelect(c)}
              style={styles.item}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {c}
              </Text>
              {isActive ? <View style={styles.underline} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 52,
    justifyContent: "center",
  },
  row: {
    paddingHorizontal: 16,
    gap: 20,
    alignItems: "flex-end",
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  labelActive: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 17,
  },
  underline: {
    marginTop: 6,
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.text,
  },
});
