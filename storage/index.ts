import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ONBOARDING_SEEN: "aimi.onboarding.seen",
} as const;

export const storage = {
  async getOnboardingSeen(): Promise<boolean> {
    const v = await AsyncStorage.getItem(KEYS.ONBOARDING_SEEN);
    return v === "1";
  },
  async setOnboardingSeen(seen: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDING_SEEN, seen ? "1" : "0");
  },
};
