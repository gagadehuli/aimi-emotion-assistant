import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Screen } from "./ui/Screen";
import { theme } from "./ui/theme";
export default function ChatScreen() {
  const { recordId, date, title } = useLocalSearchParams();

  const isHistoryChat = Boolean(recordId);
  const [inputText, setInputText] = useState("");

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen backgroundColor={theme.colors.bgWarm} style={styles.containerSafe} withHorizontalPadding={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push("/(tabs)/history")}>
            <Text style={styles.menu}>☰</Text>
          </Pressable>

          <Text style={styles.logo}>Aimi</Text>

          <View style={{ width: 32 }} />
        </View>

        <ScrollView style={styles.chatArea} showsVerticalScrollIndicator={false}>
          {isHistoryChat ? (
            <View style={styles.historyTitleBox}>
              <Text style={styles.historyDate}>{date}</Text>
              <Text style={styles.historyTitle}>{title}</Text>
            </View>
          ) : (
            <View style={styles.circle} />
          )}

          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>
              {isHistoryChat
                ? "这是你当时和 Aimi 的对话记录。"
                : "你好！我是 Aimi，今天很高兴见到你。在开始对话之前，你现在感觉怎么样？"}
            </Text>
          </View>

          <View style={styles.userBubble}>
            <Text style={styles.userText}>
              {isHistoryChat
                ? "老实说，那天我确实感觉压力有点大，脑子里有很多事情。"
                : "老实说，我感觉有点不知所措。现在我脑子里有很多事情。"}
            </Text>
          </View>

          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>
              {isHistoryChat
                ? "我记得你那天主要是在担心任务太多，但你也在努力把事情拆开处理。"
                : "我理解。当生活没有按计划进行时，感到不知所措是很正常的。"}
            </Text>
          </View>
        </ScrollView>
        
       
        {!isHistoryChat && (
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={inputText} 
              onChangeText={setInputText} 
              placeholder="分享一下你的感受..."
              placeholderTextColor="#9B8276"
              multiline={true} // 允许多行输入
            />
            <Pressable 
              style={[
                styles.sendButton, 
                !inputText.trim() && styles.sendButtonDisabled // 内容为空时触发禁用样式
              ]}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>发送</Text>
            </Pressable>
          </View>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerSafe: {
    paddingHorizontal: 20,
  },
  chatArea: {
    flex: 1, // 核心：让 ScrollView 撑满头部和输入框之间的剩余空间
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // 让按钮和输入框底部对齐
    paddingTop: 12,
    paddingBottom: 32, // 核心：处理 iPhone 底部小白条的安全距离
    backgroundColor: "#FAF7ED",
    borderTopWidth: 1,
    borderTopColor: "#EADDD7",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 40,
    maxHeight: 100, // 核心：限制最大高度，超出会自动内部滚动
    fontSize: 15,
    color: "#5A342A",
  },
  sendButton: {
    backgroundColor: "#A45E43",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 12,
    marginBottom: 2, 
  },
  sendButtonDisabled: {
    backgroundColor: "#D3C4BE", // 禁用状态的颜色
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menu: {
    fontSize: 24,
    color: "#A45E43",
  },
  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#A45E43",
  },
  circle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#F4B79E",
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 60,
  },
  historyTitleBox: {
    alignItems: "center",
    marginTop: 44,
    marginBottom: 46,
  },
  historyDate: {
    fontSize: 14,
    color: "#9B8276",
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5A342A",
  },
  aiBubble: {
    backgroundColor: "#FFA07A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    alignSelf: "flex-start",
    maxWidth: "88%",
  },
  aiText: {
    color: "#5A342A",
    fontSize: 15,
    lineHeight: 24,
  },
  userBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    alignSelf: "flex-end",
    maxWidth: "88%",
  },
  userText: {
    color: "#5A342A",
    fontSize: 15,
    lineHeight: 24,
  },
});