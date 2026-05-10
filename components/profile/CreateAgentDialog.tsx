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
  onCancel: () => void;
  onSubmit: (input: { name: string; intro: string }) => void;
};

const NAME_MAX = 16;
const INTRO_MAX = 200;

export function CreateAgentDialog({ visible, onCancel, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");

  useEffect(() => {
    if (visible) {
      setName("");
      setIntro("");
    }
  }, [visible]);

  const trimmedName = name.trim();
  const trimmedIntro = intro.trim();
  const canSubmit = trimmedName.length > 0 && trimmedIntro.length > 0;

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
            <Text style={styles.title}>创建一个智能体</Text>
            <Text style={styles.hint}>给它一个名字和性格，让它陪你说话</Text>

            <Text style={styles.label}>名字</Text>
            <TextInput
              autoFocus
              value={name}
              onChangeText={setName}
              maxLength={NAME_MAX}
              placeholder="例如 同班晴儿"
              placeholderTextColor={theme.colors.textSubtle}
              style={styles.input}
              returnKeyType="next"
            />

            <Text style={styles.label}>人格 / 简介</Text>
            <TextInput
              value={intro}
              onChangeText={setIntro}
              maxLength={INTRO_MAX}
              placeholder="她是怎样一个人？什么时候会出现？"
              placeholderTextColor={theme.colors.textSubtle}
              style={[styles.input, styles.multiline]}
              multiline
            />

            <View style={styles.btnRow}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.btnText}>取消</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                onPress={() =>
                  canSubmit &&
                  onSubmit({ name: trimmedName, intro: trimmedIntro })
                }
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
                  创建
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
    paddingHorizontal: 28,
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
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  label: {
    marginTop: 16,
    marginHorizontal: 22,
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  input: {
    marginTop: 6,
    marginHorizontal: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bgWarm,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  btnRow: {
    marginTop: 20,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  divider: {
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
