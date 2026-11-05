import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, Screen, ScreenHeader } from "../components/ui";
import { veranda } from "../theme/colors";
import {
  daysUntil,
  festivalsByDate,
  formatFestivalDate,
  observedDateFor,
  relativeDay,
} from "../data/festivalContent";
import { useLocation } from "../services/location";
import type { RootStackParamList } from "../navigation/types";
import { useLang, useT, pick } from "../i18n";
import { pickTerm, toScript } from "../i18n/script";
import { angaDev } from "../services/panchang";

const FESTIVAL_ICON: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  "varalakshmi-vratam": "flower-tulip",
  "ganesh-chaturthi": "elephant",
  "sharad-navratri-dussehra": "sword-cross",
  "diwali-lakshmi-pooja": "candle",
};

export default function FestivalsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { location } = useLocation();
  const festivals = festivalsByDate(location);
  const { lang } = useLang();
  const term = (roman?: string, sa?: string) => (lang === "en" || !sa ? (roman ?? "") : toScript(sa, lang));
  const t = useT();

  return (
    <Screen>
      <ScreenHeader title={t("festivals")} subtitle={`2026 · ${t("tapForGuide")}`} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 28, paddingTop: 8 }}>
        <View className="px-5" style={{ gap: 12 }}>
          {festivals.map((f) => {
            const fdate = observedDateFor(f, location);
            const days = daysUntil(fdate, undefined, location.timeZone);
            return (
              <Pressable
                key={f.id}
                onPress={() => navigation.navigate("FestivalPooja", { festivalId: f.id })}
              >
                <Card className="flex-row items-center">
                  <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-veranda-marigold/10">
                    <MaterialCommunityIcons
                      name={FESTIVAL_ICON[f.slug] ?? "star-four-points"}
                      size={26}
                      color={veranda.marigold}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-veranda-teak">{pickTerm(f.name, lang)}</Text>
                    {lang !== "en" && f.name.en ? (
                      <Text className="text-sm text-veranda-teak/55">{f.name.en}</Text>
                    ) : null}
                    <Text className="mt-0.5 text-xs text-veranda-marigold">
                      {formatFestivalDate(fdate)}
                      {f.observed_on.tithi ? ` · ${term(f.observed_on.masa, angaDev(f.observed_on.masa))} ${term(f.observed_on.tithi, angaDev(f.observed_on.tithi))}` : ""}
                    </Text>
                  </View>
                  <View className="items-end">
                    <View
                      className={`rounded-full px-2.5 py-1 ${
                        days <= 0 ? "bg-veranda-mango/15" : "bg-veranda-marigold/15"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          days <= 0 ? "text-veranda-mango" : "text-veranda-marigold"
                        }`}
                      >
                        {relativeDay(days)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={`${veranda.teak}66`}
                      style={{ marginTop: 6 }}
                    />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
