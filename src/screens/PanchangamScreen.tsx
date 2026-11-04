import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Screen, ScreenHeader, SectionHeading, cardGlow } from "../components/ui";
import { veranda } from "../theme/colors";
import { usePanchang } from "../hooks/usePanchang";
import {
  formatTime,
  formatMediumDate,
  isActive,
  forecast,
  dayQuality,
  TimeWindow,
  DayQuality,
} from "../services/panchang";
import { useT, useLang, StringKey } from "../i18n";
import { toScript } from "../i18n/script";

type Win = { label: string; icon: keyof typeof Ionicons.glyphMap; window: TimeWindow };

const dotColor: Record<DayQuality["level"], string> = {
  good: veranda.mango,
  mixed: veranda.gold,
  caution: veranda.terracotta,
};

const bannerMeta: Record<
  DayQuality["level"],
  { bg: string; titleKey: StringKey; pillKey: StringKey; icon: keyof typeof Ionicons.glyphMap }
> = {
  good: { bg: veranda.mango, titleKey: "qHighlyAuspicious", pillKey: "uttamShubh", icon: "sunny" },
  mixed: { bg: veranda.gold, titleKey: "qBalanced", pillKey: "madhyama", icon: "partly-sunny" },
  caution: { bg: veranda.terracotta, titleKey: "qCaution", pillKey: "varjyam", icon: "alert" },
};

