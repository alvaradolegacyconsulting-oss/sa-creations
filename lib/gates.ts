// Relative imports only: scripts/check-production-gates.ts runs this under tsx without the "@/" alias.
import { PLACEHOLDER } from "../content/types";

/** Every string under `value` that still contains "[PLACEHOLDER", as "path: text". */
export function findPlaceholders(value: unknown, path = "content"): string[] {
  if (typeof value === "string") return value.includes(PLACEHOLDER) ? [`${path}: ${value}`] : [];
  if (Array.isArray(value)) return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => findPlaceholders(item, `${path}.${key}`));
  }
  return [];
}

/** Every Photo (an object with `src` and `label`) whose src is still null: a placeholder box would ship. */
export function findMissingPhotos(value: unknown, path = "content"): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => findMissingPhotos(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  if ("src" in record && "label" in record && record.src === null) {
    const label = (record.label as { en?: string }).en ?? "";
    return [`${path}.src is null (${label})`];
  }
  return Object.entries(record).flatMap(([key, item]) => findMissingPhotos(item, `${path}.${key}`));
}

export type Gate = { name: string; problems: string[] };

/**
 * PLACEHOLDERS_RESOLVED: "[PLACEHOLDER" strings anywhere in content (incl. content/pending.ts) and
 * photos still missing. An empty gallery is not a problem: that section is simply absent.
 */
export function runGates(content: Record<string, unknown>): Gate[] {
  const problems = Object.entries(content).flatMap(([name, value]) => [...findPlaceholders(value, name), ...findMissingPhotos(value, name)]);
  return [{ name: "PLACEHOLDERS_RESOLVED", problems }];
}
