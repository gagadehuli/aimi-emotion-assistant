import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryPill } from "@/components/common/PrimaryPill";
import { Screen } from "@/components/common/Screen";
import { CategoryTabs } from "@/components/treehole/CategoryTabs";
import { DiscoveryGrid } from "@/components/treehole/DiscoveryGrid";
import { theme } from "@/constants/theme";
import { MOCK_TREEHOLE_POSTS, TREEHOLE_CATEGORIES } from "@/mocks";

export default function TreeholeScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string>(TREEHOLE_CATEGORIES[0]);

  return (
    <View style={styles.root}>
      <Screen backgroundColor={theme.colors.bg}>
        <CategoryTabs
          categories={TREEHOLE_CATEGORIES}
          active={active}
          onSelect={setActive}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DiscoveryGrid posts={MOCK_TREEHOLE_POSTS} />
        </ScrollView>
      </Screen>

      <View
        style={[styles.fabWrap, { bottom: 62 + insets.bottom + 14 }]}
      >
        <PrimaryPill icon="sparkles" label="开始创作" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 180,
  },
  fabWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
    zIndex: 100,
    elevation: 12,
  },
});
