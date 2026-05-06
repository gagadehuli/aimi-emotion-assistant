import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "@/constants/theme";
import { storage } from "@/storage";

export default function Index() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const seen = await storage.getOnboardingSeen();
      if (cancelled) return;
      router.replace(seen ? "/chat" : "/onboarding");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgWarm,
    alignItems: "center",
    justifyContent: "center",
  },
});
