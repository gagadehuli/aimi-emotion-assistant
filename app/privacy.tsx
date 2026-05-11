import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/common/AppHeader";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";

export default function PrivacyScreen() {
  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="隐私政策"
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
        <Text style={styles.intro}>
          Aimi 是个人作品集 / MVP 阶段的 App。下面这份说明会尽量讲清楚，
          你和 Aimi 聊的内容会发生什么、不会发生什么。
        </Text>

        <Section title="数据存在哪里">
          <Para>
            • 你的聊天、情绪记录、树洞内容、智能体配置都用 SQLite
            存储在你这台设备上，文件名 <Code>aimi.db</Code>。
          </Para>
          <Para>
            • 当前没有云端账号，没有云端数据库。你换设备后这些数据不会跟着走。
          </Para>
          <Para>
            • 你随时可以在「设置 → 清除本地数据」里把全部内容删掉，
            清除是不可恢复的。清除后种子内容也不会再回来。
          </Para>
        </Section>

        <Section title="AI 回复怎么处理">
          <Para>
            • 你发的消息会被发送到一个由我自己运行的本地后端（aimi-server），
            后端再请求 Google Gemini API，拿到回复后转给你的 App。
          </Para>
          <Para>
            • Gemini API Key 只保存在后端的 <Code>server/.env</Code> 文件里，
            前端 App 永远拿不到这个 key。
          </Para>
          <Para>
            • 后端会读取你最近 10 条消息（用户与 AI 的来回），用来给 Gemini
            提供上下文。不会上传到任何第三方分析平台。
          </Para>
          <Para>
            • 没有配置后端时，App 走本地 mock 兜底，根本不发任何网络请求。
          </Para>
        </Section>

        <Section title="安全分级会做什么">
          <Para>
            • 当你的消息匹配到自伤 / 危机相关的关键词，App 不会调用 AI，
            而是直接回复一段固定的安全模板，建议你联系身边可信任的人或
            当地紧急服务。
          </Para>
          <Para>
            • 这条规则在客户端和后端都跑一遍，确保即使断网也能给到安全模板，
            而不是随机的本地回复。
          </Para>
          <Para>
            • Aimi 不是医疗服务，安全模板只是引导你寻求现实帮助，
            不能替代心理咨询或紧急救助。详见「免责声明」。
          </Para>
        </Section>

        <Section title="不会做的事">
          <Para>• 不收集你的真实姓名、手机号、邮箱、定位等个人信息。</Para>
          <Para>• 不分享聊天内容到任何第三方应用、广告或分析服务。</Para>
          <Para>• 不卖你的数据。</Para>
          <Para>• 不做用户画像 / 精准推送。</Para>
        </Section>

        <Section title="如果你有疑问">
          <Para>
            这是个人作品集项目，目前没有客服。可以在 GitHub
            仓库提 issue，或直接联系仓库 owner。
          </Para>
        </Section>

        <Text style={styles.footer}>
          本说明随作品集版本可能更新。最新版本请以 GitHub 仓库为准。
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
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <Text style={styles.para}>{children}</Text>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <Text style={styles.code}>{children}</Text>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 60,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textMuted,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.brandDeep,
    marginBottom: 10,
  },
  sectionBody: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  para: {
    fontSize: 13,
    lineHeight: 22,
    color: theme.colors.text,
    marginBottom: 6,
  },
  code: {
    fontFamily: "Courier",
    fontSize: 12,
    color: theme.colors.brandDeep,
    backgroundColor: theme.colors.bgWarm,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  footer: {
    marginTop: 30,
    fontSize: 11,
    color: theme.colors.textSubtle,
    textAlign: "center",
  },
});
