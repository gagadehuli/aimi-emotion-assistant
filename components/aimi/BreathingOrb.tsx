import { useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { theme } from "@/constants/theme";

type Props = {
  size?: number;
  color?: string;
  haloColor?: string;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

export function BreathingOrb({
  size = 130,
  color = theme.colors.accent,
  haloColor = theme.colors.accentSoft,
  duration = 2400,
  style,
}: Props) {
  const scale = useSharedValue(0.96);
  const halo = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.06, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
    halo.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [duration, halo, scale]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: halo.value * 0.55,
    transform: [{ scale: 1 + halo.value * 0.32 }],
  }));

  const containerSize = size * 1.6;

  return (
    <View
      style={[
        {
          width: containerSize,
          height: containerSize,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.layer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: haloColor,
          },
          haloStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.layer,
          styles.orbShadow,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          orbStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
  },
  orbShadow: {
    shadowColor: "#F4B79E",
    shadowOpacity: 0.55,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});
