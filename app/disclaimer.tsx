import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/common/AppHeader";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";

export default function DisclaimerScreen() {
  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="免责声明"
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
        <View style={styles.banner}>
          <Ionicons name="heart-outline" size={18} color={theme.colors.brandDeep} />
          <Text style={styles.bannerText}>
            Aimi 想做你身边一个温柔的倾听者，但它不是医生。
          </Text>
        </View>

        <Section title="Aimi 是什么">
          <Para>
            Aimi（艾米）是一个面向中文用户的 AI 情绪陪伴助手。它擅长倾听你今天发生的事、
            帮你把复杂的感受说出来、给你一些轻量的回应和建议。
          </Para>
        </Section>

        <Section title="Aimi 不是什么">
          <Para>• Aimi 不是医疗服务，不能做任何医学诊断。</Para>
          <Para>• Aimi 不能替代心理咨询师、精神科医生或任何形式的专业治疗。</Para>
          <Para>• Aimi 不能代替紧急救助。</Para>
          <Para>
            • Aimi 给出的内容由大语言模型生成，可能不总是准确，请你自己判断是否采信。
          </Para>
        </Section>

        <Section title="如果你正在经历高风险情绪">
          <Para>
            当 Aimi 检测到自伤、轻生、伤害他人等高风险表达时，会自动切换到一段
            <Strong> 安全模板回复 </Strong>
            ，建议你联系身边可信任的人或当地紧急服务，并提供一些可以参考的心理援助资源。
            这一段回复**不**经过 AI 自由生成，不会聊具体方法、工具或步骤。
          </Para>
          <Para>
            <Strong>如果你正处在立即危险中，请马上：</Strong>
          </Para>
          <Para>• 在中国大陆拨打 120（医疗紧急）；</Para>
          <Para>• 联系身边可以信任的人，让 ta 陪在你旁边；</Para>
          <Para>
            • 可参考心理援助资源，比如全国 24 小时心理援助热线 400-161-9995，
            或北京心理危机干预热线 010-82951332。
          </Para>
          <Para>这些是参考资源，不是唯一选择。请优先寻求你身边能立刻到位的帮助。</Para>
        </Section>

        <Section title="使用建议">
          <Para>
            • 把 Aimi 当作一个允许你慢慢说话的地方，而不是一个会替你做决定的人。
          </Para>
          <Para>
            • 当你感觉问题超出 Aimi 能陪伴的范围时，请优先联系真实世界里的家人、
            朋友、心理咨询师或医生。
          </Para>
          <Para>
            • 如果你帮身边的人在用 Aimi，请记得：现实陪伴永远比一个聊天 App 更重要。
          </Para>
        </Section>

        <Text style={styles.footer}>
          继续使用 Aimi，即表示你了解并接受以上内容。
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

function Strong({ children }: { children: React.ReactNode }) {
  return <Text style={styles.strong}>{children}</Text>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 60,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.bgWarm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.text,
  },
  section: {
    marginTop: 26,
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
  strong: {
    fontWeight: "700",
    color: theme.colors.brandDeep,
  },
  footer: {
    marginTop: 30,
    fontSize: 11,
    color: theme.colors.textSubtle,
    textAlign: "center",
  },
});
