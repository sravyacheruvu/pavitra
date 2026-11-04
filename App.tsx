import "./global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootNavigator from "./src/navigation/RootNavigator";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { LanguageProvider } from "./src/i18n";
import { AuthProvider } from "./src/services/auth";
import { LocationProvider } from "./src/services/location";
import { ProfileProvider } from "./src/services/profile";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <LanguageProvider>
            <LocationProvider>
              <ProfileProvider>
                <AuthProvider>
                  <RootNavigator />
                </AuthProvider>
              </ProfileProvider>
            </LocationProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
