import { ComponentType } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import DailyVerandaScreen from "../screens/DailyVerandaScreen";
import PanchangamScreen from "../screens/PanchangamScreen";
import FestivalsScreen from "../screens/FestivalsScreen";
import FamilyVaultScreen from "../screens/FamilyVaultScreen";
import FestivalPoojaScreen from "../screens/FestivalPoojaScreen";
import { veranda } from "../theme/colors";
import { useT } from "../i18n";
import type { RootTabParamList } from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();

// FestivalPooja lives INSIDE the Daily and Festivals tab stacks (not the root),
// so the bottom tab bar stays visible on the pooja detail page and each page has
// a back button. The screen renders its own header (headerShown is false here).
const PoojaScreen = FestivalPoojaScreen as ComponentType<any>;

const DailyStackNav = createNativeStackNavigator();
function DailyStack() {
  return (
    <DailyStackNav.Navigator screenOptions={{ headerShown: false }}>
      <DailyStackNav.Screen name="DailyHome" component={DailyVerandaScreen} />
      <DailyStackNav.Screen name="FestivalPooja" component={PoojaScreen} />
    </DailyStackNav.Navigator>
  );
}

const FestivalsStackNav = createNativeStackNavigator();
function FestivalsStack() {
  return (
    <FestivalsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <FestivalsStackNav.Screen name="FestivalsHome" component={FestivalsScreen} />
      <FestivalsStackNav.Screen name="FestivalPooja" component={PoojaScreen} />
    </FestivalsStackNav.Navigator>
  );
}

/**
 * Primary bottom tabs: Daily (Veranda), Muhurtam, Festivals, Family. The Daily
 * and Festivals tabs are native stacks so the per-festival pooja detail keeps the
 * tab bar and gains a back button.
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
        component={DailyStack}
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
        component={FestivalsStack}
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
