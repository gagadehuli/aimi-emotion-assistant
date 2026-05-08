import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryPill } from "@/components/common/PrimaryPill";
import { Screen } from "@/components/common/Screen";
import { AgentList } from "@/components/profile/AgentList";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SegmentedTabs } from "@/components/profile/SegmentedTabs";
import { WorksGrid } from "@/components/profile/WorksGrid";
import { theme } from "@/constants/theme";
import { MOCK_AGENTS, MOCK_FAVORITES, MOCK_WORKS } from "@/mocks";
import { storage } from "@/storage";

const TABS = ["作品", "智能体", "收藏"] as const;
type Tab = (typeof TABS)[number];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("作品");

  function onSettings() {
    Alert.alert(
      "清除本地数据？",
      "你和 Aimi 的全部对话和设置会被删除，且不可恢复。",
      [
        { text: "取消", style: "cancel" },
        { text: "我想清除", style: "destructive", onPress: confirmWipe },
      ],
    );
  }

  function confirmWipe() {
    Alert.alert("再次确认", "这是不可逆操作。仍然清除？", [
      { text: "取消", style: "cancel" },
      {
        text: "确认清除",
        style: "destructive",
        onPress: async () => {
          try {
            await storage.wipeAll();
          } finally {
            router.replace("/chat");
          }
        },
      },
    ]);
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
