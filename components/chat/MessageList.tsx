import { ReactNode, RefObject } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import type { ChatMessage } from "@/mocks";

type Props = {
  messages: ChatMessage[];
  scrollRef?: RefObject<ScrollView | null>;
  header?: ReactNode;
};

export function MessageList({ messages, scrollRef, header }: Props) {
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
        </View>
      ))}
    </ScrollView>
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
});
