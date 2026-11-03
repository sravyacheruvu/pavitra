import { useEffect, useMemo, useState } from "react";
import { getPanchang } from "../services/panchang";
import { AppLocation } from "../config/location";
import { useLocation } from "../services/location";

/**
 * Recomputes the panchang and re-checks "active" windows every minute so the
 * Rahu Kalam badge and timeline stay live while the app is open. Uses the active
 * device location from LocationProvider unless an explicit override is passed.
 */
export function usePanchang(locationOverride?: AppLocation) {
  const { location: ctxLocation } = useLocation();
  const location = locationOverride ?? ctxLocation;

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const panchang = useMemo(() => getPanchang(now, location), [now, location]);
  return { panchang, now, timeZone: location.timeZone, location };
}
