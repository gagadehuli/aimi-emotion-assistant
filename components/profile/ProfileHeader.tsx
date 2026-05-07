import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/common/IconButton";
import { theme } from "@/constants/theme";
import { MOCK_PROFILE } from "@/mocks";

type Props = {
  onEdit?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
};

const COVER_HEIGHT = 200;

export function ProfileHeader({ onEdit, onShare, onSettings }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={[styles.cover, { height: COVER_HEIGHT + insets.top }]}>
        <View style={styles.deco1} />
        <View style={styles.deco2} />
        <View style={styles.deco3} />
        <View style={styles.coverShade} />
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <View style={styles.flex} />
          <Pressable
            onPress={onShare}
            style={({ pressed }) => [styles.sharePill, pressed && styles.pressed]}
          >
            <Ionicons name="share-social-outline" size={14} color="#FFFFFF" />
            <Text style={styles.shareText}>分享</Text>
          </Pressable>
          <IconButton onPress={onSettings}>
            <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          </IconButton>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarChar}>
              {MOCK_PROFILE.name.slice(-1)}
            </Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.name}>{MOCK_PROFILE.name}</Text>
            <Text style={styles.idText}>{MOCK_PROFILE.id}</Text>
          </View>
          <Pressable
            onPress={onEdit}
            style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
          >
            <Text style={styles.editText}>编辑资料</Text>
          </Pressable>
        </View>

        <Text style={styles.bio}>{MOCK_PROFILE.bio}</Text>

        <View style={styles.tagRow}>
          {MOCK_PROFILE.tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Stat label="关注" value={MOCK_PROFILE.stats.follow} />
          <Stat label="粉丝" value={MOCK_PROFILE.stats.fans} />
          <Stat label="获赞与收藏" value={MOCK_PROFILE.stats.likes} />
        </View>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cover: {
    backgroundColor: theme.colors.brandDeep,
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: -30,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.accent,
    opacity: 0.55,
  },
  deco2: {
    position: "absolute",
    bottom: -60,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.colors.accentSoft,
    opacity: 0.35,
  },
  deco3: {
    position: "absolute",
    top: 60,
    left: 90,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    opacity: 0.18,
  },
  coverShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: "rgba(40,20,10,0.28)",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sharePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: theme.radius.pill,
    gap: 4,
  },
  shareText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  pressed: { opacity: 0.85 },

  body: {
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  avatarWrap: {
    marginTop: -48,
    alignItems: "flex-start",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.accent,
    borderWidth: 4,
    borderColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarChar: {
    fontSize: 36,
    fontWeight: "700",
    color: theme.colors.card,
  },
  headerRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  idText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
  editBtn: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  editText: {
    fontSize: 13,
    color: theme.colors.brand,
    fontWeight: "600",
  },

  bio: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.textMuted,
  },
  tagRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.bgWarm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  statsRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 28,
  },
  statItem: { alignItems: "flex-start" },
  statValue: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: theme.colors.textSubtle,
  },
});
