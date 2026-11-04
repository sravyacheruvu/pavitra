import { useState, useRef, useEffect } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { veranda } from "../theme/colors";
import { useLang, useT, pick } from "../i18n";
import { answerLocally, askBackend, SUGGESTIONS } from "../services/assistant";

/**
 * "Ask Pavitra" — a lightweight chat for on-the-go pooja questions (item
 * substitutions, the significance of a ritual). It tries an optional server
 * backend first, then answers from the trust-safe on-device knowledge base.
 */
type Msg = { role: "user" | "pavitra"; text: string };

export function AskAssistant({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context?: string;
}) {
  const { lang } = useLang();
  const t = useT();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (open) setMessages([]);
  }, [open]);

  const send = async (qRaw?: string) => {
    const q = (qRaw ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    let answer: string | null = null;
    try {
      answer = await askBackend(q, context);
    } catch {
      answer = null;
    }
    if (!answer) answer = pick(answerLocally(q, context), lang);
    setMessages((m) => [...m, { role: "pavitra", text: answer as string }]);
    setBusy(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-veranda-parchment">
        {/* Header */}
        <View className="flex-row items-center border-b border-veranda-brass/25 bg-veranda-teak px-4 py-3">
          <Ionicons name="sparkles" size={18} color={veranda.brass} />
          <Text className="ml-2 flex-1 font-display text-lg font-bold text-veranda-brass">
            {t("askPavitra")}
          </Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={veranda.brass} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView ref={scrollRef} className="flex-1 px-4" contentContainerStyle={{ paddingVertical: 14, gap: 10 }}>
            {messages.length === 0 ? (
              <View>
                <Text className="mb-1 text-[13px] text-veranda-teakSubtle">{t("askIntro")}</Text>
                <View className="mt-2" style={{ gap: 8 }}>
                  {SUGGESTIONS.map((s, i) => (
                    <Pressable
                      key={i}
                      onPress={() => send(s.q)}
                      className="self-start rounded-full border border-veranda-brass/30 bg-white px-3 py-2"
                    >
                      <Text className="text-[13px] text-veranda-teak">{s.q}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {messages.map((m, i) => (
              <View
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                  m.role === "user"
                    ? "self-end bg-veranda-coral"
                    : "self-start border border-veranda-brass/20 bg-white"
                }`}
              >
                <Text className={`text-[14px] leading-5 ${m.role === "user" ? "text-white" : "text-veranda-teak"}`}>
                  {m.text}
                </Text>
              </View>
            ))}
            {busy ? (
              <View className="self-start rounded-2xl border border-veranda-brass/20 bg-white px-3.5 py-2.5">
                <ActivityIndicator color={veranda.coral} />
              </View>
            ) : null}
          </ScrollView>

          {/* Input bar */}
          <View className="flex-row items-center border-t border-veranda-brass/20 bg-white px-3 py-2" style={{ gap: 8 }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => send()}
              placeholder={t("askPlaceholder")}
              placeholderTextColor="#b8a898"
              returnKeyType="send"
              className="flex-1 rounded-full border border-veranda-brass/30 bg-veranda-parchment px-4 py-2.5 text-[15px] text-veranda-teak"
            />
            <Pressable
              onPress={() => send()}
              disabled={busy}
              className="h-10 w-10 items-center justify-center rounded-full bg-veranda-coral"
            >
              <Ionicons name="arrow-up" size={18} color="#fff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
