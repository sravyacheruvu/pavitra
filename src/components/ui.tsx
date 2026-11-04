import { ReactNode, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { veranda } from "../theme/colors";
import { LANGUAGES, useLang, useT } from "../i18n";
import { useLocation, geocodeCity, GeoCity } from "../services/location";
import { searchCities, City } from "../data/cities";

/**
 * Shared building blocks styled with the "Veranda Theme" tokens: parchment
 * canvas, white parchment-paper cards with a brass filigree hairline and soft
 * morning shadow, Playfair serif headings, marigold primary accents, deep teak
 * carved-wood headers.
 */

/** Soft "morning shadow" elevation used on resting cards. */
export const cardGlow = {
  shadowColor: "#2D1E12",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-veranda-parchment">
      {children}
    </SafeAreaView>
  );
}

/** Ambient telemetry under the title: location + sunrise/sunset. */
export type Ambient = { location?: string; sunrise?: string; sunset?: string };

/**
 * Deep teak carved-wood header: a Playfair serif brass title with an ambient
 * telemetry strip (location · sunrise · sunset) and the language switcher. The
 * location opens the location picker.
 */
export function ScreenHeader({
  title,
  tab,
  ambient,
}: {
  title?: string;
  tab?: string;
  location?: string;
  subtitle?: string;
  right?: ReactNode;
  ambient?: Ambient;
}) {
  const heading = (tab ?? title ?? "").toString();
  const { location: devLoc, status, usingDevice } = useLocation();
  const t = useT();
  const [pickerOpen, setPickerOpen] = useState(false);
  const locLabel =
    status === "loading" ? t("locating") : usingDevice ? devLoc.name : t("enableLocation");
  return (
    <View className="border-b border-veranda-brass/30 bg-veranda-teak px-5 pb-4 pt-4">
      <View className="flex-row items-start justify-between" style={{ gap: 8 }}>
        <View className="min-w-0 flex-1 pr-2">
          <Text className="font-display text-[26px] font-bold leading-tight text-veranda-brass">{heading}</Text>
          <View className="mt-2 flex-row flex-wrap items-center" style={{ gap: 14 }}>
            <Pressable onPress={() => setPickerOpen(true)} hitSlop={6} className="flex-row items-center" accessibilityLabel="Choose location">
              <Ionicons name={usingDevice ? "location" : "location-outline"} size={13} color={veranda.brass} />
              <Text className="ml-1 text-xs text-veranda-parchment/80" numberOfLines={1}>{locLabel}</Text>
              <Ionicons name="chevron-down" size={11} color={veranda.brass} style={{ marginLeft: 2 }} />
            </Pressable>
            {ambient?.sunrise ? (
              <View className="flex-row items-center">
                <Ionicons name="sunny-outline" size={13} color={veranda.brass} />
                <Text className="ml-1 text-xs text-veranda-parchment/80">{ambient.sunrise}</Text>
              </View>
            ) : null}
            {ambient?.sunset ? (
              <View className="flex-row items-center">
                <Ionicons name="moon-outline" size={12} color={veranda.brass} />
                <Text className="ml-1 text-xs text-veranda-parchment/80">{ambient.sunset}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="shrink-0">
          <LanguageSwitcher />
        </View>
      </View>
      <LocationPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </View>
  );
}

/** Simple section heading in the Playfair display face. */
export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-3 mt-6 px-5 font-display text-xl font-bold text-veranda-teak">
      {children}
    </Text>
  );
}

/**
 * Richer section heading: a small accent icon, the display-face title, and an
 * optional right-aligned chip (e.g. "3 Sacred Periods").
 */
