import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "./ui/Screen";
import { theme } from "./ui/theme";

export default function WelcomeScreen() {
  return (
    <Screen backgroundColor={theme.colors.bgWarm} withHorizontalPadding={false}>
      <View style={styles.container}>
        <View style={styles.circle} />

        <Text style={styles.title}>你好，我是 Aimi。</Text>
        <Text style={styles.subtitle}>告诉我任何事。</Text>

        <Pressable style={styles.button} onPress={() => router.replace("/chat")}>
          <Text style={styles.buttonText}>进入</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: theme.colors.accent,
    marginBottom: 90,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 20,
    color: "#89766D",
    marginBottom: 90,
  },
  button: {
    width: 150,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: theme.colors.brandDeep,
    fontSize: 22,
    fontWeight: "600",
  },
});