import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Screen, ScreenHeader, SectionHeader } from "../components/ui";
import { veranda } from "../theme/colors";
import { SAMAGRI_BY_VIDHI, Vidhi } from "../data/samagri";

/**
 * Pooja Companion — interactive samagri checklist, dual vidhi (procedure) modes,
 * and a hands-free audio player.
 *
 * The audio player here is a self-contained UI with simulated playback state so
 * it runs anywhere. To play real audio, install `expo-audio` and drive
 * `playing` / `progress` from a `useAudioPlayer` instance (see notes at bottom).
 */

export default function PoojaCompanionScreen() {
  const [vidhi, setVidhi] = useState<Vidhi>("sampurna");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const items = SAMAGRI_BY_VIDHI[vidhi];

  const toggle = (item: string) =>
    setChecked((c) => ({ ...c, [item]: !c[item] }));

  const doneCount = useMemo(
    () => items.filter((i) => checked[i]).length,
    [items, checked]
  );

  return (
    <Screen>
      <ScreenHeader title="Pooja Companion" subtitle="Varalakshmi Vratam" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Hands-free audio player */}
        <SectionHeader>Hands-free audio</SectionHeader>
        <View className="px-5">
          <AudioPlayer />
        </View>

        {/* Dual Vidhi mode toggle */}
        <SectionHeader>Vidhi mode</SectionHeader>
        <View className="px-5">
          <View className="flex-row rounded-full bg-veranda-teak/10 p-1">
            <ModeButton
              label="Sankshipta"
              hint="Quick"
              active={vidhi === "sankshipta"}
              onPress={() => setVidhi("sankshipta")}
            />
            <ModeButton
              label="Sampurna"
              hint="Full"
              active={vidhi === "sampurna"}
              onPress={() => setVidhi("sampurna")}
            />
          </View>
        </View>

        {/* Interactive samagri list */}
        <View className="flex-row items-center justify-between px-5">
          <SectionHeader>Samagri list</SectionHeader>
          <Text className="mt-6 text-xs font-semibold text-veranda-teak/55">
            {doneCount}/{items.length} ready
          </Text>
        </View>
        <View className="px-5">
          <Card className="p-0">
            {items.map((item, i) => {
              const on = !!checked[item];
              return (
                <Pressable
                  key={item}
                  onPress={() => toggle(item)}
                  className={`flex-row items-center px-4 py-3 ${
                    i < items.length - 1 ? "border-b border-veranda-brass/20" : ""
                  }`}
                >
                  <Ionicons
                    name={on ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={on ? veranda.mango : veranda.brass}
                  />
                  <Text
                    className={`ml-3 flex-1 ${
                      on
                        ? "text-veranda-teak/40 line-through"
                        : "text-veranda-teak"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

function ModeButton({
  label,
  hint,
  active,
  onPress,
}: {
  label: string;
  hint: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-full py-2 ${
        active ? "bg-veranda-marigold" : ""
      }`}
    >
      <Text
        className={`font-bold ${active ? "text-white" : "text-veranda-teak/70"}`}
      >
        {label}
      </Text>
      <Text
        className={`text-[11px] ${active ? "text-white/85" : "text-veranda-teak/45"}`}
      >
        {hint}
      </Text>
    </Pressable>
  );
}

function AudioPlayer() {
  // Simulated state — swap for expo-audio's useAudioPlayer when wiring real audio.
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.35);

  return (
    <Card className="bg-veranda-teak">
      <View className="flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-veranda-turmeric/25">
          <Ionicons name="musical-notes" size={24} color={veranda.turmeric} />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-veranda-parchment">
            Varalakshmi Vratam Katha
          </Text>
          <Text className="text-xs text-veranda-parchment/60">
            Narration · Telugu · 18:24
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-veranda-parchment/20">
        <View
          className="h-full rounded-full bg-veranda-turmeric"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </View>

      {/* Transport controls */}
      <View className="mt-3 flex-row items-center justify-center">
        <Pressable
          onPress={() => setProgress((p) => Math.max(0, p - 0.1))}
          className="px-4"
        >
          <Ionicons name="play-back" size={26} color={veranda.parchment} />
        </Pressable>
        <Pressable
          onPress={() => setPlaying((p) => !p)}
          className="mx-2 h-14 w-14 items-center justify-center rounded-full bg-veranda-marigold"
        >
          <Ionicons
            name={playing ? "pause" : "play"}
            size={28}
            color="#fff"
            style={{ marginLeft: playing ? 0 : 2 }}
          />
        </Pressable>
        <Pressable
          onPress={() => setProgress((p) => Math.min(1, p + 0.1))}
          className="px-4"
        >
          <Ionicons name="play-forward" size={26} color={veranda.parchment} />
        </Pressable>
      </View>
    </Card>
  );
}
