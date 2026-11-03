import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootTabParamList = {
  DailyVeranda: undefined;
  Muhurtam: undefined;
  Festivals: undefined;
  FamilyVault: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  /** Per-festival pooja page (audio + vidhi + samagri + prasadam). */
  FestivalPooja: { festivalId: string };
};
