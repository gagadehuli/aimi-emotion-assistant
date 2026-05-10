import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryPill } from "@/components/common/PrimaryPill";
import { Screen } from "@/components/common/Screen";
import { CategoryTabs } from "@/components/treehole/CategoryTabs";
import { CreatePostDialog } from "@/components/treehole/CreatePostDialog";
import { DiscoveryGrid } from "@/components/treehole/DiscoveryGrid";
import { theme } from "@/constants/theme";
import { TREEHOLE_CATEGORIES, TREEHOLE_POST_CATEGORIES } from "@/mocks";
import { storage } from "@/storage";
import type { TreePost } from "@/types/models";

export default function TreeholeScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string>(TREEHOLE_CATEGORIES[0]);
  const [posts, setPosts] = useState<TreePost[]>([]);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async (cat: string) => {
    const filter = cat === "发现" ? undefined : { category: cat };
    const list = await storage.listTreePosts(filter);
    setPosts(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const filter = active === "发现" ? undefined : { category: active };
        const list = await storage.listTreePosts(filter);
        if (!cancelled) setPosts(list);
      })();
      return () => {
        cancelled = true;
      };
    }, [active]),
  );

  function selectCategory(c: string) {
    setActive(c);
  }

  function openCreate() {
    setCreating(true);
  }

  async function onCreate(input: {
    title: string;
    content: string;
    category: string;
  }) {
    setCreating(false);
    await storage.createTreePost({
      title: input.title,
      content: input.content,
      category: input.category,
      authorAlias: "我",
    });
    // 创建后跳到对应分类，让用户立刻看到自己的内容
    setActive(input.category);
    await refresh(input.category);
  }

  async function onLike(post: TreePost) {
    const updated = await storage.toggleTreePostLike(post.id);
    if (!updated) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  }

  function onLongPress(post: TreePost) {
    Alert.alert(
      "删除这条内容？",
      `「${post.title}」会被永久删除，且不可恢复。`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            await storage.deleteTreePost(post.id);
            await refresh(active);
          },
        },
      ],
    );
  }

  return (
    <View style={styles.root}>
      <Screen backgroundColor={theme.colors.bg}>
        <CategoryTabs
          categories={TREEHOLE_CATEGORIES}
          active={active}
          onSelect={selectCategory}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DiscoveryGrid
            posts={posts}
            onLike={onLike}
            onLongPress={onLongPress}
          />
        </ScrollView>
      </Screen>

      <View
        style={[styles.fabWrap, { bottom: 62 + insets.bottom + 14 }]}
      >
        <PrimaryPill icon="sparkles" label="开始创作" onPress={openCreate} />
      </View>

      <CreatePostDialog
        visible={creating}
        categories={TREEHOLE_POST_CATEGORIES}
        onCancel={() => setCreating(false)}
        onSubmit={onCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 180,
  },
  fabWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
    zIndex: 100,
    elevation: 12,
  },
});
