import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { AppLocation, DEFAULT_LOCATION } from "../config/location";

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
};

const LocationContext = createContext<Ctx>({
  location: DEFAULT_LOCATION,
  status: "idle",
  usingDevice: false,
  request: async () => {},
});

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

  const request = async () => {
    setStatus("loading");
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

      // 2) Check permission: refresh silently if granted, otherwise ask once.
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
    <LocationContext.Provider value={{ location, status, usingDevice, request }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
