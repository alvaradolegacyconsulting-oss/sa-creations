import { site } from "@/content/site";

/**
 * Two-tone text wordmark until the logo file arrives: the top line in copper (gold on dark backgrounds,
 * where copper fails contrast) over the bottom line in small caps.
 */
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`font-display text-[1.75rem] font-semibold ${dark ? "text-gold" : "text-copper"}`}>{site.wordmark.top}</span>
      <span className={`mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.24em] ${dark ? "text-ivory" : "text-navy"}`}>
        {site.wordmark.bottom}
      </span>
    </span>
  );
}
