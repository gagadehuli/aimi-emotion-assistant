import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BreathingOrb } from "@/components/aimi/BreathingOrb";
import { theme } from "@/constants/theme";
import { storage } from "@/storage";
import { Screen } from "@/components/common/Screen";

export default function OnboardingScreen() {
  async function start() {
    await storage.setOnboardingSeen(true);
    router.replace("/chat");
  }

  return (
    <Screen backgroundColor={theme.colors.bgWarm} withHorizontalPadding={false}>
      <View style={styles.container}>
        <BreathingOrb size={140} />

        <Text style={styles.brand}>Aimi · 艾米</Text>
        <Text style={styles.tagline}>
          陪你说说话，{"\n"}也帮你记住每一种心情。
        </Text>

        <Pressable style={styles.button} onPress={start}>
          <Text style={styles.buttonText}>开始</Text>
        </Pressable>

        <Text style={styles.fineprint}>
          Aimi 不是医疗服务，无法替代专业心理治疗。
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brand: {
    marginTop: 56,
    fontSize: 30,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  button: {
    marginTop: 64,
    width: 168,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.brandDeep,
    fontSize: 20,
    fontWeight: "600",
  },
  fineprint: {
    position: "absolute",
    bottom: 32,
    fontSize: 11,
    color: theme.colors.textSubtle,
    textAlign: "center",
  },
});
