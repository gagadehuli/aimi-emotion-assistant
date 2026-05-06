import { ReactNode } from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { theme } from "./theme";

type Props = {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  border?: boolean;
};

export function AppHeader({ title, left, right, style, titleStyle, border = true }: Props) {
  return (
    <View
      style={[
        {
          height: 56,
          paddingHorizontal: theme.spacing.lg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: border ? 1 : 0,
          borderBottomColor: theme.colors.border,
        },
        style,
      ]}
    >
      <View style={{ width: 40, alignItems: "flex-start" }}>{left}</View>
      <Text
        numberOfLines={1}
        style={[
          {
            fontSize: theme.typography.header,
            fontWeight: "600",
            color: theme.colors.brand,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
      <View style={{ width: 40, alignItems: "flex-end" }}>{right}</View>
    </View>
  );
}

