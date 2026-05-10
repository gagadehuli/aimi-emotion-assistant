import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  visible: boolean;
  categories: string[];
  onCancel: () => void;
  onSubmit: (input: {
    title: string;
    content: string;
    category: string;
  }) => void;
};

const TITLE_MAX = 30;
const CONTENT_MAX = 500;

export function CreatePostDialog({
  visible,
  categories,
  onCancel,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>(categories[0] ?? "");

  useEffect(() => {
    if (visible) {
      setTitle("");
      setContent("");
      setCategory(categories[0] ?? "");
    }
  }, [visible, categories]);

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const canSubmit =
    trimmedTitle.length > 0 && trimmedContent.length > 0 && category.length > 0;

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
            <Text style={styles.title}>开始创作</Text>

            <Text style={styles.label}>标题</Text>
            <TextInput
              autoFocus
              value={title}
              onChangeText={setTitle}
              maxLength={TITLE_MAX}
              placeholder="一句话概括你的心情或灵感"
              placeholderTextColor={theme.colors.textSubtle}
              style={styles.input}
              returnKeyType="next"
            />

            <Text style={styles.label}>内容</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              maxLength={CONTENT_MAX}
              placeholder="写下你想分享的事，没人会评判"
              placeholderTextColor={theme.colors.textSubtle}
              style={[styles.input, styles.multiline]}
              multiline
            />

            <Text style={styles.label}>分类</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {categories.map((c) => {
                const active = c === category;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

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
                  onSubmit({
                    title: trimmedTitle,
                    content: trimmedContent,
                    category,
                  })
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
                  发布
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
    paddingHorizontal: 24,
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
  label: {
    marginTop: 14,
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
    minHeight: 90,
    textAlignVertical: "top",
  },
  chipRow: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.bgWarm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  chipText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  chipTextActive: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  btnRow: {
    marginTop: 18,
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
