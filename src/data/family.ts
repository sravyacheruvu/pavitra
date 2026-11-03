/** Family Vault seed data — each entry stores its original Gregorian date;
 *  the panchang service derives the janma tithi and next recurrence. */
export type FamilyEntryKind = "birthday" | "anniversary" | "shraddha";

export type FamilyEntry = {
  name: string;
  relation: string;
  /** ISO Gregorian date (YYYY-MM-DD) of the original event. */
  dob: string;
  kind: FamilyEntryKind;
};

export const FAMILY_ENTRIES: FamilyEntry[] = [
  { name: "Amma", relation: "Mother", dob: "1958-08-21", kind: "birthday" },
  { name: "Nanna", relation: "Father", dob: "1955-11-02", kind: "birthday" },
  { name: "Wedding Day", relation: "Anniversary", dob: "1985-04-24", kind: "anniversary" },
  { name: "Tatagaru", relation: "Grandfather · Shraddha", dob: "1996-09-10", kind: "shraddha" },
];
