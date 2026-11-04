import { useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { getPanchang, Panchang } from "../services/panchang";
import { AppLocation, DEFAULT_LOCATION } from "../config/location";
import { useLocation } from "../services/location";

/**
 * Recomputes the panchang and re-checks "active" windows every minute so the
 * Rahu Kalam badge and timeline stay live while the app is open. Uses the active
 * device location from LocationProvider unless an explicit override is passed.
 *
 * Hardened: getPanchang can throw (e.g. SunCalc returns null sunrise for an
 * invalid/extreme coordinate), so we fall back to the last good panchang, then
 * to DEFAULT_LOCATION — never letting an exception blank the screen. The minute
 * tick only runs while the document is visible, to avoid churn in the background.
 */
export function usePanchang(locationOverride?: AppLocation) {
  const { location: ctxLocation } = useLocation();
  const location = locationOverride ?? ctxLocation;

  const [now, setNow] = useState(() => new Date());
  const lastGood = useRef<Panchang | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const visible = () =>
      typeof document === "undefined" || document.visibilityState === "visible";
    const id = setInterval(() => { if (visible()) tick(); }, 60_000);
    let onVis: (() => void) | undefined;
    if (Platform.OS === "web" && typeof document !== "undefined") {
      onVis = () => { if (visible()) tick(); };
      document.addEventListener("visibilitychange", onVis);
    }
    return () => {
      clearInterval(id);
      if (onVis && typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const panchang = useMemo(() => {
    try {
      const p = getPanchang(now, location);
      lastGood.current = p;
      return p;
    } catch {
      if (lastGood.current) return lastGood.current;
      try {
        const p = getPanchang(now, DEFAULT_LOCATION);
        lastGood.current = p;
        return p;
      } catch {
        // As an absolute last resort, re-throw so the ErrorBoundary shows a refresh card.
        throw new Error("Panchang unavailable");
      }
    }
  }, [now, location]);

  return { panchang, now, timeZone: location.timeZone, location };
}
