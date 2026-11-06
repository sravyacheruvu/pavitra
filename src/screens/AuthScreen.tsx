import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { veranda } from "../theme/colors";
import { LANGUAGES, useLang, useT } from "../i18n";
import { useAuth } from "../services/auth";

type Mode = "login" | "signup" | "forgot";

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function AuthScreen() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { signIn, signUp, resetPassword, updatePassword, recovery } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // A password-reset link puts the app into "recovery": collect a new password.
  const needsPassword = recovery || mode === "login" || mode === "signup";
  const canSubmit =
    !busy &&
    (recovery
      ? password.length >= 6
      : mode === "forgot"
        ? emailOk(email)
        : emailOk(email) && password.length >= 6);

  const clearMsgs = () => {
    setError(null);
    setInfo(null);
  };

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    clearMsgs();

    if (recovery) {
      const res = await updatePassword(password);
      setBusy(false);
      if (res.error) setError(res.error);
      else setInfo(t("passwordUpdated"));
      // On success the recovery flag clears and the app opens automatically.
      return;
    }

    if (mode === "forgot") {
      const res = await resetPassword(email);
      setBusy(false);
      if (res.error) setError(res.error);
      else {
        setInfo(t("resetLinkSent"));
        setMode("login");
        setPassword("");
      }
      return;
    }

    const res: { error?: string; needsConfirmation?: boolean } =
      mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
    } else if (mode === "signup" && res.needsConfirmation) {
      setInfo(t("checkEmailConfirm"));
      setMode("login");
    }
    // on success with a session, the auth listener switches to the app.
  };

  const inputClass =
    "mt-1 rounded-xl border border-veranda-brass/40 bg-white px-3 py-3 text-veranda-teak";

  const headerTitle = recovery
    ? t("setNewPassword")
    : mode === "login"
      ? t("welcomeBack")
      : mode === "signup"
        ? t("createAccount")
        : t("resetPassword");

  const submitLabel = busy
    ? t("pleaseWait")
    : recovery
      ? t("updatePassword")
      : mode === "login"
        ? t("logIn")
        : mode === "signup"
          ? t("signUp")
          : t("sendResetLink");

  return (
    <SafeAreaView className="flex-1 bg-veranda-parchment" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Brand header */}
        <View className="bg-veranda-teak px-6 pb-7 pt-8">
          <View className="mb-2 h-12 w-12 items-center justify-center rounded-2xl bg-veranda-brass/20">
            <MaterialCommunityIcons name="flower-tulip" size={26} color={veranda.brass} />
          </View>
          <Text className="font-serif text-3xl font-bold text-veranda-brass">Pavitra</Text>
          <Text className="mt-0.5 text-veranda-parchment/80">The Digital Veranda</Text>
          <Text className="mt-5 text-xl font-bold text-veranda-parchment">{headerTitle}</Text>
        </View>

        {/* Form */}
        <View className="px-6 pt-6">
          {/* Language preference — asked at sign-up; changeable later in the Veranda. */}
          {mode === "signup" && !recovery ? (
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-wide text-veranda-teak/45">{t("language")}</Text>
              <View className="mt-2 flex-row flex-wrap" style={{ gap: 8 }}>
                {LANGUAGES.map((l) => {
                  const active = lang === l.code;
                  return (
                    <Pressable
                      key={l.code}
                      onPress={() => setLang(l.code)}
                      className={`rounded-full border px-3 py-1.5 ${
                        active
                          ? "border-veranda-marigold bg-veranda-marigold"
                          : "border-veranda-brass/40 bg-white"
                      }`}
                    >
                      <Text className={`text-sm font-semibold ${active ? "text-white" : "text-veranda-teak/70"}`}>
                        {l.native}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* Email — hidden during recovery (the link already identifies the user). */}
          {!recovery ? (
            <>
              <Text className="text-xs uppercase tracking-wide text-veranda-teak/45">{t("email")}</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={`${veranda.teak}55`}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                className={inputClass}
              />
            </>
          ) : null}

          {mode === "forgot" && !recovery ? (
            <Text className="mt-3 text-sm text-veranda-teak/60">{t("resetPasswordIntro")}</Text>
          ) : null}

          {needsPassword ? (
            <>
              <Text className="mt-4 text-xs uppercase tracking-wide text-veranda-teak/45">{t("password")}</Text>
              <View className="mt-1 flex-row items-center rounded-xl border border-veranda-brass/40 bg-white px-3">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={`${veranda.teak}55`}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  className="flex-1 py-3 text-veranda-teak"
                />
                <Pressable onPress={() => setShowPw((s) => !s)} hitSlop={8}>
                  <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={20} color={`${veranda.teak}88`} />
                </Pressable>
              </View>
              {password.length > 0 && password.length < 6 ? (
                <Text className="mt-1 text-xs text-veranda-teak/50">Minimum 6 characters.</Text>
              ) : null}
            </>
          ) : null}

          {/* Forgot-password link — only on the login screen. */}
          {mode === "login" && !recovery ? (
            <Pressable
              onPress={() => {
                setMode("forgot");
                setPassword("");
                clearMsgs();
              }}
              className="mt-2 items-end"
              hitSlop={8}
            >
              <Text className="text-sm font-semibold text-veranda-marigold">{t("forgotPassword")}</Text>
            </Pressable>
          ) : null}

          {error ? (
            <View className="mt-4 rounded-xl bg-veranda-terracotta/10 px-3 py-2">
              <Text className="text-sm text-veranda-terracotta">{error}</Text>
            </View>
          ) : null}
          {info ? (
            <View className="mt-4 rounded-xl bg-veranda-mango/10 px-3 py-2">
              <Text className="text-sm text-veranda-mango">{info}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={submit}
            disabled={!canSubmit}
            className={`mt-6 flex-row items-center justify-center rounded-full py-3.5 ${
              canSubmit ? "bg-veranda-marigold" : "bg-veranda-marigold/40"
            }`}
          >
            <Text className="text-base font-bold text-white">{submitLabel}</Text>
          </Pressable>

          {/* Secondary action — hidden during recovery. */}
          {!recovery ? (
            <Pressable
              onPress={() => {
                setMode((m) => (m === "login" ? "signup" : "login"));
                clearMsgs();
              }}
              className="mt-5 items-center"
            >
              <Text className="text-sm font-semibold text-veranda-marigold">
                {mode === "signup" || mode === "forgot" ? t("haveAccountLogIn") : t("newHereCreate")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
