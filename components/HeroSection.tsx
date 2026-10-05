import { ButtonLink } from "@/components/ButtonLink";
import { EmphasizedText } from "@/components/EmphasizedText";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Container, Eyebrow } from "@/components/Section";
import { hero } from "@/content/hero";
import { t } from "@/lib/i18n";
import { sectionHref } from "@/lib/sections";

/** `showWorkLink` is false while the gallery is empty: "See our work" would point at nothing. */
export function HeroSection({ showWorkLink }: { showWorkLink: boolean }) {
  const [main, second, third] = hero.photos;

  return (
    <section aria-labelledby="hero-heading" className="bg-ivory pb-12 pt-6 sm:pt-12 lg:pb-16">
      <Container className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Photos first on phones (as in the concept), to the right on desktop. */}
        <div className="grid gap-3 sm:grid-cols-[1.15fr_1fr] lg:order-last">
          <PhotoFrame photo={main} shape="arch" priority sizes="(min-width: 1024px) 28vw, 100vw" className="aspect-[4/3] sm:aspect-auto sm:h-96 lg:h-[28rem]" />
          <div className="hidden gap-3 sm:grid sm:grid-rows-2">
            <PhotoFrame photo={second} sizes="(min-width: 1024px) 20vw, 45vw" className="h-full" />
            <PhotoFrame photo={third} sizes="(min-width: 1024px) 20vw, 45vw" className="h-full" />
          </div>
        </div>

        <div>
          <Eyebrow>{t(hero.eyebrow)}</Eyebrow>
          <h1 id="hero-heading" className="mt-4 font-display text-[2.75rem] font-medium leading-[1.05] text-navy sm:text-6xl lg:text-[4.25rem]">
            <EmphasizedText text={hero.headline} />
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{t(hero.subhead)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={sectionHref("contact")}>{t(hero.primaryCta)}</ButtonLink>
            {showWorkLink && (
              <ButtonLink href={sectionHref("gallery")} variant="outline">
                {t(hero.secondaryCta)}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
