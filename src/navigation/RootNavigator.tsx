import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";

import BottomTabNavigator from "./BottomTabNavigator";
import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen";
import { veranda } from "../theme/colors";
import { useLang } from "../i18n";
import { useAuth } from "../services/auth";

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: veranda.parchment,
    primary: veranda.marigold,
    card: veranda.parchment,
    border: `${veranda.brass}66`,
    text: veranda.teak,
  },
};

/**
 * Root navigation. Shows the onboarding language screen on first run, then the
 * bottom tabs + per-festival pooja detail stack.
 */
export default function RootNavigator() {
  const { ready, onboarded } = useLang();
  const { session, loading: authLoading } = useAuth();

  // Avoid a flash of the wrong screen while AsyncStorage / session load.
  if (!ready || authLoading)
    return <View style={{ flex: 1, backgroundColor: veranda.parchment }} />;

  // 1) pick a language, 2) sign in / sign up, 3) enter the app.
  // Supabase is active again, so the AuthScreen gate is enabled. To bypass auth
  // (e.g. an open demo build), set AUTH_ENABLED = false.
  const AUTH_ENABLED = true;

  if (!onboarded) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen />
      </>
    );
  }

  if (AUTH_ENABLED && !session) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen />
      </>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
