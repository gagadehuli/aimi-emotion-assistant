import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BreathingOrb } from "@/components/aimi/BreathingOrb";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";
import {
  MOCK_AI_REPLIES,
  MOCK_CHAT_SESSIONS,
  type ChatMessage,
} from "@/mocks";

let localIdCounter = 1;
function nextId() {
  localIdCounter += 1;
  return `local_${localIdCounter}`;
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    recordId?: string;
    date?: string;
    title?: string;
  }>();

  const seedSession = useMemo(() => {
    if (!params.recordId) return null;
    return MOCK_CHAT_SESSIONS[params.recordId] ?? null;
  }, [params.recordId]);

  const [messages, setMessages] = useState<ChatMessage[]>(
    seedSession ? seedSession.messages : [],
  );
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setMessages(seedSession ? seedSession.messages : []);
    setInputText("");
  }, [params.recordId, seedSession]);

  const scrollRef = useRef<ScrollView>(null);
  const orbOffset = useSharedValue(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, () => {
      orbOffset.value = withTiming(-50, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      orbOffset.value = withTiming(0, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [orbOffset]);

  const orbAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: orbOffset.value }],
  }));

  function send() {
    const text = inputText.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: nextId(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
    setTimeout(() => {
      const reply =
        MOCK_AI_REPLIES[Math.floor(Math.random() * MOCK_AI_REPLIES.length)];
      const aiMsg: ChatMessage = {
        id: nextId(),
        role: "ai",
        text: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true }),
      );
    }, 700);
  }

  const isHistory = Boolean(seedSession);
  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        backgroundColor={theme.colors.bgWarm}
        withHorizontalPadding={false}
      >
        <View style={styles.header}>
          <IconButton onPress={() => router.push("/(tabs)/history")}>
            <Ionicons
              name="reorder-two-outline"
              size={26}
              color={theme.colors.brand}
            />
          </IconButton>
          <Text style={styles.logo}>Aimi</Text>
          <IconButton onPress={() => router.replace("/chat")}>
            <Ionicons
              name="create-outline"
              size={22}
              color={theme.colors.brand}
            />
          </IconButton>
        </View>

        {isEmpty ? (
          <View style={styles.emptyWrap}>
            <Animated.View style={orbAnim}>
              <BreathingOrb size={180} />
            </Animated.View>
            <Animated.Text style={[styles.emptyHint, orbAnim]}>
              说点什么吧，{"\n"}Aimi 在听。
            </Animated.Text>
          </View>
        ) : (
          <MessageList
            scrollRef={scrollRef}
            messages={messages}
            header={
              isHistory ? (
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{params.date}</Text>
                  <Text style={styles.historyTitle}>{params.title}</Text>
                  <Text style={styles.historyHint}>
                    可以接着这段对话继续聊。
                  </Text>
                </View>
              ) : null
            }
          />
        )}

        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={send}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    height: 50,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.colors.brandDeep,
    letterSpacing: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHint: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  historyHeader: {
    alignItems: "center",
    marginTop: 26,
    marginBottom: 24,
    paddingHorizontal: theme.spacing.xl,
  },
  historyDate: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  historyHint: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
});
