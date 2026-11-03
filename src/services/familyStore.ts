import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAMILY_ENTRIES, FamilyEntryKind } from "../data/family";

/**
 * Persisted family members (AsyncStorage). Each stores a Gregorian DOB; the
 * panchang service derives the janma tithi and the next tithi-birthday.
 */
export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  dob: string; // ISO YYYY-MM-DD
  kind: FamilyEntryKind;
};

const STORAGE_KEY = "pavitra.family.v1";

function seedMembers(): FamilyMember[] {
  return FAMILY_ENTRIES.map((e, i) => ({ id: `seed-${i}`, ...e }));
}

export async function loadFamily(): Promise<FamilyMember[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as FamilyMember[];
    }
  } catch {
    /* fall through to seed */
  }
  const seeded = seedMembers();
  await saveFamily(seeded);
  return seeded;
}

export async function saveFamily(members: FamilyMember[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {
    /* ignore write errors */
  }
}

/** Validate an ISO YYYY-MM-DD date string. */
export function isValidDob(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  if (y < 1900 || y > 2100) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
