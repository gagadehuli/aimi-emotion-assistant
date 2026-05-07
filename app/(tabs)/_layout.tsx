import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

const tabTheme = {
  active: theme.colors.brand,
  inactive: "#807A6D",
  bg: theme.colors.bg,
  border: theme.colors.borderStrong,
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      initialRouteName="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabTheme.active,
        tabBarInactiveTintColor: tabTheme.inactive,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(10, insets.bottom),
          backgroundColor: "rgba(255,253,243,0.94)",
          borderTopWidth: 1,
          borderTopColor: tabTheme.border,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: "对话",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="weekly"
        options={{
          title: "周报",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="treehole"
        options={{
          title: "树洞",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
