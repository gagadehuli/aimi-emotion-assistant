import { ReactNode, RefObject, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { theme } from "@/constants/theme";
import type { ChatMessage } from "@/types/models";

type Props = {
  messages: ChatMessage[];
  scrollRef?: RefObject<ScrollView | null>;
  header?: ReactNode;
  footer?: ReactNode;
  thinking?: boolean;
};

export function MessageList({
  messages,
  scrollRef,
  header,
  footer,
  thinking,
}: Props) {
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {header}
      {messages.map((m) => (
        <View
          key={m.id}
          style={[
            styles.bubbleBase,
            m.role === "ai" ? styles.aiBubble : styles.userBubble,
          ]}
        >
          <Text style={styles.bubbleText}>{m.text}</Text>
          {m.role === "ai" && m.source === "mock" ? (
            <Text style={styles.localBadge}>本地回复</Text>
          ) : null}
        </View>
      ))}
      {thinking ? (
        <View style={[styles.bubbleBase, styles.aiBubble, styles.thinkingBubble]}>
          <View style={styles.thinkingRow}>
            <Text style={styles.thinkingLabel}>正在听你说</Text>
            <ThinkingDots />
          </View>
        </View>
      ) : null}
      {!thinking && footer ? footer : null}
    </ScrollView>
  );
}

function ThinkingDots() {
  const a = useSharedValue(0.3);
  const b = useSharedValue(0.3);
  const c = useSharedValue(0.3);

  useEffect(() => {
    const cfg = { duration: 600, easing: Easing.inOut(Easing.ease) };
    a.value = withRepeat(withTiming(1, cfg), -1, true);
    const t1 = setTimeout(() => {
      b.value = withRepeat(withTiming(1, cfg), -1, true);
    }, 180);
    const t2 = setTimeout(() => {
      c.value = withRepeat(withTiming(1, cfg), -1, true);
    }, 360);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [a, b, c]);

  const sa = useAnimatedStyle(() => ({ opacity: a.value }));
  const sb = useAnimatedStyle(() => ({ opacity: b.value }));
  const sc = useAnimatedStyle(() => ({ opacity: c.value }));

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, sa]} />
      <Animated.View style={[styles.dot, sb]} />
      <Animated.View style={[styles.dot, sc]} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  bubbleBase: {
    padding: 14,
    marginBottom: 14,
    maxWidth: "84%",
  },
  aiBubble: {
    backgroundColor: theme.colors.accent,
    alignSelf: "flex-start",
    borderRadius: 18,
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: theme.colors.card,
    alignSelf: "flex-end",
    borderRadius: 18,
    borderTopRightRadius: 6,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.text,
  },
  localBadge: {
    marginTop: 6,
    fontSize: 10,
    color: theme.colors.textSubtle,
    opacity: 0.75,
    alignSelf: "flex-end",
  },
  thinkingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  thinkingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  thinkingLabel: {
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.75,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.text,
  },
});
