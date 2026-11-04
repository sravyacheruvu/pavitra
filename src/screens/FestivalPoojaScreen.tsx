import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card, Pill, SectionHeader } from "../components/ui";
import { AskAssistant } from "../components/AskAssistant";
import { veranda } from "../theme/colors";
import { FESTIVALS, FestivalDoc, Vidhi, VidhiStep, formatFestivalDate } from "../data/festivalContent";
import { ENUMERATIONS, Enumeration } from "../data/enumerations";
import type { RootStackParamList } from "../navigation/types";
import { useLang, useT, pick, UILang } from "../i18n";
import { pickTerm, toScript } from "../i18n/script";
import { angaDev } from "../services/panchang";

type Props = NativeStackScreenProps<RootStackParamList, "FestivalPooja">;

const PACES = [
  { key: "slow", mult: 1.5, label: "paceSlow" as const },
  { key: "normal", mult: 1.0, label: "paceNormal" as const },
  { key: "fast", mult: 0.7, label: "paceFast" as const },
];

/** Comfortable dwell time for a step, from its reading length (+ extra for a mantra). */
function dwellMs(step: VidhiStep, mult: number): number {
  const words = `${step.title.en} ${step.instruction.en}`.trim().split(/\s+/).length;
  let ms = 8000 + words * 650;
  if (step.mantra) ms += 9000;
  ms = Math.max(12000, Math.min(45000, ms));
  return ms * mult;
}

