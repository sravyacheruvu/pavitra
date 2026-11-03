/**
 * The location panchang windows are computed for. Because panchang timings are
 * hyper-local (they depend on sunrise/sunset at a precise spot), everything in
 * the app reads from here. Later this can be driven by device GPS
 * (expo-location) or a user setting in Family Vault.
 */
export type AppLocation = {
  name: string;
  latitude: number;
  longitude: number;
  /** IANA timezone — times are always formatted in the LOCATION's zone,
   *  not the device's, so a phone in another country still shows local timings. */
  timeZone: string;
};

export const DEFAULT_LOCATION: AppLocation = {
  name: "Bengaluru",
  latitude: 12.9716,
  longitude: 77.5946,
  timeZone: "Asia/Kolkata",
};
