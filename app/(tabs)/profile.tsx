import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryPill } from "@/components/common/PrimaryPill";
import { Screen } from "@/components/common/Screen";
import { AgentList } from "@/components/profile/AgentList";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SegmentedTabs } from "@/components/profile/SegmentedTabs";
import { WorksGrid } from "@/components/profile/WorksGrid";
import { theme } from "@/constants/theme";
import { MOCK_AGENTS, MOCK_FAVORITES, MOCK_WORKS } from "@/mocks";

const TABS = ["作品", "智能体", "收藏"] as const;
type Tab = (typeof TABS)[number];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("作品");

  return (
    <View style={styles.root}>
      <Screen backgroundColor={theme.colors.bg} topEdge={false}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader />

          <SegmentedTabs tabs={TABS} active={tab} onSelect={setTab} />

          {tab === "作品" ? <WorksGrid works={MOCK_WORKS} /> : null}
          {tab === "智能体" ? <AgentList agents={MOCK_AGENTS} /> : null}
          {tab === "收藏" ? <WorksGrid works={MOCK_FAVORITES} /> : null}
        </ScrollView>
      </Screen>

      {tab === "智能体" ? (
        <View
          style={[styles.fabWrap, { bottom: 62 + insets.bottom + 14 }]}
        >
          <PrimaryPill icon="add" label="创建AI智能体" />
        </View>
      ) : null}
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
