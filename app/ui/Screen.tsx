import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "./theme";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  withHorizontalPadding?: boolean;
};

export function Screen({
  children,
  style,
  backgroundColor = theme.colors.bg,
  withHorizontalPadding = false,
}: Props) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]} edges={["top", "left", "right"]}>
      <View style={[{ flex: 1, paddingHorizontal: withHorizontalPadding ? theme.spacing.xl : 0 }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

