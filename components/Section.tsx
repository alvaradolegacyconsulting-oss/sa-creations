import type { ReactNode } from "react";
import type { SectionIntro } from "@/content/types";
import { EmphasizedText } from "@/components/EmphasizedText";
import { t } from "@/lib/i18n";

export type SectionTone = "ivory" | "white" | "navy";

const toneClasses: Record<SectionTone, string> = {
  ivory: "bg-ivory text-ink",
  white: "bg-white text-ink",
  navy: "on-dark bg-navy text-ivory",
};

/** Page-width container with the standard side gutters. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** Copper on light backgrounds, gold on navy. */
export function Eyebrow({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-gold" : "text-copper"} ${className}`}>
      {children}
    </p>
  );
}

/** A home-page section: anchor id, eyebrow, h2 and content, on one of the theme backgrounds. */
export function Section({
  id,
  intro,
  tone = "ivory",
  centered = false,
  aside,
  children,
}: {
  id: string;
  intro: SectionIntro;
  tone?: SectionTone;
  /** Centered eyebrow and heading (services); otherwise left-aligned. */
  centered?: boolean;
  /** Short link shown beside the heading on desktop, under it on phones. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  const dark = tone === "navy";
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={`${toneClasses[tone]} py-16 sm:py-20`}>
      <Container>
        <div className={centered ? "text-center" : "sm:flex sm:items-end sm:justify-between sm:gap-8"}>
          <div className={centered ? "mx-auto max-w-3xl" : "max-w-2xl"}>
            <Eyebrow dark={dark}>{t(intro.eyebrow)}</Eyebrow>
            <h2
              id={headingId}
              className={`mt-3 font-display text-[2.25rem] font-medium leading-[1.1] sm:text-5xl ${dark ? "text-ivory" : "text-navy"}`}
            >
              <EmphasizedText text={intro.heading} />
            </h2>
          </div>
          {aside && <div className="mt-4 sm:mt-0 sm:shrink-0">{aside}</div>}
        </div>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