export default function PanchangamScreen() {
  const t = useT();
  const { lang } = useLang();
  const term = (roman: string, sa?: string) => (lang === "en" || !sa ? roman : toScript(sa, lang));
  const { panchang: p, now, timeZone: tz, location } = usePanchang();
  const w = p.windows;

  const quality = dayQuality(p);
  const bm = bannerMeta[quality.level];

  const auspicious: Win[] = [
    { label: "Abhijit Muhurtam", icon: "shield-checkmark", window: w.abhijit },
    { label: "Brahma Muhurtam", icon: "moon", window: w.brahmaMuhurta },
  ];
  const avoid: Win[] = [
    { label: "Rahu Kalam", icon: "warning", window: w.rahuKalam },
    { label: "Yamaganda", icon: "hourglass-outline", window: w.yamaganda },
    { label: "Gulika Kalam", icon: "remove-circle-outline", window: w.gulika },
  ];

  const lookup = [
    { label: t("labelTithi"), value: term(p.tithi.name, p.tithi.sa), ends: p.tithi.end, icon: "contrast" as const, hint: `${term(p.tithi.paksha, p.tithi.pakshaSa)} Paksha` },
    { label: t("labelNakshatra"), value: term(p.nakshatra.name, p.nakshatra.sa), ends: p.nakshatra.end, icon: "star" as const, hint: t("lunarMansion") },
    { label: t("labelYoga"), value: term(p.yoga.name, p.yoga.sa), ends: p.yoga.end, icon: "sunny" as const, hint: t("alignment") },
    { label: t("labelKarana"), value: term(p.karana.name, p.karana.sa), ends: null as Date | null, icon: "flash" as const, hint: t("halfTithi") },
  ];

  const dayKey = useMemo(() => formatMediumDate(now, tz), [now, tz]);
  const days = useMemo(() => forecast(new Date(), 7, location), [dayKey, location]); // eslint-disable-line react-hooks/exhaustive-deps

  const wk = (d: Date) => new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d).toUpperCase();
  const dayNum = (d: Date) => new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: tz }).format(d);

  return (
    <Screen>
      <ScreenHeader
        tab={t("muhurtam")}
        ambient={{ location: p.location?.name, sunrise: formatTime(p.sun.sunrise, tz), sunset: formatTime(p.sun.sunset, tz) }}
      />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 28 }}>
        {/* ── Day quality banner ───────────────────────── */}
        <View className="px-5 pt-4">
          <View className="overflow-hidden rounded-2xl p-4" style={{ backgroundColor: bm.bg, ...cardGlow }}>
            <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
              <View className="min-w-0 flex-1 flex-row items-center">
                <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white/20">
                  <Ionicons name={bm.icon} size={23} color="#fff" />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-[11px] font-bold uppercase text-white/90" style={{ letterSpacing: 1.2 }}>
                    {t("dayQuality")}
                  </Text>
                  <Text className="font-display text-xl font-bold text-white" numberOfLines={1}>
                    {t(bm.titleKey)}
                  </Text>
                </View>
              </View>
              <View className="shrink-0 flex-row items-center rounded-full bg-white/20 px-3 py-1">
                <View className="mr-1.5 h-2 w-2 rounded-full bg-white" />
                <Text className="text-xs font-bold text-white">{t(bm.pillKey)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 7-day strip ──────────────────────────────── */}
        <View className="px-5 pt-5">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }}>
              {t("sevenDayOutlook")}
            </Text>
            <Text className="text-xs font-semibold text-veranda-teakSubtle">
              {term(p.tithi.paksha, p.tithi.pakshaSa)} {term(p.masa, p.masaSa)}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {days.map((d, i) => {
              const today = i === 0;
              return (
                <View
                  key={i}
                  className={`w-14 items-center rounded-2xl py-2.5 ${today ? "bg-veranda-coral" : "bg-veranda-parchmentMuted"}`}
                  style={today ? cardGlow : undefined}
                >
                  <Text className={`text-[11px] font-semibold ${today ? "text-white/85" : "text-veranda-teakSubtle"}`}>
                    {today ? t("todayShort") : wk(d.date)}
                  </Text>
                  <Text className={`my-1 font-display text-lg font-bold leading-none ${today ? "text-white" : "text-veranda-teak"}`}>
                    {dayNum(d.date)}
                  </Text>
                  <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: today ? "#fff" : dotColor[d.quality.level] }} />
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Auspicious windows ───────────────────────── */}
        <SectionHeading
          icon="sparkles"
          tint={veranda.mango}
          right={
            <View className="rounded-full bg-veranda-mango/10 px-2.5 py-0.5">
              <Text className="text-xs font-bold text-veranda-mango">{auspicious.length} {t("sacredShort")}</Text>
            </View>
          }
        >
          {t("auspiciousTimes")}
        </SectionHeading>
        <View className="px-5" style={{ gap: 10 }}>
          {auspicious.map((r) => (
            <WindowCard key={r.label} r={r} tz={tz} now={now} tone="good" />
          ))}
        </View>

        {/* ── Times to avoid ───────────────────────────── */}
        <SectionHeading
          icon="remove-circle-outline"
          tint={veranda.terracotta}
          right={
            <View className="rounded-full bg-veranda-terracotta/10 px-2.5 py-0.5">
              <Text className="text-xs font-bold text-veranda-terracotta">{t("varjyam")}</Text>
            </View>
          }
        >
          {t("timesToAvoid")}
        </SectionHeading>
        <View className="px-5" style={{ gap: 10 }}>
          {avoid.map((r) => (
            <WindowCard key={r.label} r={r} tz={tz} now={now} tone="avoid" />
          ))}
        </View>

        {/* ── Panchang elements ────────────────────────── */}
        <SectionHeading
          icon="git-network-outline"
          tint={veranda.goldDark}
          right={<Text className="text-xs font-semibold text-veranda-teakSubtle">{t("fiveLimbs")}</Text>}
        >
          {t("panchangElements")}
        </SectionHeading>
        <View className="flex-row flex-wrap px-5" style={{ gap: 12 }}>
          {lookup.map((l) => (
            <Card key={l.label} className="w-[47%]">
              <Text className="text-[11px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 1.2 }}>
                {l.label}
              </Text>
              <Text className="my-1 font-display text-xl font-bold leading-tight text-veranda-teak" numberOfLines={1}>
                {l.value}
              </Text>
              <Text className="text-xs text-veranda-teakSubtle">
                {l.ends ? `${t("until")} ${formatTime(l.ends, tz)}` : t("fullDay")}
              </Text>
              <View className="mt-2 flex-row items-center">
                <Ionicons name={l.icon} size={14} color={veranda.coral} />
                <Text className="ml-1.5 text-[11px] font-semibold text-veranda-teakSubtle" numberOfLines={1}>
                  {l.hint}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* ── Alerts CTA ───────────────────────────────── */}
        <View className="px-5 pt-5">
          <Pressable className="w-full flex-row items-center justify-center rounded-full bg-veranda-coral py-3.5" style={cardGlow}>
            <Ionicons name="notifications" size={19} color="#fff" />
            <Text className="ml-2 font-bold text-white">{t("setAlerts")}</Text>
          </Pressable>
          <Text className="mt-2 px-1 text-center text-[11px] text-veranda-teakSubtle/70">{t("muhurtamNote")}</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function WindowCard({
  r,
  tz,
  now,
  tone,
}: {
  r: Win;
  tz: string;
  now: Date;
  tone: "good" | "avoid";
}) {
  const t = useT();
  const active = isActive(r.window, now);
  const accent = tone === "good" ? (active ? veranda.mango : `${veranda.mango}66`) : `${veranda.terracotta}aa`;
  const iconBg = tone === "good" && active ? "bg-veranda-mango/10" : "bg-veranda-parchmentMuted";
  const iconColor = tone === "good" ? veranda.mango : veranda.terracotta;

  return (
    <View className="overflow-hidden rounded-2xl bg-white p-4" style={active ? { ...cardGlow, shadowColor: iconColor, shadowOpacity: 0.3 } : cardGlow}>
      <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, backgroundColor: accent }} />
      <View className="flex-row items-center justify-between pl-2" style={{ gap: 8 }}>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center" style={{ gap: 8, flexWrap: "wrap" }}>
            <Text className="font-display text-base font-bold text-veranda-teak" numberOfLines={1}>
              {r.label}
            </Text>
            {tone === "good" && active ? (
              <View className="flex-row items-center rounded-full bg-veranda-mango px-2 py-0.5">
                <View className="mr-1 h-1.5 w-1.5 rounded-full bg-white" />
                <Text className="text-[10px] font-bold uppercase text-white" style={{ letterSpacing: 0.5 }}>
                  {t("rightNow")}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-0.5 text-[14px] font-medium text-veranda-teakSubtle">
            {formatTime(r.window.start, tz)} – {formatTime(r.window.end, tz)}
          </Text>
        </View>
        <View className={`h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
          <Ionicons name={r.icon} size={19} color={iconColor} />
        </View>
      </View>
    </View>
  );
}
