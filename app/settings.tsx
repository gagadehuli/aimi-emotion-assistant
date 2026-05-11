import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/common/AppHeader";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";
import { storage } from "@/storage";

const APP_VERSION =
  (Constants.expoConfig?.version as string | undefined) ?? "1.0.0";

const PROVIDER = (process.env.EXPO_PUBLIC_AI_PROVIDER ?? "mock").toLowerCase();
const PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL ?? "";

function modeLabel(): string {
  if (PROVIDER === "proxy" && PROXY_URL) return "proxy（已配置后端）";
  if (PROVIDER === "proxy") return "proxy（未配置 URL，将走 mock）";
  return "mock（仅本地随机回复）";
}

export default function SettingsScreen() {
  function onClearData() {
    Alert.alert(
      "清除本地数据？",
      "你和 Aimi 的全部对话、情绪记录、树洞内容、智能体都会被删除，且不可恢复。",
      [
        { text: "取消", style: "cancel" },
        { text: "我想清除", style: "destructive", onPress: confirmClear },
      ],
    );
  }

  function confirmClear() {
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

  function showAbout() {
    Alert.alert(
      "关于 Aimi",
      "Aimi（艾米）是一个温和的 AI 情绪陪伴助手。\n\n" +
        "Aimi 不是医疗服务，无法替代心理咨询或医学诊断。\n" +
        "如果你正处在严重困扰中，请联系当地紧急服务、可信任的人，或参考心理援助热线。",
      [{ text: "好的" }],
    );
  }

  function openPrivacy() {
    router.push("/privacy");
  }

  function openDisclaimer() {
    router.push("/disclaimer");
  }

  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="设置"
        left={
          <IconButton onPress={() => router.back()}>
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={theme.colors.brand}
            />
          </IconButton>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section title="本地数据">
          <Row
            icon="trash-outline"
            label="清除本地数据"
            destructive
            onPress={onClearData}
            description="删除全部对话、情绪记录、树洞和智能体"
          />
        </Section>

        <Section title="AI">
          <InfoRow label="当前模型" value="gemini-2.5-flash" />
          <InfoRow label="当前模式" value={modeLabel()} />
        </Section>

        <Section title="关于">
          <Row
            icon="information-circle-outline"
            label="关于 Aimi"
            onPress={showAbout}
          />
          <Row
            icon="shield-checkmark-outline"
            label="隐私政策"
            onPress={openPrivacy}
          />
          <Row
            icon="document-text-outline"
            label="免责声明"
            onPress={openDisclaimer}
          />
          <InfoRow label="版本" value={APP_VERSION} />
        </Section>

        <Text style={styles.fineprint}>
          Aimi 不是医疗服务，无法替代专业心理治疗。
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  description,
  destructive,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  description?: string;
  destructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? "#D9544D" : theme.colors.brand}
        style={styles.rowIcon}
      />
      <View style={styles.rowBody}>
        <Text
          style={[
            styles.rowLabel,
            destructive && { color: "#D9544D" },
          ]}
        >
          {label}
        </Text>
        {description ? (
          <Text style={styles.rowDescription}>{description}</Text>
        ) : null}
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.colors.textSubtle}
      />
    </Pressable>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={[styles.row, styles.rowReadonly]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 60,
  },
  section: {
    marginTop: 22,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowPressed: { opacity: 0.6 },
  rowIcon: { marginRight: 12 },
  rowBody: { flex: 1 },
  rowLabel: {
    fontSize: 15,
    color: theme.colors.text,
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
  rowReadonly: {
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  fineprint: {
    marginTop: 36,
    fontSize: 11,
    color: theme.colors.textSubtle,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
