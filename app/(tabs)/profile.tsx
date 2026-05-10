import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryPill } from "@/components/common/PrimaryPill";
import { Screen } from "@/components/common/Screen";
import { AgentList } from "@/components/profile/AgentList";
import { CreateAgentDialog } from "@/components/profile/CreateAgentDialog";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SegmentedTabs } from "@/components/profile/SegmentedTabs";
import { WorksGrid } from "@/components/profile/WorksGrid";
import { theme } from "@/constants/theme";
import { MOCK_FAVORITES, MOCK_WORKS } from "@/mocks";
import { storage } from "@/storage";
import type { Agent } from "@/types/models";

const TABS = ["作品", "智能体", "收藏"] as const;
type Tab = (typeof TABS)[number];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("作品");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [creating, setCreating] = useState(false);

  const refreshAgents = useCallback(async () => {
    const list = await storage.listAgents();
    setAgents(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const list = await storage.listAgents();
        if (!cancelled) setAgents(list);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  function onSettings() {
    router.push("/settings");
  }

  function openCreateAgent() {
    setCreating(true);
  }

  async function onCreateAgent(input: { name: string; intro: string }) {
    setCreating(false);
    await storage.createAgent({
      name: input.name,
      intro: input.intro,
      isPrivate: false,
    });
    await refreshAgents();
  }

  return (
    <View style={styles.root}>
      <Screen backgroundColor={theme.colors.bg} topEdge={false}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader onSettings={onSettings} />

          <SegmentedTabs tabs={TABS} active={tab} onSelect={setTab} />

          {tab === "作品" ? <WorksGrid works={MOCK_WORKS} /> : null}
          {tab === "智能体" ? <AgentList agents={agents} /> : null}
          {tab === "收藏" ? <WorksGrid works={MOCK_FAVORITES} /> : null}
        </ScrollView>
      </Screen>

      {tab === "智能体" ? (
        <View
          style={[styles.fabWrap, { bottom: 62 + insets.bottom + 14 }]}
        >
          <PrimaryPill
            icon="add"
            label="创建AI智能体"
            onPress={openCreateAgent}
          />
        </View>
      ) : null}

      <CreateAgentDialog
        visible={creating}
        onCancel={() => setCreating(false)}
        onSubmit={onCreateAgent}
      />
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
