import { useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { veranda } from "../theme/colors";
import { cardGlow } from "../components/ui";
import { LANGUAGES, UILang, useLang } from "../i18n";
import { useLocation } from "../services/location";
import {
  useProfile,
  Profile,
  NotifPrefs,
  DEFAULT_NOTIFS,
  MonthSystem,
  Sampradaya,
} from "../services/profile";
import { DEITIES } from "../data/deities";
import { getPanchang } from "../services/panchang";
import { loadFamily, saveFamily, FamilyMember, isValidDob } from "../services/familyStore";
import type { FamilyEntryKind } from "../data/family";
import { requestNotificationPermission, applyReminderSchedule } from "../services/notifications";

const STEPS = [
  "welcome",
  "language",
  "location",
  "identity",
  "tradition",
  "deities",
  "notifications",
  "family",
  "done",
] as const;
type Step = (typeof STEPS)[number];

const SKIPPABLE: Partial<Record<Step, boolean>> = {
  location: true,
  identity: true,
  tradition: true,
  deities: true,
  notifications: true,
  family: true,
};

/** HH:MM in 24-hour form (00:00–23:59). */
const isValidTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s.trim());

type Place = { label: string; tz: string; lat: number; lng: number };

/** Resolve a city name to its timezone + coordinates (keyless Open-Meteo geocoder). */
async function geocodePlace(q: string): Promise<Place | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
    );
    const j = await res.json();
    const r = j?.results?.[0];
    if (!r || !r.timezone) return null;
    return {
      label: r.country ? `${r.name}, ${r.country}` : r.name,
      tz: r.timezone,
      lat: r.latitude,
      lng: r.longitude,
    };
  } catch {
    return null;
  }
}

/** Offset (ms) that `tz` is ahead of UTC at the given instant. */
function tzOffsetMs(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) p[part.type] = part.value;
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUTC - date.getTime();
}

/** The absolute instant for a wall-clock birth date+time in `tz` (device tz if none). */
function birthInstant(dob: string, time: string, tz?: string): Date {
  if (!tz) return new Date(`${dob}T${time}:00`);
  const [Y, M, D] = dob.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  const guess = Date.UTC(Y, M - 1, D, h, m);
  return new Date(guess - tzOffsetMs(new Date(guess), tz));
}

/**
 * First-run onboarding wizard (Utsav theme): welcome → language → location →
 * identity (name/gotra/DOB/deity) → tradition → deities → reminders → family
 * dates → done. Everything but language is skippable and editable later.
 */
