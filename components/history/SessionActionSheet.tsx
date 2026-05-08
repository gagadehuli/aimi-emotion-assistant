import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  visible: boolean;
  isPinned: boolean;
  onClose: () => void;
  onRename: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
};

const DESTRUCTIVE = "#D9544D";

export function SessionActionSheet({
  visible,
  isPinned,
  onClose,
  onRename,
  onTogglePin,
  onDelete,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { marginBottom: Math.max(insets.bottom, 18) }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Row icon="create-outline" label="重命名" onPress={onRename} />
          <Divider />
          <Row
            icon={isPinned ? "bookmark" : "bookmark-outline"}
            label={isPinned ? "取消置顶" : "置顶"}
            onPress={onTogglePin}
          />
          <Divider />
          <Row
            icon="trash-outline"
            label="删除"
            destructive
            onPress={onDelete}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? DESTRUCTIVE : theme.colors.text}
      />
      <Text
        style={[styles.rowText, destructive && { color: DESTRUCTIVE }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.32)",
    justifyContent: "flex-end",
    paddingHorizontal: 14,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 22,
    gap: 14,
  },
  rowPressed: { opacity: 0.6 },
  rowText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 22,
    backgroundColor: theme.colors.border,
  },
});
