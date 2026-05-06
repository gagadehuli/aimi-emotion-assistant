import { ReactNode } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hitSlop?: number;
};

export function IconButton({ onPress, children, style, disabled, hitSlop = 10 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        {
          width: 36,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.65 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

