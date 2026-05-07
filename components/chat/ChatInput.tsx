import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

type Props = {
  value: string;
  onChange: (s: string) => void;
  onSend: () => void;
};

export function ChatInput({ value, onChange, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const canSend = value.trim().length > 0;
  return (
    <View
      style={[
        styles.row,
        { paddingBottom: Math.max(14, insets.bottom + 8) },
      ]}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="分享一下你的感受..."
        placeholderTextColor={theme.colors.textSubtle}
        multiline
      />
      <Pressable
        onPress={canSend ? onSend : undefined}
        disabled={!canSend}
        style={[styles.send, !canSend && styles.sendDisabled]}
      >
        <Text style={styles.sendText}>发送</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.bgWarm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    minHeight: 44,
    maxHeight: 120,
    fontSize: 15,
    color: theme.colors.text,
  },
  send: {
    backgroundColor: theme.colors.brandDeep,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginLeft: 12,
  },
  sendDisabled: { backgroundColor: theme.colors.disabled },
  sendText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});