export default function OnboardingScreen() {
  const { completeOnboarding, setLang } = useLang();
  const { location, status, usingDevice, request } = useLocation();
  const { update } = useProfile();

  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  const [selectedLang, setSelectedLang] = useState<UILang>("en");
  const [name, setName] = useState("");
  const [gotra, setGotra] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [placeText, setPlaceText] = useState("");
  const [place, setPlace] = useState<Place | undefined>();
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSearched, setGeoSearched] = useState(false);
  const [ishta, setIshta] = useState<string | undefined>();
  const [monthSystem, setMonthSystem] = useState<MonthSystem>("amanta");
  const [sampradaya, setSampradaya] = useState<Sampradaya | undefined>();
  const [followed, setFollowed] = useState<string[]>([]);
  const [notifs, setNotifs] = useState<NotifPrefs>(DEFAULT_NOTIFS);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  // Family draft
  const [fName, setFName] = useState("");
  const [fRel, setFRel] = useState("");
  const [fDob, setFDob] = useState("");
  const [fKind, setFKind] = useState<FamilyEntryKind>("birthday");

  const timeKnown = isValidTime(tob);
  const birthNakshatra = useMemo(() => {
    if (!isValidDob(dob)) return undefined;
    try {
      // Nakshatra depends on the Moon's position at the exact instant of birth.
      // Use the entered time (noon is a rough fallback) interpreted in the birth
      // place's timezone when known, otherwise the device timezone.
      const t = isValidTime(tob) ? tob : "12:00";
      return getPanchang(birthInstant(dob, t, place?.tz), location).nakshatra.name;
    } catch {
      return undefined;
    }
  }, [dob, tob, place, location]);

  const runGeocode = async () => {
    const q = placeText.trim();
    setGeoSearched(true);
    if (!q) {
      setPlace(undefined);
      return;
    }
    setGeoLoading(true);
    const r = await geocodePlace(q);
    setPlace(r ?? undefined);
    setGeoLoading(false);
  };

  const back = () => setStepIdx((i) => Math.max(0, i - 1));
  const next = () => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));

  const toggleNotifEnabled = async (v: boolean) => {
    if (v) {
      const ok = await requestNotificationPermission();
      setNotifs((n) => ({ ...n, enabled: ok }));
    } else {
      setNotifs((n) => ({ ...n, enabled: false }));
    }
  };

  const addMember = () => {
    if (!fName.trim() || !isValidDob(fDob)) return;
    setMembers((m) => [
      ...m,
      { id: `ob-${Date.now()}`, name: fName.trim(), relation: fRel.trim() || "Family", dob: fDob, kind: fKind },
    ]);
    setFName("");
    setFRel("");
    setFDob("");
    setFKind("birthday");
  };

  const finish = async () => {
    const profile: Partial<Profile> = {
      name: name.trim() || undefined,
      gotra: gotra.trim() || undefined,
      ishtaDevata: ishta,
      dob: isValidDob(dob) ? dob : undefined,
      tob: timeKnown ? tob.trim() : undefined,
      birthPlace: place?.label,
      birthTimeZone: place?.tz,
      birthLat: place?.lat,
      birthLng: place?.lng,
      nakshatra: birthNakshatra,
      tradition: { monthSystem, sampradaya: sampradaya ?? "smarta" },
      deities: followed.length ? followed : undefined,
      notifications: notifs,
      completedAt: new Date().toISOString(),
    };
    update(profile);
    if (members.length) {
      try {
        const existing = await loadFamily();
        await saveFamily([...existing, ...members]);
      } catch {
        // ignore
      }
    }
    applyReminderSchedule(notifs);
    completeOnboarding(selectedLang);
  };

  return (
    <SafeAreaView className="flex-1 bg-veranda-parchment" edges={["top", "bottom"]}>
      {/* Progress */}
      <View className="flex-row px-5 pt-3" style={{ gap: 4 }}>
        {STEPS.map((s, i) => (
          <View key={s} className={`h-1 flex-1 rounded-full ${i <= stepIdx ? "bg-veranda-coral" : "bg-veranda-brass/20"}`} />
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
        {step === "welcome" ? (
          <View>
            <View className="items-center pt-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-veranda-gold/15" style={cardGlow}>
                <Ionicons name="flame" size={30} color={veranda.coral} />
              </View>
              <Text className="mt-3 font-display text-3xl font-bold text-veranda-coralDeep">Pavitra</Text>
              <Text className="mt-1 text-[12px] font-bold uppercase text-veranda-goldDark" style={{ letterSpacing: 2 }}>
                Utsav &amp; Anand
              </Text>
            </View>
            <Text className="mt-6 font-display text-2xl font-bold text-veranda-teak">Namaste 🙏</Text>
            <Text className="mt-1 text-[15px] leading-6 text-veranda-teakSubtle">
              A calm, festive companion for your daily rituals. Here's what you'll get:
            </Text>
            <View className="mt-4" style={{ gap: 12 }}>
              {[
                ["calendar-outline", "Accurate local panchangam & muhurtam", "Sunrise, tithi, Rahu Kalam and auspicious windows for exactly where you are."],
                ["sparkles-outline", "A sankalpam that's truly yours", "Personalized with your name, gotra and family deity."],
                ["book-outline", "Festival pooja guides", "Step-by-step vidhi for every festival, hands-free."],
                ["people-outline", "Family tithi reminders", "Never miss a janma tithi, anniversary or shraddha."],
              ].map(([ic, t, d]) => (
                <View key={t} className="flex-row items-start">
                  <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-veranda-gold/15">
                    <Ionicons name={ic as any} size={18} color={veranda.coral} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-bold text-veranda-teak">{t}</Text>
                    <Text className="text-[13px] leading-5 text-veranda-teakSubtle">{d}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text className="mt-6 rounded-2xl bg-veranda-parchmentMuted px-4 py-3 text-[12px] leading-5 text-veranda-teakSubtle">
              Your data stays on this device for now. Account sign-in &amp; cloud backup are coming soon.
            </Text>
          </View>
        ) : null}

        {step === "language" ? (
          <View>
            <StepIntro icon="translate" title="Choose your language" subtitle="भाषा चुनें · భాష ఎంచుకోండి · மொழியைத் தேர்ந்தெடுக்கவும்" />
            <View className="flex-row flex-wrap justify-between" style={{ rowGap: 12 }}>
              {LANGUAGES.map((l) => {
                const active = selectedLang === l.code;
                return (
                  <Pressable
                    key={l.code}
                    onPress={() => {
                      setSelectedLang(l.code);
                      setLang(l.code);
                    }}
                    className={`w-[48%] rounded-2xl border p-4 ${active ? "border-veranda-coral bg-veranda-coral/10" : "border-veranda-brass/25 bg-white"}`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-bold text-veranda-teak">{l.native}</Text>
                      {active ? <Ionicons name="checkmark-circle" size={20} color={veranda.coral} /> : null}
                    </View>
                    <Text className="mt-0.5 text-xs text-veranda-teakSubtle">{l.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step === "location" ? (
          <View>
            <StepIntro
              icon="map-marker-radius"
              title="Accurate timings for your city"
              subtitle="Panchangam and muhurtam depend on your exact sunrise and sunset. Allow location for precise timings — or skip and we'll use a default city."
            />
            <View className="items-center rounded-2xl border border-veranda-brass/20 bg-white p-5" style={cardGlow}>
              <View className="h-16 w-16 items-center justify-center rounded-full bg-veranda-coral/10">
                <Ionicons name={usingDevice ? "location" : "location-outline"} size={30} color={veranda.coral} />
              </View>
              <Text className="mt-3 font-display text-lg font-bold text-veranda-teak">
                {usingDevice ? location.name : "Location not set"}
              </Text>
              <Text className="mt-1 text-center text-[13px] text-veranda-teakSubtle">
                {usingDevice ? "Using your current location ✓" : `Default: ${location.name}`}
              </Text>
              <Pressable onPress={request} className="mt-4 flex-row items-center rounded-full bg-veranda-coral px-5 py-3" style={cardGlow}>
                <Ionicons name="navigate" size={16} color="#fff" />
                <Text className="ml-2 font-bold text-white">
                  {status === "loading" ? "Locating…" : usingDevice ? "Update location" : "Allow location access"}
                </Text>
              </Pressable>
              {status === "denied" ? (
                <Text className="mt-3 text-center text-[12px] text-veranda-terracotta">
                  Permission denied — you can enable it later from the header.
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {step === "identity" ? (
          <View>
            <StepIntro icon="account-heart" title="Make it yours" subtitle="Used to personalize your daily sankalpam. All optional." />
            <Field label="Your name" value={name} onChangeText={setName} placeholder="e.g. Sravya" />
            <Field label="Gotra" value={gotra} onChangeText={setGotra} placeholder="e.g. Bharadwaja" />
            <View className="flex-row" style={{ gap: 10 }}>
              <View className="flex-1">
                <Field label="Date of birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} placeholder="1990-05-21" autoCapitalize="none" />
              </View>
              <View style={{ width: 128 }}>
                <Field label="Time (HH:MM)" value={tob} onChangeText={setTob} placeholder="06:30" autoCapitalize="none" />
              </View>
            </View>
            <View className="mb-3">
              <Text className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-veranda-teakSubtle">
                Birth place (city)
              </Text>
              <View className="flex-row" style={{ gap: 8 }}>
                <View className="flex-1">
                  <TextInput
                    value={placeText}
                    onChangeText={setPlaceText}
                    onEndEditing={runGeocode}
                    placeholder="e.g. Hyderabad"
                    placeholderTextColor="#b8a898"
                    autoCapitalize="words"
                    className="rounded-2xl border border-veranda-brass/30 bg-white px-4 py-3 text-[16px] text-veranda-teak"
                  />
                </View>
                <Pressable onPress={runGeocode} className="items-center justify-center rounded-2xl bg-veranda-coral px-4" style={cardGlow}>
                  <Ionicons name={geoLoading ? "hourglass-outline" : "search"} size={18} color="#fff" />
                </Pressable>
              </View>
              {place ? (
                <View className="mt-2 flex-row items-center rounded-2xl bg-veranda-gold/15 px-3 py-2">
                  <Ionicons name="location" size={14} color={veranda.goldDark} />
                  <Text className="ml-1.5 text-[12px] font-semibold text-veranda-teakSubtle" numberOfLines={1}>
                    {place.label} · {place.tz}
                  </Text>
                </View>
              ) : geoSearched && !geoLoading && placeText.trim() ? (
                <Text className="mt-1.5 px-1 text-[12px] text-veranda-terracotta">
                  Place not found — using your device timezone.
                </Text>
              ) : null}
            </View>
            {birthNakshatra ? (
              <View className="mb-1 flex-row items-center rounded-2xl bg-veranda-mango/10 px-4 py-2.5">
                <Ionicons name="star" size={15} color={veranda.mango} />
                <Text className="ml-2 text-[13px] font-semibold text-veranda-mango">
                  Birth nakshatra: {birthNakshatra}{timeKnown ? "" : " (approx)"}
                </Text>
              </View>
            ) : null}
            {isValidDob(dob) && !timeKnown ? (
              <Text className="mb-3 px-1 text-[12px] leading-5 text-veranda-teakSubtle">
                Add your birth time for an accurate nakshatra — it can change through the day as the Moon moves.
              </Text>
            ) : null}
            <Text className="mb-2 mt-2 text-[12px] font-bold uppercase tracking-wide text-veranda-teakSubtle">
              Family deity (Ishta Devata)
            </Text>
            <DeityGrid selected={ishta ? [ishta] : []} onToggle={(id) => setIshta((p) => (p === id ? undefined : id))} />
          </View>
        ) : null}

        {step === "tradition" ? (
          <View>
            <StepIntro icon="book-open-variant" title="Your tradition" subtitle="Helps show the right festival dates and tithi conventions." />
            <Text className="mb-2 text-[12px] font-bold uppercase tracking-wide text-veranda-teakSubtle">Month system</Text>
            <View className="mb-1 flex-row rounded-full bg-veranda-parchmentMuted p-1">
              {(["amanta", "purnimanta"] as MonthSystem[]).map((ms) => {
                const a = monthSystem === ms;
                return (
                  <Pressable key={ms} onPress={() => setMonthSystem(ms)} className={`flex-1 items-center rounded-full py-2 ${a ? "bg-veranda-coral" : ""}`}>
                    <Text className={`text-sm font-bold ${a ? "text-white" : "text-veranda-teakSubtle"}`}>
                      {ms === "amanta" ? "Amanta" : "Purnimanta"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="mb-4 text-[12px] text-veranda-teakSubtle">Most of South India follows Amanta (month ends on the new moon).</Text>
            <Text className="mb-2 text-[12px] font-bold uppercase tracking-wide text-veranda-teakSubtle">Tradition</Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {([["smarta", "Smarta"], ["vaishnava", "Vaishnava"], ["shaiva", "Shaiva"], ["other", "Other"]] as [Sampradaya, string][]).map(([v, lbl]) => (
                <Chip key={v} label={lbl} active={sampradaya === v} onPress={() => setSampradaya((p) => (p === v ? undefined : v))} />
              ))}
            </View>
          </View>
        ) : null}

        {step === "deities" ? (
          <View>
            <StepIntro icon="hand-heart" title="Deities you observe" subtitle="We'll highlight festivals and poojas for the deities you follow." />
            <DeityGrid
              selected={followed}
              onToggle={(id) => setFollowed((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            />
          </View>
        ) : null}

        {step === "notifications" ? (
          <View>
            <StepIntro icon="bell-ring" title="Gentle reminders" subtitle="Soft nudges for your rituals — you choose which." />
            <View style={{ gap: 10 }}>
              <ToggleRow label="Enable reminders" desc="Turn on to receive notifications" value={notifs.enabled} onValueChange={toggleNotifEnabled} />
              <ToggleRow label="Daily sankalpam" desc="A morning nudge for your dhyana" value={notifs.dailySankalpam} onValueChange={(v) => setNotifs((n) => ({ ...n, dailySankalpam: v }))} disabled={!notifs.enabled} />
              <ToggleRow label="Festival reminders" desc="A heads-up before each festival" value={notifs.festivals} onValueChange={(v) => setNotifs((n) => ({ ...n, festivals: v }))} disabled={!notifs.enabled} />
              <ToggleRow label="Rahu Kalam alerts" desc="When an inauspicious window begins" value={notifs.rahuKalam} onValueChange={(v) => setNotifs((n) => ({ ...n, rahuKalam: v }))} disabled={!notifs.enabled} />
              <ToggleRow label="Family tithi reminders" desc="Janma tithi, anniversary, shraddha" value={notifs.familyTithi} onValueChange={(v) => setNotifs((n) => ({ ...n, familyTithi: v }))} disabled={!notifs.enabled} />
            </View>
          </View>
        ) : null}

        {step === "family" ? (
          <View>
            <StepIntro icon="account-group" title="Important family dates" subtitle="We'll remind you on the correct tithi each year. Add a few now or later." />
            {members.length ? (
              <View className="mb-4" style={{ gap: 8 }}>
                {members.map((m, i) => (
                  <View key={i} className="flex-row items-center rounded-2xl border border-veranda-brass/20 bg-white px-4 py-3">
                    <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-veranda-gold/15">
                      <Ionicons name="calendar" size={16} color={veranda.coral} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-veranda-teak">{m.name}</Text>
                      <Text className="text-[12px] text-veranda-teakSubtle">{m.relation} · {m.dob} · {m.kind}</Text>
                    </View>
                    <Pressable onPress={() => setMembers((list) => list.filter((_, j) => j !== i))} hitSlop={8}>
                      <Ionicons name="close-circle" size={20} color="#d8cdbf" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
            <View className="rounded-2xl border border-veranda-brass/20 bg-white p-4" style={cardGlow}>
              <Field label="Name" value={fName} onChangeText={setFName} placeholder="e.g. Amma" />
              <Field label="Relation" value={fRel} onChangeText={setFRel} placeholder="e.g. Mother" />
              <Field label="Date (YYYY-MM-DD)" value={fDob} onChangeText={setFDob} placeholder="1960-03-12" autoCapitalize="none" />
              <Text className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-veranda-teakSubtle">Occasion</Text>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {([["birthday", "Birthday"], ["anniversary", "Anniversary"], ["shraddha", "Shraddha"]] as [FamilyEntryKind, string][]).map(([v, lbl]) => (
                  <Chip key={v} label={lbl} active={fKind === v} onPress={() => setFKind(v)} />
                ))}
              </View>
              <Pressable
                onPress={addMember}
                disabled={!fName.trim() || !isValidDob(fDob)}
                className={`mt-4 flex-row items-center justify-center rounded-full py-3 ${!fName.trim() || !isValidDob(fDob) ? "bg-veranda-coral/40" : "bg-veranda-coral"}`}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text className="ml-1 font-bold text-white">Add date</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {step === "done" ? (
          <View className="items-center pt-4">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-veranda-mango/10" style={cardGlow}>
              <Ionicons name="checkmark-circle" size={44} color={veranda.mango} />
            </View>
            <Text className="mt-4 font-display text-[26px] font-bold text-veranda-teak">
              {name.trim() ? `All set, ${name.trim()}!` : "You're all set!"}
            </Text>
            <Text className="mt-1 text-center text-[15px] leading-6 text-veranda-teakSubtle">
              Your Pavitra is ready. Everything here can be changed later.
            </Text>
            <View className="mt-5 w-full" style={{ gap: 8 }}>
              <SummaryRow icon="language" label="Language" value={LANGUAGES.find((l) => l.code === selectedLang)?.native ?? "English"} />
              <SummaryRow icon="location" label="Location" value={usingDevice ? location.name : `Default (${location.name})`} />
              {ishta ? <SummaryRow icon="flower" label="Family deity" value={DEITIES.find((d) => d.id === ishta)?.name.en ?? ""} /> : null}
              {birthNakshatra ? <SummaryRow icon="star" label="Birth nakshatra" value={birthNakshatra} /> : null}
              <SummaryRow icon="people" label="Family dates" value={String(members.length)} />
              <SummaryRow icon="notifications" label="Reminders" value={notifs.enabled ? "On" : "Off"} />
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-veranda-brass/20 px-5 py-3">
        <View className="flex-row items-center" style={{ gap: 10 }}>
          {stepIdx > 0 && step !== "done" ? (
            <Pressable onPress={back} className="h-12 w-12 items-center justify-center rounded-full border border-veranda-brass/30">
              <Ionicons name="arrow-back" size={18} color={veranda.teak} />
            </Pressable>
          ) : null}
          <Pressable onPress={step === "done" ? finish : next} className="h-12 flex-1 flex-row items-center justify-center rounded-full bg-veranda-coral" style={cardGlow}>
            <Text className="font-bold text-white">
              {step === "welcome" ? "Begin" : step === "done" ? "Enter Pavitra" : "Continue"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </Pressable>
          {SKIPPABLE[step] ? (
            <Pressable onPress={next} className="px-3 py-2">
              <Text className="text-sm font-semibold text-veranda-teakSubtle">Skip</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ── Small building blocks ─────────────────────────────── */

function StepIntro({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-5">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-veranda-gold/15">
        <MaterialCommunityIcons name={icon} size={26} color={veranda.coral} />
      </View>
      <Text className="font-display text-[26px] font-bold leading-tight text-veranda-teak">{title}</Text>
      {subtitle ? <Text className="mt-1 text-[15px] leading-6 text-veranda-teakSubtle">{subtitle}</Text> : null}
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "words",
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
}) {
  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-veranda-teakSubtle">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#b8a898"
        autoCapitalize={autoCapitalize}
        className="rounded-2xl border border-veranda-brass/30 bg-white px-4 py-3 text-[16px] text-veranda-teak"
      />
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${active ? "border-veranda-coral bg-veranda-coral/10" : "border-veranda-brass/30 bg-white"}`}
    >
      <Text className={`text-sm font-bold ${active ? "text-veranda-coral" : "text-veranda-teak"}`}>{label}</Text>
    </Pressable>
  );
}

function DeityGrid({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <View className="flex-row flex-wrap justify-between" style={{ rowGap: 10 }}>
      {DEITIES.map((d) => {
        const active = selected.includes(d.id);
        return (
          <Pressable
            key={d.id}
            onPress={() => onToggle(d.id)}
            className={`w-[48%] rounded-2xl border p-3 ${active ? "border-veranda-coral bg-veranda-coral/10" : "border-veranda-brass/25 bg-white"}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="min-w-0 flex-1 pr-1">
                <Text className="text-[15px] font-bold text-veranda-teak" numberOfLines={1}>{d.name.en}</Text>
                {d.name.te ? <Text className="text-[12px] text-veranda-teakSubtle" numberOfLines={1}>{d.name.te}</Text> : null}
              </View>
              <Ionicons name={active ? "checkmark-circle" : "ellipse-outline"} size={18} color={active ? veranda.coral : "#d8cdbf"} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View className={`flex-row items-center justify-between rounded-2xl border border-veranda-brass/20 bg-white px-4 py-3 ${disabled ? "opacity-50" : ""}`}>
      <View className="min-w-0 flex-1 pr-3">
        <Text className="text-[15px] font-bold text-veranda-teak">{label}</Text>
        {desc ? <Text className="text-[12px] text-veranda-teakSubtle">{desc}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} trackColor={{ true: veranda.coral, false: "#d8cdbf" }} thumbColor="#fff" />
    </View>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center rounded-2xl border border-veranda-brass/20 bg-white px-4 py-3">
      <Ionicons name={icon} size={16} color={veranda.goldDark} />
      <Text className="ml-2 flex-1 text-[13px] font-semibold text-veranda-teakSubtle">{label}</Text>
      <Text className="text-[13px] font-bold text-veranda-teak" numberOfLines={1}>{value}</Text>
    </View>
  );
}
