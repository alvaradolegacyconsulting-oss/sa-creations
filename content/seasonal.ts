import type { ServiceId } from "./services";
import type { LocalizedText, NoPhoto, Photo } from "./types";

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
    description: { en: "Seasonal baskets, gifts and celebrations from S&A Creations, made by hand and made to order." },
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
    headline: { en: "Custom baskets, gifts and events for any occasion." },
    body: { en: "Whatever you're celebrating, we'll design it around you. Tell us about your occasion and we'll be in touch." },
    occasions: [],
    photo: { kind: "none" },
    cta: { label: { en: "Contact us" } },
  },
  // Calendar approved by Jose on Oct 11, 2026 (preflight 004-B). Dec 25 has no season on purpose: the
  // evergreen copy shows that day. Headlines are option A; Jose may swap them.
  seasons: [
    {
      id: "fall-2026",
      start: "2026-09-15",
      end: "2026-10-31",
      name: { en: "Fall & Halloween" },
      headline: { en: "Fall is here. Let's make it sweet." },
      body: {
        en: "Cozy fall baskets, Halloween treats and party setups, made by hand and made to order. Tell us who it's for and we'll take it from there.",
      },
      occasions: [{ en: "Fall baskets" }, { en: "Halloween treats" }, { en: "Fall parties" }],
      photo: { kind: "none" },
      cta: { label: { en: "Order a fall basket" }, service: "gifts" },
    },
    {
      id: "thanksgiving-2026",
      start: "2026-11-01",
      end: "2026-11-26",
      name: { en: "Thanksgiving" },
      headline: { en: "Bring something special to the table." },
      body: {
        en: "Hostess gifts, thank-you baskets and centerpieces for your family gathering. Order early so we can make it just right.",
      },
      occasions: [{ en: "Hostess gifts" }, { en: "Thank-you baskets" }, { en: "Centerpieces" }],
      photo: { kind: "none" },
      cta: { label: { en: "Plan your Thanksgiving gift" }, service: "gifts" },
    },
    {
      id: "christmas-2026",
      start: "2026-11-27",
      end: "2026-12-24",
      name: { en: "Christmas & holidays" },
      headline: { en: "Give a gift they'll remember." },
      body: {
        en: "Custom holiday baskets for family, friends, teachers and clients, plus decor for your holiday party. Spots fill up fast in December.",
      },
      occasions: [{ en: "Gift baskets" }, { en: "Office & client gifts" }, { en: "Holiday parties" }],
      photo: { kind: "none" },
      cta: { label: { en: "Order holiday gifts" }, service: "gifts" },
    },
    {
      id: "new-year-valentines-2027",
      start: "2026-12-26",
      end: "2027-02-14",
      name: { en: "New Year & Valentine's" },
      headline: { en: "Start the year with something sweet." },
      body: {
        en: "Ring in the new year with a celebration, then show someone you love them with a Valentine's basket made just for them.",
      },
      occasions: [{ en: "New Year events" }, { en: "Valentine's baskets" }, { en: "Date-night setups" }],
      photo: { kind: "none" },
      cta: { label: { en: "Plan something sweet" }, service: "gifts" },
    },
    {
      id: "spring-mothers-day-2027",
      start: "2027-02-15",
      end: "2027-05-09",
      name: { en: "Spring & Mother's Day" },
      headline: { en: "For the moms who do it all." },
      body: { en: "Mother's Day baskets, baby showers and spring celebrations, designed around the person you're celebrating." },
      occasions: [{ en: "Mother's Day baskets" }, { en: "Baby showers" }, { en: "Quinceañeras" }],
      photo: { kind: "none" },
      cta: { label: { en: "Celebrate Mom" }, service: "gifts" },
    },
    {
      id: "graduation-2027",
      start: "2027-05-10",
      end: "2027-06-30",
      name: { en: "Graduation & end of school" },
      headline: { en: "They did it. Celebrate in style." },
      body: { en: "Graduation baskets, teacher thank-you gifts and party decor for the big day." },
      occasions: [{ en: "Grad baskets" }, { en: "Teacher gifts" }, { en: "Graduation parties" }],
      photo: { kind: "none" },
      cta: { label: { en: "Plan the celebration" }, service: "events" },
    },
    {
      id: "summer-2027",
      start: "2027-07-01",
      end: "2027-09-14",
      name: { en: "Summer & back to school" },
      headline: { en: "Make summer a celebration." },
      body: { en: "Summer parties, birthday setups and back-to-school gifts to start the year right." },
      occasions: [{ en: "Summer events" }, { en: "Birthday setups" }, { en: "Back-to-school gifts" }],
      photo: { kind: "none" },
      cta: { label: { en: "Plan your summer event" }, service: "events" },
    },
  ],
};
