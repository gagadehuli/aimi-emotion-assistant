import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  withHorizontalPadding?: boolean;
  topEdge?: boolean;
};

export function Screen({
  children,
  style,
  backgroundColor = theme.colors.bg,
  withHorizontalPadding = false,
  topEdge = true,
}: Props) {
  const edges = topEdge
    ? (["top", "left", "right"] as const)
    : (["left", "right"] as const);
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]} edges={edges}>
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal: withHorizontalPadding ? theme.spacing.xl : 0,
          },
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
