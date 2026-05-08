import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  visible: boolean;
  initialTitle: string;
  onCancel: () => void;
  onSubmit: (title: string) => void;
};

const MAX_LEN = 20;

export function RenameDialog({
  visible,
  initialTitle,
  onCancel,
  onSubmit,
}: Props) {
  const [text, setText] = useState(initialTitle);

  useEffect(() => {
    if (visible) setText(initialTitle);
  }, [initialTitle, visible]);

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable
            style={styles.card}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.title}>重命名</Text>
            <TextInput
              autoFocus
              value={text}
              onChangeText={setText}
              maxLength={MAX_LEN}
              placeholder="输入新的会话名"
              placeholderTextColor={theme.colors.textSubtle}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={() => canSubmit && onSubmit(trimmed)}
            />
            <View style={styles.row}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              >
                <Text style={styles.btnText}>取消</Text>
              </Pressable>
              <View style={styles.rowDivider} />
              <Pressable
                onPress={() => canSubmit && onSubmit(trimmed)}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text
                  style={[
                    styles.btnText,
                    styles.primary,
                    !canSubmit && styles.disabled,
                  ]}
                >
                  确定
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.36)",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingTop: 22,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  input: {
    marginTop: 16,
    marginHorizontal: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bgWarm,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  rowDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPressed: { opacity: 0.6 },
  btnText: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  primary: {
    color: theme.colors.brand,
    fontWeight: "700",
  },
  disabled: { opacity: 0.4 },
});