export function SectionHeading({
  icon,
  tint = veranda.coral,
  children,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tint?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between px-5" style={{ gap: 8 }}>
      <View className="min-w-0 flex-1 flex-row items-center">
        <Ionicons name={icon} size={19} color={tint} style={{ marginRight: 8 }} />
        <Text className="font-display text-xl font-bold text-veranda-teak" numberOfLines={1}>
          {children}
        </Text>
      </View>
      {right ? <View className="shrink-0">{right}</View> : null}
    </View>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const hasBg = /(^|\s)bg-/.test(className);
  const hasBorder = /(^|\s)border-veranda-/.test(className);
  return (
    <View
      className={`rounded-2xl p-4 ${hasBorder ? "border" : "border border-veranda-brass/25"} ${
        hasBg ? "" : "bg-white"
      } ${className}`}
      style={cardGlow}
    >
      {children}
    </View>
  );
}

export function Pill({
  label,
  tone = "gold",
}: {
  label: string;
  tone?: "gold" | "mango" | "terracotta" | "coral" | "teak" | "marigold" | "brass";
}) {
  const tones: Record<string, string> = {
    gold: "bg-veranda-gold/15 text-veranda-goldDark",
    brass: "bg-veranda-gold/15 text-veranda-goldDark",
    mango: "bg-veranda-mango/10 text-veranda-mango",
    terracotta: "bg-veranda-terracotta/10 text-veranda-terracotta",
    coral: "bg-veranda-coral/10 text-veranda-coral",
    marigold: "bg-veranda-coral/10 text-veranda-coral",
    teak: "bg-veranda-teak/10 text-veranda-teak",
  };
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${tones[tone]}`}>
      <Text className={`text-xs font-bold ${tones[tone]}`}>{label}</Text>
    </View>
  );
}

/** A bundled city → the GeoCity shape the picker uses. */
function cityToGeo(c: City): GeoCity {
  return {
    name: [c.city, c.region, c.country].filter(Boolean).join(", "),
    latitude: c.latitude,
    longitude: c.longitude,
    timeZone: c.timeZone,
  };
}

/**
 * Location picker: an offline, bundled city search (works in the sandbox where
 * GPS and network are blocked), augmented by the online geocoder when reachable,
 * plus a "use my current location" option.
 */
export function LocationPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { location, status, usingDevice, request, setManual } = useLocation();
  const t = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoCity[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [netError, setNetError] = useState(false);

  // Search the bundled city list instantly (works offline / in the sandbox).
  const onQueryChange = (v: string) => {
    setQuery(v);
    setNetError(false);
    const q = v.trim();
    setSearched(q.length > 0);
    setResults(q ? searchCities(q, 8).map(cityToGeo) : []);
  };

  // On submit, also try the online geocoder and merge in any new matches.
  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    const local = searchCities(q, 8).map(cityToGeo);
    setResults(local);
    setSearched(true);
    setNetError(false);
    setSearching(true);
    try {
      const remote = await geocodeCity(q);
      const seen = new Set(local.map((c) => `${c.name}|${c.timeZone}`));
      const merged = [...local];
      for (const r of remote) {
        const key = `${r.name}|${r.timeZone}`;
        if (!seen.has(key)) { seen.add(key); merged.push(r); }
      }
      setResults(merged);
    } catch {
      // Offline / sandboxed — the bundled matches are what we show.
    } finally {
      setSearching(false);
    }
  };

  const useGps = async () => {
    await request();
  };
  const gpsFailed = status === "denied" || status === "unavailable";

  const pick = (c: GeoCity) => {
    setManual({ name: c.name.split(",")[0], latitude: c.latitude, longitude: c.longitude, timeZone: c.timeZone });
    setQuery("");
    setResults([]);
    setSearched(false);
    onClose();
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-black/40 px-8">
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-veranda-parchment p-4">
          <View className="mb-1 flex-row items-center">
            <Ionicons name="location" size={18} color={veranda.coral} />
            <Text className="ml-2 font-display text-base font-bold text-veranda-teak">{t("chooseLocation")}</Text>
          </View>
          <Text className="mb-3 text-xs text-veranda-teakSubtle">{t("locationHint")}</Text>

          <Pressable
            onPress={useGps}
            className="mb-3 flex-row items-center justify-center rounded-full bg-veranda-coral py-3"
            style={cardGlow}
          >
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text className="ml-2 font-bold text-white">
              {status === "loading" ? t("locating") : t("useCurrentLocation")}
            </Text>
          </Pressable>

          {gpsFailed ? (
            <Text className="mb-3 -mt-1 text-center text-[11px] text-veranda-terracotta">{t("gpsUnavailable")}</Text>
          ) : null}

          <View className="mb-2 flex-row items-center" style={{ gap: 8 }}>
            <View className="h-px flex-1 bg-veranda-brass/25" />
            <Text className="text-[11px] font-semibold uppercase text-veranda-teakSubtle">{t("orSearchCity")}</Text>
            <View className="h-px flex-1 bg-veranda-brass/25" />
          </View>

          <View className="flex-row" style={{ gap: 8 }}>
            <View className="flex-1">
              <TextInput
                value={query}
                onChangeText={onQueryChange}
                onSubmitEditing={runSearch}
                placeholder={t("cityPlaceholder")}
                placeholderTextColor="#b8a898"
                autoCapitalize="words"
                returnKeyType="search"
                className="rounded-2xl border border-veranda-brass/30 bg-white px-4 py-3 text-[16px] text-veranda-teak"
              />
            </View>
            <Pressable onPress={runSearch} className="items-center justify-center rounded-2xl bg-veranda-coral px-4" style={cardGlow}>
              {searching ? <ActivityIndicator color="#fff" /> : <Ionicons name="search" size={18} color="#fff" />}
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 220 }} className="mt-2" keyboardShouldPersistTaps="handled">
            {results.map((c, i) => {
              const active = usingDevice && location.name === c.name.split(",")[0];
              return (
                <Pressable
                  key={`${c.name}-${i}`}
                  onPress={() => pick(c)}
                  className={`mb-1.5 flex-row items-center rounded-xl border px-3 py-2.5 ${active ? "border-veranda-coral bg-veranda-coral/10" : "border-veranda-brass/20 bg-white"}`}
                >
                  <Ionicons name="location-outline" size={15} color={veranda.goldDark} />
                  <Text className="ml-2 flex-1 text-[14px] font-semibold text-veranda-teak" numberOfLines={1}>{c.name}</Text>
                  <Text className="text-[11px] text-veranda-teakSubtle" numberOfLines={1}>{c.timeZone}</Text>
                </Pressable>
              );
            })}
            {searched && !searching && results.length === 0 ? (
              <Text className="px-1 py-2 text-[12px] text-veranda-terracotta">
                {netError ? t("cityLookupFailed") : t("cityNotFound")}
              </Text>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Compact language switcher styled for the light festive header: a gold-ringed
 * pill that opens a modal grid of all supported languages.
 */
export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        accessibilityLabel="Change language"
        className="flex-row items-center rounded-full border border-veranda-parchment/30 bg-veranda-parchment/10 px-2.5 py-1"
      >
        <Ionicons name="language" size={14} color={veranda.brass} />
        <Text className="ml-1 text-xs font-bold text-veranda-parchment">{current.native}</Text>
        <Ionicons name="chevron-down" size={12} color={veranda.parchment} style={{ marginLeft: 2 }} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 items-center justify-center bg-black/40 px-8"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-veranda-parchment p-4"
          >
            <View className="mb-2 flex-row items-center">
              <Ionicons name="language" size={18} color={veranda.coral} />
              <Text className="ml-2 font-display text-base font-bold text-veranda-teak">
                Choose your language
              </Text>
            </View>
            <Text className="mb-3 text-xs text-veranda-teakSubtle">
              भाषा चुनें · భాష ఎంచుకోండి · மொழியைத் தேர்ந்தெடுக்கவும்
            </Text>
            <ScrollView style={{ maxHeight: 360 }}>
              <View className="flex-row flex-wrap justify-between" style={{ rowGap: 10 }}>
                {LANGUAGES.map((l) => {
                  const active = lang === l.code;
                  return (
                    <Pressable
                      key={l.code}
                      onPress={() => {
                        setLang(l.code);
                        setOpen(false);
                      }}
                      className={`w-[48%] rounded-xl border p-3 ${
                        active
                          ? "border-veranda-coral bg-veranda-coral/10"
                          : "border-veranda-brass/20 bg-white"
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base font-bold text-veranda-teak">{l.native}</Text>
                        {active ? (
                          <Ionicons name="checkmark-circle" size={18} color={veranda.coral} />
                        ) : null}
                      </View>
                      <Text className="mt-0.5 text-[11px] text-veranda-teakSubtle">{l.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
