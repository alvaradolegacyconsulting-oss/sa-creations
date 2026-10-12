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
  evergreenEyebrow: { en: "For every occasion", es: "Para cada ocasión" },
  page: {
    title: { en: "This season", es: "Esta temporada" },
    description: {
      en: "Seasonal baskets, gifts and celebrations from S&A Creations, made by hand and made to order.",
      es: "Canastas, regalos y celebraciones de temporada de S&A Creations, hechos a mano y a tu medida.",
    },
  },
  seeMore: { en: "See this season", es: "Ve lo de esta temporada" },
  preview: {
    label: { en: "Season preview", es: "Vista previa de temporada" },
    dates: { en: "Runs {start} to {end}.", es: "Del {start} al {end}." },
    notActive: { en: "Preview of a season that isn't active today.", es: "Vista previa de una temporada que no está activa hoy." },
    active: { en: "This is the season showing on the site today.", es: "Esta es la temporada que se muestra hoy en el sitio." },
    listHeading: { en: "Preview every season", es: "Ver cada temporada" },
    listNote: {
      en: "Shown on preview sites only, never on the live site.",
      es: "Solo aparece en los sitios de prueba, nunca en el sitio público.",
    },
  },
  evergreen: {
    headline: {
      en: "Custom baskets, gifts and events for any occasion.",
      es: "Canastas, regalos y eventos personalizados para cualquier ocasión.",
    },
    body: {
      en: "Whatever you're celebrating, we'll design it around you. Tell us about your occasion and we'll be in touch.",
      es: "Sea lo que sea que celebres, lo diseñamos pensando en ti. Cuéntanos de tu ocasión y nos pondremos en contacto.",
    },
    occasions: [],
    photo: { kind: "none" },
    cta: { label: { en: "Contact us", es: "Contáctanos" } },
  },
  // Calendar approved by Jose on Oct 11, 2026 (preflight 004-B). Dec 25 has no season on purpose: the
  // evergreen copy shows that day. Headlines are option A; Jose may swap them.
  seasons: [
    {
      id: "fall-2026",
      start: "2026-09-15",
      end: "2026-10-31",
      name: { en: "Fall & Halloween", es: "Otoño y Halloween" },
      headline: { en: "Fall is here. Let's make it sweet.", es: "Llegó el otoño. Hagámoslo dulce." },
      body: {
        en: "Cozy fall baskets, Halloween treats and party setups, made by hand and made to order. Tell us who it's for and we'll take it from there.",
        es: "Canastas de otoño acogedoras, dulces de Halloween y decoración para fiestas, hechos a mano y a tu medida. Dinos para quién es y nosotros nos encargamos del resto.",
      },
      occasions: [{ en: "Fall baskets", es: "Canastas de otoño" }, { en: "Halloween treats", es: "Dulces de Halloween" }, { en: "Fall parties", es: "Fiestas de otoño" }],
      photo: {
        src: "/images/seasonal/fall-2026.jpg",
        alt: {
          en: "White wicker basket with a fabric pumpkin, red berries, pine cones and dried leaves on a brown blanket",
          es: "Canasta de mimbre blanca con una calabaza de tela, frutos rojos, piñas y hojas secas sobre una cobija café",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/SLPRuQSuKqQ",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Order a fall basket", es: "Pide una canasta de otoño" }, service: "gifts" },
    },
    {
      id: "thanksgiving-2026",
      start: "2026-11-01",
      end: "2026-11-26",
      name: { en: "Thanksgiving", es: "Día de Acción de Gracias" },
      headline: { en: "Bring something special to the table.", es: "Lleva algo especial a la mesa." },
      body: {
        en: "Hostess gifts, thank-you baskets and centerpieces for your family gathering. Order early so we can make it just right.",
        es: "Regalos para la anfitriona, canastas de agradecimiento y centros de mesa para tu reunión familiar. Haz tu pedido con tiempo para que quede perfecto.",
      },
      occasions: [{ en: "Hostess gifts", es: "Regalos para la anfitriona" }, { en: "Thank-you baskets", es: "Canastas de agradecimiento" }, { en: "Centerpieces", es: "Centros de mesa" }],
      photo: {
        src: "/images/seasonal/thanksgiving-2026.jpg",
        alt: {
          en: "Long candlelit dinner table set with folded napkins, glasses and red and yellow flowers",
          es: "Mesa larga iluminada con velas, con servilletas dobladas, copas y flores rojas y amarillas",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/fb0_wj2MZk4",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Plan your Thanksgiving gift", es: "Planea tu regalo de Acción de Gracias" }, service: "gifts" },
    },
    {
      id: "christmas-2026",
      start: "2026-11-27",
      end: "2026-12-24",
      name: { en: "Christmas & holidays", es: "Navidad y fiestas" },
      headline: { en: "Give a gift they'll remember.", es: "Da un regalo que nunca olviden." },
      body: {
        en: "Custom holiday baskets for family, friends, teachers and clients, plus decor for your holiday party. Spots fill up fast in December.",
        es: "Canastas navideñas personalizadas para familia, amigos, maestros y clientes, y decoración para tu fiesta navideña. En diciembre los lugares se llenan rápido.",
      },
      occasions: [{ en: "Gift baskets", es: "Canastas de regalo" }, { en: "Office & client gifts", es: "Regalos para la oficina y clientes" }, { en: "Holiday parties", es: "Fiestas navideñas" }],
      photo: {
        src: "/images/seasonal/christmas-2026.jpg",
        alt: {
          en: "Open wicker gift basket with candles and jars in front of a frosted Christmas tree with silver ornaments",
          es: "Canasta de regalo de mimbre abierta con velas y frascos frente a un árbol de Navidad nevado con esferas plateadas",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/SrnCpsp9sGY",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Order holiday gifts", es: "Pide tus regalos navideños" }, service: "gifts" },
    },
    {
      id: "new-year-valentines-2027",
      start: "2026-12-26",
      end: "2027-02-14",
      name: { en: "New Year & Valentine's", es: "Año Nuevo y San Valentín" },
      headline: { en: "Start the year with something sweet.", es: "Empieza el año con algo dulce." },
      body: {
        en: "Ring in the new year with a celebration, then show someone you love them with a Valentine's basket made just for them.",
        es: "Recibe el año nuevo con una celebración y después demuéstrale tu cariño a alguien con una canasta de San Valentín hecha especialmente para esa persona.",
      },
      occasions: [{ en: "New Year events", es: "Eventos de Año Nuevo" }, { en: "Valentine's baskets", es: "Canastas de San Valentín" }, { en: "Date-night setups", es: "Decoración para una cita romántica" }],
      photo: {
        src: "/images/seasonal/new-year-valentines-2027.jpg",
        alt: {
          en: "Red roses in a red gift box with a heart pick, a lit tea light and scattered petals on a dark table",
          es: "Rosas rojas en una caja de regalo roja con un corazón, una velita encendida y pétalos sobre una mesa oscura",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/moguvg7jWVU",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Plan something sweet", es: "Planea algo dulce" }, service: "gifts" },
    },
    {
      id: "spring-mothers-day-2027",
      start: "2027-02-15",
      end: "2027-05-09",
      name: { en: "Spring & Mother's Day", es: "Primavera y Día de las Madres" },
      headline: { en: "For the moms who do it all.", es: "Para las mamás que lo hacen todo." },
      body: {
        en: "Mother's Day baskets, baby showers and spring celebrations, designed around the person you're celebrating.",
        es: "Canastas para el Día de las Madres, baby showers y celebraciones de primavera, diseñadas pensando en la persona que celebras.",
      },
      occasions: [{ en: "Mother's Day baskets", es: "Canastas para el Día de las Madres" }, { en: "Baby showers", es: "Baby showers" }, { en: "Quinceañeras", es: "Quinceañeras" }],
      photo: {
        src: "/images/seasonal/spring-mothers-day-2027.jpg",
        alt: {
          en: "White basket filled with pink and magenta carnations and a small red gift box",
          es: "Canasta blanca llena de claveles rosas y fucsia y una pequeña caja de regalo roja",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/xCxpOUeXh_0",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Celebrate Mom", es: "Celebra a mamá" }, service: "gifts" },
    },
    {
      id: "graduation-2027",
      start: "2027-05-10",
      end: "2027-06-30",
      name: { en: "Graduation & end of school", es: "Graduación y fin de clases" },
      headline: { en: "They did it. Celebrate in style.", es: "Lo lograron. Celébralo en grande." },
      body: {
        en: "Graduation baskets, teacher thank-you gifts and party decor for the big day.",
        es: "Canastas de graduación, regalos de agradecimiento para maestros y decoración para el gran día.",
      },
      occasions: [{ en: "Grad baskets", es: "Canastas de graduación" }, { en: "Teacher gifts", es: "Regalos para maestros" }, { en: "Graduation parties", es: "Fiestas de graduación" }],
      photo: {
        src: "/images/seasonal/graduation-2027.jpg",
        alt: {
          en: "\"Congrats Grad!\" party decoration hanging among balloons and paper stars",
          es: "Adorno de fiesta que dice \"Congrats Grad!\" colgado entre globos y estrellas de papel",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/eYoccjHKbpE",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Plan the celebration", es: "Planea la celebración" }, service: "events" },
    },
    {
      id: "summer-2027",
      start: "2027-07-01",
      end: "2027-09-14",
      name: { en: "Summer & back to school", es: "Verano y regreso a clases" },
      headline: { en: "Make summer a celebration.", es: "Haz del verano una celebración." },
      body: {
        en: "Summer parties, birthday setups and back-to-school gifts to start the year right.",
        es: "Fiestas de verano, decoración de cumpleaños y regalos de regreso a clases para empezar el año con el pie derecho.",
      },
      occasions: [{ en: "Summer events", es: "Eventos de verano" }, { en: "Birthday setups", es: "Decoración de cumpleaños" }, { en: "Back-to-school gifts", es: "Regalos de regreso a clases" }],
      photo: {
        src: "/images/seasonal/summer-2027.jpg",
        alt: {
          en: "Jar of baby's breath on an outdoor party table with salads, guests out of focus in the garden behind",
          es: "Frasco con flores de nube en una mesa de fiesta al aire libre con ensaladas, y los invitados desenfocados en el jardín",
        },
        kind: "stock",
        sourceUrl: "https://unsplash.com/photos/5EJzmEqif0Q",
        label: { en: "Stock photo", es: "Foto de stock" },
      },
      cta: { label: { en: "Plan your summer event", es: "Planea tu evento de verano" }, service: "events" },
    },
  ],
};
