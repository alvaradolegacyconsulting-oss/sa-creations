import type { ServiceId } from "./services";
import { placeholder, type LocalizedText, type NoPhoto, type Photo } from "./types";

/** What a season (or the evergreen fallback) shows: the home band and the /season page. */
export type SeasonCopy = {
  headline: LocalizedText;
  body: LocalizedText;
  /** Shown as chips, like a service card's items. May be empty. */
  occasions: LocalizedText[];
  /** `{ kind: "none" }` shows no photo, on purpose. */
  photo: Photo | NoPhoto;
  /** Links to the contact form. `service` also checks that service's box. */
  cta: { label: LocalizedText; service?: ServiceId };
};

/**
 * One dated season. `start` and `end` are inclusive Central calendar dates ("YYYY-MM-DD"): the season
 * shows from midnight Central on `start` until midnight Central after `end`. Seasons must not overlap
 * (the build fails if they do).
 */
export type Season = SeasonCopy & {
  /** Lowercase slug, unique, e.g. "christmas-2026". Used in the preview URL and passed to the contact form. */
  id: string;
  start: string;
  end: string;
  /** Short name: the "Asking about" chip on the form and the inquiry email. */
  name: LocalizedText;
};

export type SeasonalContent = {
  /** Small line above the evergreen headline. A season shows its own name there instead. */
  evergreenEyebrow: LocalizedText;
  /** The /season page's title and description (search results and shares). */
  page: { title: LocalizedText; description: LocalizedText };
  /** Link from the home band to /season. */
  seeMore: LocalizedText;
  /** Preview pages (/season/<id>, preview sites only). {start} and {end} are filled in with the dates. */
  preview: {
    label: LocalizedText;
    dates: LocalizedText;
    notActive: LocalizedText;
    active: LocalizedText;
    listHeading: LocalizedText;
    listNote: LocalizedText;
  };
  /** Shown whenever no season is active (and before the browser has worked out today's date). Required. */
  evergreen: SeasonCopy;
  seasons: Season[];
};

export const seasonal: SeasonalContent = {
  evergreenEyebrow: { en: "For every occasion" },
  page: {
    title: { en: "This season" },
    description: { en: placeholder("/season page description") },
  },
  seeMore: { en: "See this season" },
  preview: {
    label: { en: "Season preview" },
    dates: { en: "Runs {start} to {end}." },
    notActive: { en: "Preview of a season that isn't active today." },
    active: { en: "This is the season showing on the site today." },
    listHeading: { en: "Preview every season" },
    listNote: { en: "Shown on preview sites only, never on the live site." },
  },
  evergreen: {
    headline: { en: placeholder("evergreen headline") },
    body: { en: placeholder("evergreen body") },
    occasions: [],
    photo: { kind: "none" },
    cta: { label: { en: placeholder("evergreen call to action") } },
  },
  // The seasons arrive in a content commit (preflight 004-B step 4).
  seasons: [],
};
