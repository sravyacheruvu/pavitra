import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { NotifPrefs } from "./profile";

/**
 * Local reminder notifications. Permission + a daily Sankalpam reminder are
 * wired here; festival / family-tithi / Rahu-Kalam reminders are scheduled from
 * their computed dates in a follow-up (prefs are already captured + stored).
 */

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status === "granted") return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  } catch {
    return false;
  }
}

/** Re-apply the scheduled reminders to match the current preferences. */
export async function applyReminderSchedule(prefs?: NotifPrefs): Promise<void> {
  try {
    if (Platform.OS === "web") return; // local scheduling isn't supported on web
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!prefs?.enabled) return;

    if (prefs.dailySankalpam) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Sankalpam 🪔",
          body: "Begin your morning dhyana — today's sankalpam is ready.",
        },
        trigger: { hour: 6, minute: 30, repeats: true } as any,
      });
    }
  } catch {
    // non-fatal
  }
}
