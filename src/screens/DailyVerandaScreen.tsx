import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, Screen, ScreenHeader, cardGlow } from "../components/ui";
import { AskAssistant } from "../components/AskAssistant";
import { veranda } from "../theme/colors";
import { usePanchang } from "../hooks/usePanchang";
import { formatTime, isActive } from "../services/panchang";
import { buildSankalpam } from "../services/sankalpam";
import {
  nextFestival,
  formatFestivalDate,
  daysUntil,
  relativeDay,
} from "../data/festivalContent";
import { festivalBanner } from "../data/festivalImage";
import { getDailyPooja } from "../data/dailyPooja";
import { getDailyShloka, verseInScript } from "../data/gitaShloka";
import type { RootStackParamList } from "../navigation/types";
import { useLang, useT, pick } from "../i18n";
import { toScript, pickTerm, mantraScript } from "../i18n/script";
import { useProfile } from "../services/profile";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Daily (Veranda) — the festive home. Tithi hero, live auspicious window,
 * festival spotlight, Daily Sankalpam, the weekday Daily Pooja, and the Nitya
 * Shloka — all rendered in the reader's selected script.
 */
export default function DailyVerandaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { lang } = useLang();
  const t = useT();
  const { panchang: p, now, timeZone: tz } = usePanchang();
  const { profile } = useProfile();
  const sankalpam = buildSankalpam(p, { name: profile.name, gotra: profile.gotra });
  const festival = nextFestival(p.date);
  const festivalDays = daysUntil(festival.observed_on.date, p.date);

  // Daily pooja: weekday (in the active location) decides the traditional deity,
  // but the user's own family/followed deity takes precedence when set.
  const dow = Math.max(0, DOW.indexOf(new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(p.date)));
  const pooja = getDailyPooja(dow, profile.ishtaDevata, profile.deities);
  const shloka = getDailyShloka(p.date, tz);

  // Live auspicious window: Abhijit if it's running now, else the next one up.
  const abhijit = p.windows.abhijit;
  const abhijitActive = isActive(abhijit, now);

  const openPooja = () => navigation.navigate("FestivalPooja", { festivalId: festival.id });
  const openMuhurtam = () => (navigation as any).navigate("Muhurtam");

  const waxing = p.tithi.paksha === "Shukla";
  // Render a Sanskrit anga in the reader's script: roman for English, else the
  // Devanagari source transliterated into the selected script.
  const term = (roman: string, sa?: string) => (lang === "en" || !sa ? roman : toScript(sa, lang));
  const [askOpen, setAskOpen] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        tab={t("daily")}
        ambient={{ location: p.location?.name, sunrise: formatTime(p.sun.sunrise, tz), sunset: formatTime(p.sun.sunset, tz) }}
      />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 28, gap: 16 }}>
        {/* ── Tithi hero ───────────────────────────────── */}
        <Card>
          <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
            <View className="flex-row items-center rounded-full bg-veranda-gold/15 px-3 py-1">
              <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-veranda-gold" />
              <Text className="text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }} numberOfLines={1}>
                {term(p.samvatsara, p.samvatsaraSa)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="sparkles" size={14} color={veranda.gold} />
              <Text className="ml-1 text-xs font-semibold text-veranda-teakSubtle">{term(p.masa, p.masaSa)} Māsa</Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between" style={{ gap: 10 }}>
            <View className="min-w-0 flex-1">
              <Text className="text-[11px] font-bold uppercase text-veranda-teakSubtle" style={{ letterSpacing: 1 }}>
                {t("todaysTithi")}
              </Text>
              <Text className="font-display text-[26px] font-bold leading-tight text-veranda-teak">
                {term(p.tithi.paksha, p.tithi.pakshaSa)} {term(p.tithi.name, p.tithi.sa)}
              </Text>
              <Text className="mt-0.5 text-[13px] text-veranda-teakSubtle">
                {waxing ? t("waxingMoon") : t("waningMoon")} · {term(p.samvatsara, p.samvatsaraSa)}
              </Text>
              {p.tithi.end ? (
                <Text className="mt-0.5 text-xs text-veranda-teakSubtle/80">
                  {t("tithiUntil")} {formatTime(p.tithi.end, tz)}
                </Text>
              ) : null}
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-full bg-veranda-gold/15" style={cardGlow}>
              <MaterialCommunityIcons
                name={waxing ? "moon-waxing-crescent" : "moon-waning-crescent"}
                size={34}
                color={veranda.gold}
              />
              <View className="absolute right-3 top-4 h-2 w-2 rounded-full bg-veranda-coral" />
            </View>
          </View>

          {/* Sunrise / Sunset */}
          <View className="mt-4 flex-row" style={{ gap: 10 }}>
            <View className="flex-1 flex-row items-center rounded-2xl bg-veranda-parchmentMuted px-3 py-2.5">
              <View className="mr-2.5 h-8 w-8 items-center justify-center rounded-full bg-veranda-gold/25">
                <Ionicons name="sunny" size={17} color={veranda.goldDark} />
              </View>
              <View className="min-w-0">
                <Text className="text-[11px] font-semibold text-veranda-teakSubtle">{t("sunriseLabel")}</Text>
                <Text className="font-display text-base font-bold text-veranda-teak">{formatTime(p.sun.sunrise, tz)}</Text>
              </View>
            </View>
            <View className="flex-1 flex-row items-center rounded-2xl bg-veranda-parchmentMuted px-3 py-2.5">
              <View className="mr-2.5 h-8 w-8 items-center justify-center rounded-full bg-black/5">
                <Ionicons name="moon" size={15} color={veranda.teakSubtle} />
              </View>
              <View className="min-w-0">
                <Text className="text-[11px] font-semibold text-veranda-teakSubtle">{t("sunsetLabel")}</Text>
                <Text className="font-display text-base font-bold text-veranda-teak">{formatTime(p.sun.sunset, tz)}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* ── Live auspicious window ───────────────────── */}
        <Card>
          <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
            <View className="min-w-0 flex-1 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-veranda-mango/15">
                <View className="h-2.5 w-2.5 rounded-full bg-veranda-mango" />
              </View>
              <View className="min-w-0 flex-1">
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <Text className="text-[11px] font-bold uppercase text-veranda-mango" style={{ letterSpacing: 1 }}>
                    {abhijitActive ? t("activeMuhurtam") : t("nextAuspicious")}
                  </Text>
                  <View className="rounded bg-veranda-mango/10 px-1.5 py-0.5">
                    <Text className="text-[9px] font-bold uppercase text-veranda-mango">{t("shubh")}</Text>
                  </View>
                </View>
                <Text className="font-display text-base font-bold text-veranda-teak" numberOfLines={1}>
                  Abhijit Muhurtam
                </Text>
                <Text className="text-[13px] text-veranda-teakSubtle">
                  {formatTime(abhijit.start, tz)} – {formatTime(abhijit.end, tz)}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={openMuhurtam}
              className="shrink-0 flex-row items-center rounded-full bg-veranda-parchmentMuted px-3 py-2"
            >
              <Text className="text-xs font-semibold text-veranda-teak">{t("viewAll")}</Text>
              <Ionicons name="chevron-forward" size={15} color={veranda.teak} style={{ marginLeft: 2 }} />
            </Pressable>
          </View>
        </Card>

        {/* ── Festival spotlight ───────────────────────── */}
        <Pressable onPress={openPooja}>
          <Card className="p-0 overflow-hidden">
            <View className="h-40 w-full">
              <Image source={festivalBanner(festival.slug)} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-veranda-gold px-3 py-1" style={cardGlow}>
                <Ionicons name="calendar" size={12} color="#fff" />
                <Text className="ml-1 text-[11px] font-bold uppercase text-white" style={{ letterSpacing: 0.6 }}>
                  {relativeDay(festivalDays)}
                </Text>
              </View>
              <View className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-white/80">
                <Ionicons name="heart-outline" size={18} color={veranda.coral} />
              </View>
            </View>

            <View className="p-4">
              <Text className="text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }} numberOfLines={1}>
                {formatFestivalDate(festival.observed_on.date)}
              </Text>
              <Text className="font-display text-[22px] font-bold leading-tight text-veranda-teak">
                {pickTerm(festival.name, lang)}
              </Text>
              <Text className="mt-1 text-[14px] leading-5 text-veranda-teakSubtle" numberOfLines={3}>
                {pick(festival.significance, lang)}
              </Text>
              <View className="mt-4 w-full flex-row items-center justify-center rounded-full bg-veranda-coral py-3" style={cardGlow}>
                <Text className="font-bold text-white">{t("explorePooja")}</Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" style={{ marginLeft: 8 }} />
              </View>
            </View>
          </Card>
        </Pressable>

        {/* ── Daily Sankalpam ──────────────────────────── */}
        <Card>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="meditation" size={19} color={veranda.gold} />
              <Text className="ml-2 text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }}>
                {t("dailySankalpam")}
              </Text>
            </View>
            <Text className="text-xs font-semibold text-veranda-teakSubtle">{t("morningDhyana")}</Text>
          </View>

          <View className="mt-3 items-center px-1">
            <Text className="text-center font-display text-base font-bold leading-6 text-veranda-coralDeep">
              “{lang === "en" ? sankalpam.line : toScript(sankalpam.lineSa, lang)}”
            </Text>
          </View>
        </Card>

        {/* ── Daily Pooja (weekday vidhanam) ───────────── */}
        <Card>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="hand-heart" size={19} color={veranda.coral} />
            <Text className="ml-2 text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }}>
              {t("dailyPooja")}
            </Text>
          </View>

          <View className="mt-3 flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-veranda-gold/15">
              <MaterialCommunityIcons name="flower-tulip" size={24} color={veranda.coral} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="font-display text-xl font-bold leading-tight text-veranda-teak" numberOfLines={1}>
                {pickTerm(pooja.deity.name, lang)}
              </Text>
              <Text className="text-[12px] text-veranda-teakSubtle" numberOfLines={1}>
                {pick(pooja.weekday, lang)} · {pooja.personal ? t("yourDeity") : t("todaysDeity")}
              </Text>
            </View>
          </View>

          {pooja.ishtaNote ? (
            <Text className="mt-2 text-[12px] leading-5 text-veranda-teakSubtle/80">
              {pickTerm(pooja.ishtaNote.name, lang)} {t("ishtaDayNote")} {pick(pooja.ishtaNote.weekday, lang)}.
            </Text>
          ) : null}

          {/* Mantra */}
          <View className="mt-3 rounded-2xl bg-veranda-turmeric/60 px-4 py-3">
            <Text className="text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1 }}>
              {t("mantra")}
            </Text>
            <Text className="mt-0.5 font-display text-[15px] font-bold text-veranda-coralDeep">{mantraScript(pooja.deity.mantra, lang)}</Text>
            <Text className="mt-0.5 text-[11px] text-veranda-teakSubtle">{t("chantThrice")}</Text>
          </View>

          {/* Five quick steps */}
          <View className="mt-3" style={{ gap: 10 }}>
            {pooja.steps.map((s, i) => (
              <View key={i} className="flex-row">
                <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-veranda-coral/15">
                  <Text className="text-[12px] font-bold text-veranda-coral">{i + 1}</Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-[14px] font-bold text-veranda-teak">{pick(s.title, lang)}</Text>
                  <Text className="text-[13px] leading-5 text-veranda-teakSubtle">{pick(s.detail, lang)}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* ── Nitya Shloka ─────────────────────────────── */}
        <Card>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="book-open-page-variant" size={18} color={veranda.gold} />
              <Text className="ml-2 text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }}>
                {t("nityaShloka")}
              </Text>
            </View>
            <View className="rounded-full bg-veranda-gold/20 px-2.5 py-0.5">
              <Text className="text-[11px] font-bold text-veranda-goldDark">{t("bhagavadGita")} {shloka.ref}</Text>
            </View>
          </View>
          <Text className="mt-3 font-display text-[17px] font-bold leading-7 text-veranda-coralDeep">
            {verseInScript(shloka.iast, lang)}
          </Text>
          {lang !== "en" && (
            <Text className="mt-1 text-[12px] italic leading-5 text-veranda-teakSubtle/80">
              {shloka.iast}
            </Text>
          )}
          <Text className="mt-2 text-[13px] leading-5 text-veranda-teakSubtle">
            {pick(shloka.meaning, lang)}
          </Text>
        </Card>
      </ScrollView>

      {/* Floating "Ask Pavitra" */}
      <Pressable
        onPress={() => setAskOpen(true)}
        className="absolute bottom-5 right-5 h-14 flex-row items-center rounded-full bg-veranda-coral px-4"
        style={cardGlow}
      >
        <Ionicons name="sparkles" size={18} color="#fff" />
        <Text className="ml-2 font-bold text-white">{t("askPavitra")}</Text>
      </Pressable>
      <AskAssistant open={askOpen} onClose={() => setAskOpen(false)} />
    </Screen>
  );
}
