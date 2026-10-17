import type { ServiceId } from "./services";
import type { EmphasizedText, LocalizedText } from "./types";

export type ContactServiceOption = {
  /** Sent to /api/contact; matches a services.ts id. */
  id: ServiceId;
  label: LocalizedText;
};

export type ContactContent = {
  eyebrow: LocalizedText;
  heading: EmphasizedText;
  intro: LocalizedText;
  /** Before the number on the tap-to-call and tap-to-text links: "Call 832-363-0716". Shown only with site.phone. */
  call: LocalizedText;
  text: LocalizedText;
  labels: {
    name: LocalizedText;
    email: LocalizedText;
    phone: LocalizedText;
    date: LocalizedText;
    optional: LocalizedText;
    services: LocalizedText;
    details: LocalizedText;
    /** Label on the hidden spam-trap field; only bots ever fill it in. */
    honeypot: LocalizedText;
    /** The chip naming the season a visitor came from: "Asking about: Christmas & holidays". */
    askingAbout: LocalizedText;
    /** The chip's remove button, read with the season name: "Remove Christmas & holidays". */
    remove: LocalizedText;
  };
  serviceOptions: ContactServiceOption[];
  submit: LocalizedText;
  pending: LocalizedText;
  /** Shown only after /api/contact confirms the email was sent. */
  success: LocalizedText;
  /** Shown on any failure; the inquiry email is appended as a link. The fields stay filled. */
  failure: LocalizedText;
  /** After the email in the failure message, before the phone number (a tel: link). Shown only with site.phone. */
  failurePhone: LocalizedText;
  /** Shown when a required field is empty or the email isn't valid. */
  invalid: LocalizedText;
};

export const contact: ContactContent = {
  eyebrow: { en: "Get in touch", es: "Contáctanos" },
  heading: { before: { en: "Let's plan something amazing.", es: "Planeemos algo increíble." } },
  intro: {
    en: "Whether you have a date set or just a dream, we'd love to hear from you. Send a few details for a free consultation and a custom proposal.",
    es: "Ya sea que tengas una fecha o solo un sueño, nos encantaría saber de ti. Mándanos algunos detalles para una consulta gratis y una propuesta personalizada.",
  },
  call: { en: "Call", es: "Llama al" },
  text: { en: "Text", es: "Manda un mensaje al" },
  labels: {
    name: { en: "Name", es: "Nombre" },
    email: { en: "Email", es: "Correo electrónico" },
    phone: { en: "Phone", es: "Teléfono" },
    date: { en: "Event or need-by date", es: "Fecha del evento o para cuándo lo necesitas" },
    optional: { en: "optional", es: "opcional" },
    services: { en: "What can we help with?", es: "¿En qué te podemos ayudar?" },
    details: { en: "Tell us about it", es: "Cuéntanos" },
    honeypot: { en: "Leave this field empty", es: "Deja este campo vacío" },
    askingAbout: { en: "Asking about", es: "Preguntas por" },
    remove: { en: "Remove", es: "Quitar" },
  },
  serviceOptions: [
    { id: "events", label: { en: "Event planning", es: "Planeación de eventos" } },
    { id: "decor", label: { en: "Custom decor", es: "Decoración personalizada" } },
    { id: "apparel", label: { en: "Custom apparel", es: "Ropa personalizada" } },
    { id: "gifts", label: { en: "Custom gifts", es: "Regalos personalizados" } },
  ],
  submit: { en: "Request my free consultation", es: "Pedir mi consulta gratis" },
  pending: { en: "Sending...", es: "Enviando..." },
  success: {
    en: "Thank you! Your request was sent. We'll reach out to set up your free consultation.",
    es: "¡Gracias! Tu solicitud se envió. Te contactaremos para agendar tu consulta gratis.",
  },
  failure: {
    en: "We couldn't send your request. Your details are still here, so you can try again, or email us at",
    es: "No pudimos enviar tu solicitud. Tus datos siguen aquí para que lo intentes de nuevo, o escríbenos a",
  },
  failurePhone: { en: "or call or text", es: "o llámanos o mándanos un mensaje al" },
  invalid: {
    en: "Please add your name, a valid email and a few details.",
    es: "Por favor escribe tu nombre, un correo electrónico válido y algunos detalles.",
  },
};
