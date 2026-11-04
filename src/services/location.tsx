import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { AppLocation, DEFAULT_LOCATION } from "../config/location";

const isWeb = Platform.OS === "web";

/** Browser geolocation (web) — a Promise wrapper the native SDK doesn't give us reliably. */
function webGetPosition(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    const g = typeof navigator !== "undefined" ? navigator.geolocation : undefined;
    if (!g) {
      reject(new Error("geolocation-unavailable"));
      return;
    }
    g.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

/**
 * Device-location service. Asks for foreground location permission, resolves the
 * user's coordinates to a city name + timezone, and exposes the active location
 * app-wide so panchang/muhurtam timings are computed for exactly where they are.
 * Falls back to DEFAULT_LOCATION (Bengaluru) when permission is denied.
 */

const STORAGE_KEY = "pavitra.location";

export type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

type Ctx = {
  location: AppLocation;
  status: LocationStatus;
  usingDevice: boolean;
  request: () => Promise<void>;
  /** Manually set the active location (e.g. from a city search). */
  setManual: (loc: AppLocation) => void;
};

const LocationContext = createContext<Ctx>({
  location: DEFAULT_LOCATION,
  status: "idle",
  usingDevice: false,
  request: async () => {},
  setManual: () => {},
});

export type GeoCity = { name: string; latitude: number; longitude: number; timeZone: string };

/**
 * Resolve a city name to coordinates + timezone (keyless Open-Meteo geocoder).
 * Throws on a network/service failure so the UI can tell "no match" apart from
 * "couldn't reach the lookup service".
 */
export async function geocodeCity(q: string): Promise<GeoCity[]> {
  const query = q.trim();
  if (!query) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
  );
  if (!res.ok) throw new Error(`geocode ${res.status}`);
  const j = await res.json();
  const results = Array.isArray(j?.results) ? j.results : [];
  return results
    .filter((r: any) => r?.timezone && typeof r.latitude === "number")
    .map((r: any) => ({
      name: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
      latitude: r.latitude,
      longitude: r.longitude,
      timeZone: r.timezone,
    }));
}

const deviceTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_LOCATION.timeZone;
  } catch {
    return DEFAULT_LOCATION.timeZone;
  }
};

/** City name from coordinates — native geocoder first, keyless HTTP fallback (web). */
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const r = await Location.reverseGeocodeAsync({ latitude, longitude });
    const p = r?.[0];
    const name = p?.city || p?.subregion || p?.district || p?.region;
    if (name) return name;
  } catch {
    // reverseGeocodeAsync is unsupported on web — fall through to the HTTP lookup.
  }
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const j = await res.json();
    const name = j.city || j.locality || j.principalSubdivision || j.countryName;
    if (name) return name as string;
  } catch {
    // ignore
  }
  return "Current location";
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<AppLocation>(DEFAULT_LOCATION);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [usingDevice, setUsingDevice] = useState(false);
  const asked = useRef(false);

  const applyPosition = async (coords: { latitude: number; longitude: number }) => {
    const name = await reverseGeocode(coords.latitude, coords.longitude);
    const next: AppLocation = {
      name,
      latitude: coords.latitude,
      longitude: coords.longitude,
      timeZone: deviceTimeZone(),
    };
    setLocation(next);
    setUsingDevice(true);
    setStatus("granted");
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // non-fatal
    }
  };

  const setManual = (loc: AppLocation) => {
    setLocation(loc);
    setUsingDevice(true);
    setStatus("granted");
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loc)).catch(() => {});
  };

  const request = async () => {
    setStatus("loading");
    // Web: go straight to the browser's geolocation API. Expo's web shim is
    // unreliable across mobile browsers, so this is the dependable path.
    if (isWeb) {
      try {
        const coords = await webGetPosition();
        await applyPosition(coords);
      } catch (e: any) {
        // code 1 = permission denied; anything else (timeout, no API) = unavailable.
        setStatus(e && e.code === 1 ? "denied" : "unavailable");
      }
      return;
    }
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== "granted") {
        setStatus("denied");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await applyPosition(pos.coords);
    } catch {
      setStatus("unavailable");
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      // 1) Hydrate last-known device location for an instant accurate first paint.
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && active) {
          const saved = JSON.parse(raw) as AppLocation;
          if (saved?.latitude && saved?.longitude) {
            setLocation({ ...saved, timeZone: saved.timeZone || deviceTimeZone() });
            setUsingDevice(true);
            setStatus("granted");
          }
        }
      } catch {
        // ignore
      }

      // 2) On web we do NOT auto-prompt — the browser only grants geolocation in
      //    response to a user gesture, and auto-calling it just leaves the UI
      //    stuck on "Locating…". The user taps "Use my current location" (or the
      //    onboarding location step) when they're ready. Native keeps the silent
      //    refresh / one-time ask.
      if (isWeb) return;
      try {
        const perm = await Location.getForegroundPermissionsAsync();
        if (!active) return;
        if (perm.status === "granted") {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (active) await applyPosition(pos.coords);
        } else if (perm.status !== "denied" || perm.canAskAgain) {
          if (!asked.current) {
            asked.current = true;
            await request();
          }
        } else {
          setStatus("denied");
        }
      } catch {
        if (active) setStatus("unavailable");
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider value={{ location, status, usingDevice, request, setManual }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
