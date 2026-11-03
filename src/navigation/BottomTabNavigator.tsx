import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import DailyVerandaScreen from "../screens/DailyVerandaScreen";
import PanchangamScreen from "../screens/PanchangamScreen";
import FestivalsScreen from "../screens/FestivalsScreen";
import FamilyVaultScreen from "../screens/FamilyVaultScreen";
import { veranda } from "../theme/colors";
import { useT } from "../i18n";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Primary bottom tabs: Daily Veranda (Home), Festivals, and Family Vault.
 * (The Panchangam and Pooja tabs were removed — the tithi lives on Veranda and
 * pooja guides are per-festival detail pages.)
 */
export default function BottomTabNavigator() {
  const t = useT();
  return (
    <Tab.Navigator
      initialRouteName="DailyVeranda"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: veranda.marigold,
        tabBarInactiveTintColor: `${veranda.teak}99`,
        tabBarStyle: {
          backgroundColor: veranda.parchment,
          borderTopColor: `${veranda.brass}66`,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="DailyVeranda"
        component={DailyVerandaScreen}
        options={{
          title: t("daily"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-sunset" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Muhurtam"
        component={PanchangamScreen}
        options={{
          title: t("muhurtam"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Festivals"
        component={FestivalsScreen}
        options={{
          title: t("festivals"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FamilyVault"
        component={FamilyVaultScreen}
        options={{
          title: t("family"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
