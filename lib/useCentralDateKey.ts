import { useSyncExternalStore } from "react";
import { centralDateKey } from "@/lib/time";

// Re-check once a minute so a page left open rolls over at Central midnight.
function subscribe(onChange: () => void): () => void {
  const interval = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(interval);
}

function getServerSnapshot(): null {
  return null;
}

/**
 * Today's Central date as "YYYY-MM-DD", computed in the browser (from casa-del-cordero). Returns null on
 * the server and during hydration, so a statically built page never uses the build machine's date.
 */
export function useCentralDateKey(): string | null {
  return useSyncExternalStore(subscribe, () => centralDateKey(), getServerSnapshot);
}
