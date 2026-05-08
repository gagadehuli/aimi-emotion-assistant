import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { replyTo } from "@/services/ai";
import { storage } from "@/storage";
import type { ChatMessage } from "@/types/models";

function deriveTitle(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "今天的对话";
  if (trimmed.length <= 12) return trimmed;
  return trimmed.slice(0, 12) + "…";
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{ recordId?: string }>();
  const recordId = params.recordId;

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyTitle, setHistoryTitle] = useState<string | null>(null);
  const [historyDate, setHistoryDate] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const sendingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (!recordId) {
      setCurrentSessionId(null);
      setMessages([]);
      setHistoryTitle(null);
      setHistoryDate(null);
      setInputText("");
      setIsThinking(false);
      return;
    }
    (async () => {
      const result = await storage.getSession(recordId);
      if (cancelled) return;
      if (!result) {
        setCurrentSessionId(null);
        setMessages([]);
        setHistoryTitle(null);
        setHistoryDate(null);
        return;
      }
      setCurrentSessionId(result.session.id);
      setMessages(result.messages);
      setHistoryTitle(result.session.title);
      setHistoryDate(formatDate(result.session.updatedAt));
      setInputText("");
    })();
    return () => {
      cancelled = true;
    };
  }, [recordId]);

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

  async function send() {
    if (sendingRef.current) return;
    const text = inputText.trim();
    if (!text) return;
    sendingRef.current = true;
    setInputText("");

    try {
      let sid = currentSessionId;
      if (!sid) {
        const session = await storage.createSession(deriveTitle(text));
        sid = session.id;
        setCurrentSessionId(sid);
      }
      const userMsg = await storage.appendMessage(sid, "user", text);
      setMessages((prev) => [...prev, userMsg]);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true }),
      );

      setIsThinking(true);
      try {
        const reply = await replyTo([...messages, userMsg]);
        const aiMsg = await storage.appendMessage(
          sid,
          "ai",
          reply.text,
          reply.source,
        );
        setMessages((prev) => [...prev, aiMsg]);
        requestAnimationFrame(() =>
          scrollRef.current?.scrollToEnd({ animated: true }),
        );
      } finally {
        setIsThinking(false);
      }
    } finally {
      sendingRef.current = false;
    }
  }

  const isHistory = Boolean(recordId);
  const isEmpty = messages.length === 0 && !isThinking;

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
            thinking={isThinking}
            header={
              isHistory && historyTitle ? (
                <View style={styles.historyHeader}>
                  {historyDate ? (
                    <Text style={styles.historyDate}>{historyDate}</Text>
                  ) : null}
                  <Text style={styles.historyTitle}>{historyTitle}</Text>
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
          disabled={isThinking}
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
