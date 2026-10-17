import Image from "next/image";
import { site } from "@/content/site";

/**
 * The logo image on light backgrounds (header, 404). On dark backgrounds (`dark`, the footer) the
 * file's near-black "CREATIONS" would disappear, so it's the two-tone text wordmark there instead:
 * "S&A" in gold over "Creations" in small caps.
 */
export function Logo({ dark = false, priority = false }: { dark?: boolean; priority?: boolean }) {
  if (!dark) {
    return (
      <Image
        src={site.logo.src}
        alt={site.businessName}
        width={site.logo.width}
        height={site.logo.height}
        priority={priority}
        sizes="96px"
        className="h-14 w-auto lg:h-16"
      />
    );
  }

  return (
    <span className="inline-flex flex-col leading-none">
      <span className="font-display text-[1.75rem] font-semibold text-gold">{site.wordmark.top}</span>
      <span className="mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ivory">{site.wordmark.bottom}</span>
    </span>
  );
}
