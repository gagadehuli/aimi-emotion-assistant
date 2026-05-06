import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { theme } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <Screen backgroundColor={theme.colors.bg}>
      <View style={styles.settingRow}>
        <View style={{ flex: 1 }} />
        <IconButton style={styles.settingButton}>
          <Ionicons name="settings-outline" size={22} color="#9A5A3A" />
        </IconButton>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300",
              }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="pencil" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>用户</Text>
          <Text style={styles.idText}>ID: 12345</Text>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.innerTabs}>
          <TouchableOpacity style={styles.innerTabActive}>
            <Text style={styles.innerTabTextActive}>作品</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.innerTab}>
            <Text style={styles.innerTabText}>私密</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.innerTab}>
            <Text style={styles.innerTabText}>Aimi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.innerTab}>
            <Text style={styles.innerTabText}>收藏</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.workCard}>
          <View style={styles.workImage}>
            <View style={styles.face}>
              <View style={styles.eyeRow}>
                <View style={styles.eye} />
                <View style={styles.eye} />
              </View>
              <View style={styles.nose} />
              <View style={styles.mouth} />
            </View>

            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.workBottom}>
            <View>
              <Text style={styles.workTitle}>今天的晚霞</Text>
              <Text style={styles.workDesc}>感觉心情被治愈了...</Text>
            </View>

            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#7D6E60" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.emptyCard} />
          <View style={styles.emptyCardDark} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    paddingHorizontal: 18,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  settingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: "#EFE7D8",
  },
  editAvatarButton: {
    position: "absolute",
    right: 10,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E07A4A",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    color: "#5F5146",
    fontWeight: "500",
  },
  idText: {
    marginTop: 6,
    fontSize: 13,
    color: "#8F887B",
  },
  editButton: {
    marginTop: 14,
    paddingHorizontal: 24,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EFE2D2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 14,
    color: "#B76B43",
    fontWeight: "600",
  },
  innerTabs: {
    marginTop: 34,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  innerTab: {
    height: 42,
    justifyContent: "center",
  },
  innerTabActive: {
    height: 42,
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#B76B43",
  },
  innerTabText: {
    fontSize: 15,
    color: "#6F685E",
  },
  innerTabTextActive: {
    fontSize: 15,
    color: "#B76B43",
    fontWeight: "600",
  },
  workCard: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  workImage: {
    height: 178,
    borderRadius: 22,
    backgroundColor: "#B7372D",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  face: {
    width: 124,
    height: 148,
    borderRadius: 54,
    backgroundColor: "#F0B089",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeRow: {
    width: 78,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eye: {
    width: 12,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#2A2523",
  },
  nose: {
    marginTop: 22,
    width: 10,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#C7775B",
  },
  mouth: {
    marginTop: 20,
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6A302A",
  },
  addButton: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#B76B43",
    alignItems: "center",
    justifyContent: "center",
  },
  workBottom: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5F5146",
  },
  workDesc: {
    marginTop: 4,
    fontSize: 12,
    color: "#A59D91",
  },
  twoColumnRow: {
    marginTop: 20,
    flexDirection: "row",
    gap: 14,
  },
  emptyCard: {
    flex: 1,
    height: 150,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    borderWidth: 8,
    borderColor: "#F7F2DD",
  },
  emptyCardDark: {
    flex: 1,
    height: 150,
    borderRadius: 26,
    backgroundColor: "#2B241F",
  },
});