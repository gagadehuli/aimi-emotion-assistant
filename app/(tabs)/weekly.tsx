import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../ui/AppHeader";
import { IconButton } from "../ui/IconButton";
import { Screen } from "../ui/Screen";
import { theme } from "../ui/theme";

const bars = [
  { label: "一", height: 54, color: "#E8E8C8" },
  { label: "二", height: 72, color: "#F1D9C4" },
  { label: "三", height: 44, color: "#FF9F75" },
  { label: "四", height: 104, color: "#B67855" },
  { label: "五", height: 66, color: "#F2E1CE" },
  { label: "六", height: 82, color: "#E7EBCF" },
  { label: "日", height: 62, color: "#EAF0D3" },
];

export default function WeeklyScreen() {
  return (
    <Screen backgroundColor={theme.colors.bg}>
      <AppHeader
        title="周报"
        left={
          <IconButton>
            <Ionicons name="menu-outline" size={24} color={theme.colors.brand} />
          </IconButton>
        }
        right={<View style={styles.avatar} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.weekText}>10月第3周</Text>
        <Text style={styles.title}>你的心流{"\n"}报告已生成</Text>
        <Text style={styles.desc}>
          这周你体验了更多的平静，{"\n"}情绪波动如同温柔的海浪。
        </Text>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>情绪波浪图</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+12% 平静</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {bars.map((bar) => (
              <View key={bar.label} style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: bar.height,
                      backgroundColor: bar.color,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallEmoji}>🌤️</Text>
            <Text style={styles.smallTitle}>本周关键词</Text>
            <Text style={styles.smallText}>平静、修复、期待</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallEmoji}>🍊</Text>
            <Text style={styles.smallTitle}>Aimi 建议</Text>
            <Text style={styles.smallText}>给自己一个慢下来的晚上</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#5D6B6A",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 38,
    paddingBottom: 120,
  },
  weekText: {
    fontSize: 12,
    color: "#8F887B",
    textAlign: "center",
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "500",
    color: "#B76B43",
    textAlign: "center",
  },
  desc: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 22,
    color: "#7D7669",
    textAlign: "center",
  },
  chartCard: {
    marginTop: 86,
    padding: 20,
    height: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9A5A3A",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#FFB083",
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chartArea: {
    flex: 1,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 28,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  barLabel: {
    marginTop: 10,
    fontSize: 12,
    color: "#9C9385",
  },
  summaryRow: {
    marginTop: 54,
    flexDirection: "row",
    gap: 14,
  },
  smallCard: {
    flex: 1,
    minHeight: 116,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  smallEmoji: {
    fontSize: 26,
  },
  smallTitle: {
    marginTop: 10,
    fontSize: 13,
    color: "#9A5A3A",
    fontWeight: "600",
  },
  smallText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#7C7568",
  },
});