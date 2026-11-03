import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Pill, Screen, ScreenHeader, SectionHeader } from "../components/ui";
import { veranda } from "../theme/colors";
import { DEFAULT_LOCATION } from "../config/location";
import {
  civilDaysUntil,
  formatMediumDate,
  nextTithiOccurrence,
  relativeDayLabel,
} from "../services/panchang";
import {
  FamilyMember,
  isValidDob,
  loadFamily,
  saveFamily,
} from "../services/familyStore";
import type { FamilyEntryKind } from "../data/family";
import { LANGUAGES, useLang, useT } from "../i18n";
import { useAuth } from "../services/auth";

const kindMeta: Record<
  FamilyEntryKind,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; tone: "marigold" | "mango" | "terracotta"; label: string }
> = {
  birthday: { icon: "cake-variant", tone: "marigold", label: "Birthday" },
  anniversary: { icon: "heart", tone: "mango", label: "Anniversary" },
  shraddha: { icon: "candle", tone: "terracotta", label: "Shraddha" },
};

const tz = DEFAULT_LOCATION.timeZone;
const toDate = (iso: string) => new Date(`${iso}T06:30:00Z`);

export default function FamilyVaultScreen() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { user, signOut } = useAuth();

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadFamily().then((m) => {
      setMembers(m);
      setLoaded(true);
    });
  }, []);

  const persist = (next: FamilyMember[]) => {
    setMembers(next);
    saveFamily(next);
  };

  // Compute janma tithi + next tithi-birthday for each member (keyed on members).
  const computed = useMemo(() => {
    const now = new Date();
    return members
      .map((e) => {
        const next = nextTithiOccurrence(toDate(e.dob), now, DEFAULT_LOCATION);
        const days = next ? civilDaysUntil(next.date, now, tz) : Infinity;
        return { ...e, next, days };
      })
      .sort((a, b) => a.days - b.days);
  }, [members]);

  const featured = computed[0];

  const addMember = (m: FamilyMember) => {
    persist([...members, m]);
    setShowForm(false);
  };
  const removeMember = (id: string) => persist(members.filter((m) => m.id !== id));

  return (
    <Screen>
      <ScreenHeader title={t("familyVault")} subtitle={t("tithiEventsSubtitle")} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Language / Settings */}
        <SectionHeader>{t("settings")}</SectionHeader>
        <View className="px-5">
          <Card>
            <View className="flex-row items-center">
              <Ionicons name="language" size={18} color={veranda.marigold} />
              <Text className="ml-2 font-semibold text-veranda-teak">{t("language")}</Text>
            </View>
            <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
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
          </Card>

          {/* Account — shown only when signed in (auth temporarily disabled) */}
          {user ? (
            <Card className="mt-3 flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[11px] uppercase tracking-wide text-veranda-teak/45">
                  {t("account")}
                </Text>
                <Text className="mt-0.5 font-semibold text-veranda-teak" numberOfLines={1}>
                  {user.email ?? "—"}
                </Text>
              </View>
              <Pressable
                onPress={() => signOut()}
                className="flex-row items-center rounded-full border border-veranda-brass/40 px-3 py-2"
              >
                <Ionicons name="log-out-outline" size={16} color={veranda.terracotta} />
                <Text className="ml-1.5 text-sm font-bold text-veranda-terracotta">{t("logOut")}</Text>
              </Pressable>
            </Card>
          ) : null}
        </View>

        {/* Tithi converter (featured member) */}
        {featured ? (
          <>
            <SectionHeader>{t("tithiConverter")}</SectionHeader>
            <View className="px-5">
              <Card className="bg-veranda-teak">
                <Text className="text-xs uppercase tracking-wide text-veranda-parchment/60">
                  {featured.name} · {t("dobShort")}
                </Text>
                <Text className="mt-1 text-lg font-bold text-veranda-parchment">
                  {formatMediumDate(toDate(featured.dob), tz)}
                </Text>
                <View className="my-3 flex-row items-center">
                  <View className="h-px flex-1 bg-veranda-parchment/20" />
                  <MaterialCommunityIcons name="swap-vertical" size={20} color={veranda.brass} style={{ marginHorizontal: 8 }} />
                  <View className="h-px flex-1 bg-veranda-parchment/20" />
                </View>
                <Text className="text-xs uppercase tracking-wide text-veranda-parchment/60">{t("janmaTithi")}</Text>
                <Text className="mt-1 text-lg font-bold text-veranda-brass">
                  {featured.next ? featured.next.tithiLabel : "—"}
                </Text>
                {featured.next ? (
                  <Text className="mt-2 text-sm text-veranda-parchment/70">
                    {t("nextOccurrence")}: {formatMediumDate(featured.next.date, tz)} (
                    {relativeDayLabel(featured.days).toLowerCase()})
                  </Text>
                ) : null}
              </Card>
            </View>
          </>
        ) : null}

        {/* Upcoming events */}
        <SectionHeader>{t("upcomingEvents")}</SectionHeader>
        <View className="px-5" style={{ gap: 12 }}>
          {loaded && computed.length === 0 ? (
            <Text className="text-sm text-veranda-teak/50">{t("noFamilyYet")}</Text>
          ) : null}
          {computed.map((e) => {
            const meta = kindMeta[e.kind];
            return (
              <Card key={e.id} className="flex-row items-center">
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-veranda-marigold/10">
                  <MaterialCommunityIcons name={meta.icon} size={24} color={veranda.marigold} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-bold text-veranda-teak">{e.name}</Text>
                    <Text className="text-xs font-semibold text-veranda-marigold">
                      {e.next ? relativeDayLabel(e.days) : "—"}
                    </Text>
                  </View>
                  <Text className="text-sm text-veranda-teak/60">{e.relation}</Text>
                  <Text className="mt-1 text-xs text-veranda-teak/50">
                    {e.next ? `${e.next.tithiLabel} · ${formatMediumDate(e.next.date, tz)}` : "—"}
                  </Text>
                  <View className="mt-2 flex-row items-center justify-between">
                    <Pill label={meta.label} tone={meta.tone} />
                    <Pressable onPress={() => removeMember(e.id)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={16} color={`${veranda.teak}66`} />
                    </Pressable>
                  </View>
                </View>
              </Card>
            );
          })}

          {showForm ? (
            <AddMemberForm
              onCancel={() => setShowForm(false)}
              onSave={addMember}
              t={t}
            />
          ) : (
            <Pressable
              onPress={() => setShowForm(true)}
              className="flex-row items-center justify-center rounded-2xl border border-dashed border-veranda-brass/50 py-4"
            >
              <Ionicons name="add-circle-outline" size={20} color={veranda.marigold} />
              <Text className="ml-2 font-semibold text-veranda-marigold">{t("addFamilyEvent")}</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function AddMemberForm({
  onSave,
  onCancel,
  t,
}: {
  onSave: (m: FamilyMember) => void;
  onCancel: () => void;
  t: ReturnType<typeof useT>;
}) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [dob, setDob] = useState("");
  const [kind, setKind] = useState<FamilyEntryKind>("birthday");
  const dobValid = dob.length === 0 || isValidDob(dob);
  const canSave = name.trim().length > 0 && isValidDob(dob);

  const submit = () => {
    if (!canSave) return;
    onSave({
      id: `m-${Date.now()}`,
      name: name.trim(),
      relation: relation.trim() || "Family",
      dob,
      kind,
    });
  };

  const inputClass =
    "mt-1 rounded-xl border border-veranda-brass/40 bg-white px-3 py-2 text-veranda-teak";

  return (
    <Card>
      <Text className="mb-2 font-bold text-veranda-teak">{t("addFamilyEvent")}</Text>

      <Text className="text-xs uppercase tracking-wide text-veranda-teak/45">{t("name")}</Text>
      <TextInput value={name} onChangeText={setName} placeholder="—" placeholderTextColor={`${veranda.teak}55`} className={inputClass} />

      <Text className="mt-3 text-xs uppercase tracking-wide text-veranda-teak/45">{t("relation")}</Text>
      <TextInput value={relation} onChangeText={setRelation} placeholder="Mother, Father…" placeholderTextColor={`${veranda.teak}55`} className={inputClass} />

      <Text className="mt-3 text-xs uppercase tracking-wide text-veranda-teak/45">{t("dateOfBirth")}</Text>
      <TextInput
        value={dob}
        onChangeText={setDob}
        placeholder="1990-05-21"
        placeholderTextColor={`${veranda.teak}55`}
        autoCapitalize="none"
        className={`${inputClass} ${dobValid ? "" : "border-veranda-terracotta"}`}
      />
      {!dobValid ? (
        <Text className="mt-1 text-xs text-veranda-terracotta">{t("dateFormatHint")}</Text>
      ) : null}

      <Text className="mt-3 text-xs uppercase tracking-wide text-veranda-teak/45">{t("type")}</Text>
      <View className="mt-1 flex-row rounded-full bg-veranda-teak/10 p-1">
        {(["birthday", "anniversary", "shraddha"] as const).map((k) => {
          const active = kind === k;
          return (
            <Pressable
              key={k}
              onPress={() => setKind(k)}
              className={`flex-1 items-center rounded-full py-2 ${active ? "bg-veranda-marigold" : ""}`}
            >
              <Text className={`text-xs font-bold ${active ? "text-white" : "text-veranda-teak/60"}`}>
                {kindMeta[k].label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4 flex-row" style={{ gap: 10 }}>
        <Pressable onPress={onCancel} className="flex-1 items-center rounded-full border border-veranda-brass/40 py-2.5">
          <Text className="font-bold text-veranda-teak/70">{t("cancel")}</Text>
        </Pressable>
        <Pressable
          onPress={submit}
          disabled={!canSave}
          className={`flex-1 items-center rounded-full py-2.5 ${canSave ? "bg-veranda-marigold" : "bg-veranda-marigold/40"}`}
        >
          <Text className="font-bold text-white">{t("save")}</Text>
        </Pressable>
      </View>
    </Card>
  );
}