/** Keep the screen awake on web (Wake Lock API) while a guide is running. No-op elsewhere. */
function useWakeLock() {
  useEffect(() => {
    let lock: any = null;
    let released = false;
    const nav: any = typeof navigator !== "undefined" ? navigator : null;
    const request = async () => {
      try {
        if (nav?.wakeLock?.request) lock = await nav.wakeLock.request("screen");
      } catch {
        /* ignore — not supported / denied */
      }
    };
    request();
    const onVis = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible" && !released) request();
    };
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVis);
    return () => {
      released = true;
      try {
        lock?.release?.();
      } catch {
        /* ignore */
      }
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
}

export default function FestivalPoojaScreen({ route, navigation }: Props) {
  const { lang } = useLang();
  const t = useT();
  const festival = useMemo<FestivalDoc | undefined>(
    () => FESTIVALS.find((f) => f.id === route.params.festivalId),
    [route.params.festivalId]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: festival ? pick(festival.name, lang) : "Pooja" });
  }, [navigation, festival, lang]);

  const [mode, setMode] = useState<"sankshipta" | "sampurna">("sampurna");
  const [guideOpen, setGuideOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const term = (roman?: string, sa?: string) => (lang === "en" || !sa ? (roman ?? "") : toScript(sa, lang));

  if (!festival) {
    return (
      <SafeAreaView edges={["bottom"]} className="flex-1 items-center justify-center bg-veranda-parchment">
        <Text className="text-veranda-teak/60">Festival not found.</Text>
      </SafeAreaView>
    );
  }

  const vidhi = festival.vidhi[mode];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-veranda-parchment">
      {/* Fixed top bar — back + title + Ask Pavitra (the tab bar stays below) */}
      <View className="flex-row items-center border-b border-veranda-brass/25 bg-veranda-teak px-3 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="h-9 w-9 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={veranda.brass} />
        </Pressable>
        <Text className="ml-1 flex-1 font-display text-lg font-bold text-veranda-brass" numberOfLines={1}>
          {pickTerm(festival.name, lang)}
        </Text>
        <Pressable
          onPress={() => setAskOpen(true)}
          hitSlop={8}
          accessibilityLabel={t("askPavitra")}
          className="h-10 flex-row items-center rounded-full border border-veranda-brass/40 px-3"
        >
          <Ionicons name="sparkles" size={16} color={veranda.brass} />
          <Text className="ml-1 text-[12px] font-bold text-veranda-brass">{t("askPavitra")}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="border-b border-veranda-brass/15 bg-white px-5 pb-5 pt-4">
          <Text className="font-display text-2xl font-bold text-veranda-coralDeep">{pickTerm(festival.name, lang)}</Text>
          {lang !== "en" && festival.name.en ? (
            <Text className="mt-0.5 text-veranda-teakSubtle">{festival.name.en}</Text>
          ) : null}
          <Text className="mt-1 text-xs text-veranda-teakSubtle/80">
            {formatFestivalDate(festival.observed_on.date)}
            {festival.observed_on.tithi ? ` · ${term(festival.observed_on.masa, angaDev(festival.observed_on.masa))} ${term(festival.observed_on.tithi, angaDev(festival.observed_on.tithi))}` : ""}
          </Text>
        </View>

        {/* Guided pooja: mode toggle + hands-free display */}
        <SectionHeader>{t("guidedPooja")}</SectionHeader>
        <View className="px-5">
          <View className="mb-3 flex-row rounded-full bg-veranda-teak/10 p-1">
            {(["sankshipta", "sampurna"] as const).map((m) => {
              const active = mode === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  className={`flex-1 items-center rounded-full py-2 ${active ? "bg-veranda-marigold" : ""}`}
                >
                  <Text className={`text-xs font-bold ${active ? "text-white" : "text-veranda-teak/60"}`}>
                    {pick(festival.vidhi[m].label, lang)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Hands-free guided display entry */}
        <View className="px-5">
          <GuidedCard
            stepCount={vidhi.steps.length}
            minutes={vidhi.duration_minutes}
            title={t("guidedPooja")}
            cta={t("beginGuided")}
            hint={t("autoAdvanceHint")}
            onStart={() => setGuideOpen(true)}
          />
        </View>

        {/* Full step list (readable reference) */}
        <SectionHeader>{t("vidhi")}</SectionHeader>
        <View className="px-5">
          <VidhiSteps vidhi={vidhi} lang={lang} />
        </View>

        {/* Nine nights (Navratri) */}
        {festival.nine_nights ? (
          <>
            <SectionHeader>{t("nineNights")}</SectionHeader>
            <View className="px-5">
              <Card className="p-0">
                {festival.nine_nights.map((n, i) => (
                  <View
                    key={n.day}
                    className={`flex-row items-center px-4 py-3 ${
                      i < festival.nine_nights!.length - 1 ? "border-b border-veranda-brass/20" : ""
                    }`}
                  >
                    <Text className="w-6 font-bold text-veranda-marigold">{n.day}</Text>
                    <Text className="flex-1 font-semibold text-veranda-teak">{n.form.en}</Text>
                    <Text className="text-xs text-veranda-teak/55">{n.color}</Text>
                  </View>
                ))}
              </Card>
            </View>
          </>
        ) : null}

        {/* Samagri */}
        <SectionHeader>{t("samagri")}</SectionHeader>
        <View className="px-5">
          <Card>
            {festival.samagri.map((s, i) => (
              <View
                key={s.id}
                className={`flex-row items-start ${i < festival.samagri.length - 1 ? "mb-2" : ""}`}
              >
                <Ionicons name="ellipse" size={7} color={veranda.brass} style={{ marginTop: 7, marginRight: 8 }} />
                <Text className="flex-1 text-sm text-veranda-teak/85">
                  {pick(s.name, lang)}
                  <Text className="text-veranda-teak/45">  {s.quantity}</Text>
                </Text>
                {s.essential ? <Pill label="✓" tone="mango" /> : null}
              </View>
            ))}
          </Card>
        </View>

        {/* Prasadam */}
        <SectionHeader>{t("prasadam")}</SectionHeader>
        <View className="px-5" style={{ gap: 12 }}>
          {festival.prasadam.map((p) => (
            <Card key={p.id}>
              <Text className="text-base font-bold text-veranda-teak">{pick(p.name, lang)}</Text>
              <Text className="mt-2 text-xs font-bold uppercase tracking-wide text-veranda-teak/45">
                {t("ingredients")}
              </Text>
              <Text className="text-sm text-veranda-teak/75">
                {p.ingredients.map((ing) => pick(ing.item, lang)).join(" · ")}
              </Text>
              <Text className="mt-2 text-xs font-bold uppercase tracking-wide text-veranda-teak/45">
                {t("method")}
              </Text>
              {p.steps.map((st, i) => (
                <Text key={i} className="mt-1 text-sm text-veranda-teak/75">
                  {i + 1}. {st.en}
                </Text>
              ))}
            </Card>
          ))}
        </View>
      </ScrollView>

      {guideOpen ? (
        <GuidedMode
          festivalName={pickTerm(festival.name, lang)}
          vidhiLabel={pick(vidhi.label, lang)}
          steps={vidhi.steps}
          lang={lang}
          t={t}
          onClose={() => setGuideOpen(false)}
        />
      ) : null}
      <AskAssistant open={askOpen} onClose={() => setAskOpen(false)} context={pickTerm(festival.name, lang)} />
    </SafeAreaView>
  );
}

function GuidedCard({
  stepCount,
  minutes,
  title,
  cta,
  hint,
  onStart,
}: {
  stepCount: number;
  minutes?: number;
  title: string;
  cta: string;
  hint: string;
  onStart: () => void;
}) {
  return (
    <Card className="bg-veranda-teak">
      <View className="flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-veranda-brass/25">
          <Ionicons name="book" size={22} color={veranda.brass} />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-veranda-parchment">{title}</Text>
          <Text className="text-xs text-veranda-parchment/60">
            {stepCount} steps{minutes ? ` · ~${minutes} min` : ""}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onStart}
        disabled={stepCount === 0}
        className="mt-4 flex-row items-center justify-center rounded-full bg-veranda-marigold py-3.5"
      >
        <Ionicons name="play" size={18} color="#fff" />
        <Text className="ml-2 text-base font-bold text-white">{cta}</Text>
      </Pressable>
      <Text className="mt-2 text-center text-[11px] text-veranda-parchment/50">{hint}</Text>
    </Card>
  );
}

/**
 * Full-screen, distraction-free guided display: one step at a time in large
 * type, auto-advancing at the chosen pace, with pause and manual back/next.
 */
function GuidedMode({
  festivalName,
  vidhiLabel,
  steps,
  lang,
  t,
  onClose,
}: {
  festivalName: string;
  vidhiLabel: string;
  steps: VidhiStep[];
  lang: UILang;
  t: ReturnType<typeof useT>;
  onClose: () => void;
}) {
  useWakeLock();

  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [paceMult, setPaceMult] = useState(1.0);
  const [elapsed, setElapsed] = useState(0);

  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const paceRef = useRef(1.0);
  const elapsedRef = useRef(0);

  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { paceRef.current = paceMult; }, [paceMult]);

  const complete = index >= total;

  // One ticking interval for the component's life; it reads the refs.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      if (indexRef.current >= total) return;
      const cur = steps[indexRef.current];
      // Enumerated recitation steps (108 names, the 21 leaves…) hold until the
      // user advances manually — they shouldn't be rushed by a timer.
      if (cur.detailsRef) return;
      const d = dwellMs(cur, paceRef.current);
      const next = elapsedRef.current + 100;
      if (next >= d) {
        elapsedRef.current = 0;
        setElapsed(0);
        setIndex((i) => i + 1);
      } else {
        elapsedRef.current = next;
        setElapsed(next);
      }
    }, 100);
    return () => clearInterval(id);
  }, [steps, total]);

  const go = useCallback(
    (to: number) => {
      const clamped = Math.max(0, Math.min(total, to));
      elapsedRef.current = 0;
      setElapsed(0);
      setIndex(clamped);
    },
    [total]
  );

  const step = complete ? undefined : steps[index];
  const held = !!step?.detailsRef;
  const stepFraction = step && !held ? Math.min(1, elapsed / dwellMs(step, paceMult)) : 0;
  const overall = complete ? 1 : total > 0 ? Math.min(1, (index + stepFraction) / total) : 0;
  const enumeration = step?.detailsRef ? ENUMERATIONS[step.detailsRef] : undefined;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-veranda-parchment" edges={["top", "bottom"]}>
        {/* Top bar */}
        <View className="flex-row items-start justify-between px-5 pt-3">
          <View className="min-w-0 flex-1 pr-3">
            <Text className="text-sm font-bold text-veranda-teak" numberOfLines={1}>
              {festivalName}
            </Text>
            <Text className="text-xs text-veranda-teak/50" numberOfLines={1}>
              {vidhiLabel}
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={10} className="h-9 w-9 items-center justify-center rounded-full bg-veranda-teak/10">
            <Ionicons name="close" size={20} color={veranda.teak} />
          </Pressable>
        </View>

        {/* Progress */}
        <View className="px-5 pt-3">
          {!complete ? (
            <Text className="mb-1 text-center text-xs font-semibold tracking-wide text-veranda-teak/45">
              {index + 1} / {total}
            </Text>
          ) : null}
          <View className="h-1.5 overflow-hidden rounded-full bg-veranda-teak/10">
            <View className="h-full rounded-full bg-veranda-marigold" style={{ width: `${Math.round(overall * 100)}%` }} />
          </View>
        </View>

        {/* Center: the current step, or completion */}
        {complete ? (
          <View className="flex-1 items-center justify-center px-8">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-veranda-marigold/15">
              <MaterialHands />
            </View>
            <Text className="mt-6 text-2xl font-bold text-veranda-teak">{t("poojaComplete")}</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: enumeration ? "flex-start" : "center",
              paddingHorizontal: 28,
              paddingVertical: 20,
            }}
          >
            <View className="items-center">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-veranda-marigold">
                <Text className="text-xl font-bold text-white">{index + 1}</Text>
              </View>
              <Text className="mt-5 text-center text-3xl font-bold leading-9 text-veranda-teak">
                {pick(step!.title, lang)}
              </Text>
              <Text className="mt-4 text-center text-xl leading-8 text-veranda-teak/80">
                {pick(step!.instruction, lang)}
              </Text>
              {step!.mantra ? (
                <View className="mt-6 w-full rounded-2xl bg-veranda-teak/5 px-5 py-4">
                  <Text className="text-center text-2xl font-semibold leading-9 text-veranda-terracotta">
                    {step!.mantra.sa}
                  </Text>
                  <Text className="mt-2 text-center text-base italic text-veranda-teak/60">
                    {step!.mantra.transliteration}
                  </Text>
                </View>
              ) : null}
              {enumeration ? <EnumerationView enumeration={enumeration} lang={lang} /> : null}
            </View>
          </ScrollView>
        )}

        {/* Bottom controls */}
        <View className="px-6 pb-2 pt-1">
          {!complete ? (
            <>
              {/* Pace (only meaningful while a step is auto-advancing) */}
              {!held ? (
                <View className="mb-4 flex-row justify-center" style={{ gap: 8 }}>
                  {PACES.map((p) => {
                    const active = paceMult === p.mult;
                    return (
                      <Pressable
                        key={p.key}
                        onPress={() => setPaceMult(p.mult)}
                        className={`rounded-full border px-3 py-1 ${
                          active ? "border-veranda-marigold bg-veranda-marigold/10" : "border-veranda-brass/40"
                        }`}
                      >
                        <Text className={`text-xs font-bold ${active ? "text-veranda-marigold" : "text-veranda-teak/55"}`}>
                          {t(p.label)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {/* Transport — on a recitation step the centre button advances when ready */}
              <View className="flex-row items-center justify-center">
                <Pressable onPress={() => go(index - 1)} disabled={index === 0} className="px-5">
                  <Ionicons name="play-skip-back" size={28} color={index === 0 ? `${veranda.teak}33` : veranda.teak} />
                </Pressable>
                <Pressable
                  onPress={held ? () => go(index + 1) : () => setPaused((p) => !p)}
                  className="mx-3 h-20 w-20 items-center justify-center rounded-full bg-veranda-marigold"
                >
                  <Ionicons
                    name={held ? "arrow-forward" : paused ? "play" : "pause"}
                    size={36}
                    color="#fff"
                    style={{ marginLeft: held || paused ? 3 : 0 }}
                  />
                </Pressable>
                <Pressable onPress={() => go(index + 1)} className="px-5">
                  <Ionicons name="play-skip-forward" size={28} color={veranda.teak} />
                </Pressable>
              </View>
            </>
          ) : (
            <View className="flex-row items-center justify-center" style={{ gap: 12 }}>
              <Pressable
                onPress={() => {
                  setPaused(false);
                  go(0);
                }}
                className="flex-row items-center rounded-full border border-veranda-brass/40 px-5 py-3"
              >
                <Ionicons name="refresh" size={18} color={veranda.teak} />
                <Text className="ml-2 font-bold text-veranda-teak">{t("beginAgain")}</Text>
              </Pressable>
              <Pressable onPress={onClose} className="flex-row items-center rounded-full bg-veranda-marigold px-6 py-3">
                <Text className="font-bold text-white">{t("done")}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function MaterialHands() {
  // Ionicons has no "pray" glyph; a flower stands in for the completion mark.
  return <Ionicons name="flower" size={44} color={veranda.marigold} />;
}

/** Large, readable enumeration shown inside the guided display. */
function EnumerationView({ enumeration, lang }: { enumeration: Enumeration; lang: UILang }) {
  return (
    <View className="mt-6 w-full">
      <Text className="text-center text-base font-bold text-veranda-teak">{pick(enumeration.label, lang)}</Text>
      {enumeration.intro ? (
        <Text className="mt-1 text-center text-sm text-veranda-teak/60">{pick(enumeration.intro, lang)}</Text>
      ) : null}
      <View className="mt-4" style={{ gap: 10 }}>
        {enumeration.items.map((it) => (
          <View key={it.n} className="flex-row items-start rounded-xl bg-veranda-teak/5 px-3 py-2.5">
            <View className="mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-veranda-marigold/15">
              <Text className="text-[11px] font-bold text-veranda-marigold">{it.n}</Text>
            </View>
            <View className="flex-1">
              {it.sa ? (
                <Text className="text-lg font-semibold leading-7 text-veranda-terracotta">{it.sa}</Text>
              ) : null}
              <Text className="text-sm italic text-veranda-teak/70">{it.tr}</Text>
              {it.en ? <Text className="mt-0.5 text-xs text-veranda-teak/45">{it.en}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function VidhiSteps({ vidhi, lang }: { vidhi: Vidhi; lang: UILang }) {
  return (
    <View style={{ gap: 12 }}>
      {vidhi.steps.map((step) => (
        <StepRow key={step.order} step={step} lang={lang} />
      ))}
    </View>
  );
}

function StepRow({ step, lang }: { step: VidhiStep; lang: UILang }) {
  const [open, setOpen] = useState(false);
  const enumeration = step.detailsRef ? ENUMERATIONS[step.detailsRef] : undefined;
  return (
    <View className="flex-row">
      <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-veranda-marigold/15">
        <Text className="text-xs font-bold text-veranda-marigold">{step.order}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-veranda-teak">{pick(step.title, lang)}</Text>
        <Text className="mt-0.5 text-sm text-veranda-teak/70">{pick(step.instruction, lang)}</Text>
        {step.mantra ? (
          <View className="mt-1.5 rounded-lg bg-veranda-teak/5 px-3 py-2">
            <Text className="text-sm font-semibold text-veranda-terracotta">{step.mantra.sa}</Text>
            <Text className="text-xs italic text-veranda-teak/60">{step.mantra.transliteration}</Text>
          </View>
        ) : null}
        {enumeration ? (
          <>
            <Pressable
              onPress={() => setOpen((o) => !o)}
              className="mt-2 flex-row items-center self-start rounded-full bg-veranda-marigold/10 px-3 py-1.5"
            >
              <Ionicons name={open ? "chevron-up" : "list"} size={14} color={veranda.marigold} />
              <Text className="ml-1.5 text-xs font-bold text-veranda-marigold">
                {open ? pick(enumeration.label, lang) : `${pick(enumeration.label, lang)} (${enumeration.items.length})`}
              </Text>
            </Pressable>
            {open ? (
              <View className="mt-2" style={{ gap: 8 }}>
                {enumeration.items.map((it) => (
                  <View key={it.n} className="flex-row items-start">
                    <Text className="mr-2 w-6 text-right text-xs font-bold text-veranda-marigold">{it.n}.</Text>
                    <View className="flex-1">
                      {it.sa ? <Text className="text-sm font-semibold text-veranda-terracotta">{it.sa}</Text> : null}
                      <Text className="text-xs italic text-veranda-teak/60">{it.tr}</Text>
                      {it.en ? <Text className="text-[11px] text-veranda-teak/40">{it.en}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </View>
  );
}
