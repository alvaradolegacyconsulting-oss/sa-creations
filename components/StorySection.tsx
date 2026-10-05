import { Container, Eyebrow } from "@/components/Section";
import { EmphasizedText } from "@/components/EmphasizedText";
import { sectionIds } from "@/content/navigation";
import { story } from "@/content/story";
import { t } from "@/lib/i18n";

/** Navy band: the story on the left, the verse on the right (stacked on phones). */
export function StorySection() {
  const headingId = `${sectionIds.story}-heading`;

  return (
    <section id={sectionIds.story} aria-labelledby={headingId} className="on-dark bg-navy py-16 text-ivory sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Eyebrow dark>{t(story.intro.eyebrow)}</Eyebrow>
          <h2 id={headingId} className="mt-3 font-display text-[2.25rem] font-medium leading-[1.1] sm:text-5xl">
            <EmphasizedText text={story.intro.heading} />
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ivory/85">{t(story.body)}</p>
        </div>
        <figure className="lg:text-center">
          <span aria-hidden="true" className="block h-px w-12 bg-gold lg:mx-auto" />
          <blockquote className="mt-6 font-display text-2xl italic leading-snug sm:text-[1.75rem]">
            <p>&ldquo;{t(story.verse.text)}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">{story.verse.reference}</figcaption>
        </figure>
      </Container>
    </section>
  );
}
