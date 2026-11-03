import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * User profile captured during onboarding and editable later. Persisted to
 * AsyncStorage; everything is optional so the app works with a partial profile.
 * (When Supabase is unpaused this can sync to the signed-in account.)
 */

export type Sampradaya = "smarta" | "vaishnava" | "shaiva" | "other";
export type MonthSystem = "amanta" | "purnimanta";

export type NotifPrefs = {
  enabled: boolean;
  dailySankalpam: boolean;
  festivals: boolean;
  rahuKalam: boolean;
  familyTithi: boolean;
};

export const DEFAULT_NOTIFS: NotifPrefs = {
  enabled: false,
  dailySankalpam: true,
  festivals: true,
  rahuKalam: false,
  familyTithi: true,
};

export type Profile = {
  name?: string;
  gotra?: string;
  ishtaDevata?: string; // deity id
  dob?: string; // ISO YYYY-MM-DD
  tob?: string; // birth time, HH:MM (24h) — sharpens the nakshatra
  birthPlace?: string; // display label, e.g. "Hyderabad, India"
  birthTimeZone?: string; // IANA tz of the birth place, for an accurate instant
  birthLat?: number;
  birthLng?: number;
  nakshatra?: string; // derived birth nakshatra
  tradition?: { monthSystem: MonthSystem; sampradaya: Sampradaya };
  deities?: string[]; // followed deity ids
  notifications?: NotifPrefs;
  completedAt?: string;
};

const STORAGE_KEY = "pavitra.profile";

type Ctx = {
  profile: Profile;
  ready: boolean;
  update: (patch: Partial<Profile>) => void;
  reset: () => void;
};

const ProfileContext = createContext<Ctx>({
  profile: {},
  ready: true,
  update: () => {},
  reset: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setProfile(JSON.parse(raw) as Profile);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = (p: Profile) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p)).catch(() => {});
  };

  const update = (patch: Partial<Profile>) =>
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });

  const reset = () => {
    setProfile({});
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <ProfileContext.Provider value={{ profile, ready, update, reset }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
