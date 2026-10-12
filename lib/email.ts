import { Resend } from "resend";
import { contact } from "@/content/contact";
import type { ContactSubmission } from "@/lib/contact-schema";

export type SendResult = { ok: true; id: string } | { ok: false; reason: "missing-env" | "resend-error" | "network-error"; detail: string };

const requiredEnv = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"] as const;

/** The inquiry email goes to S&A, so it is always in English, whatever language the visitor used. */
const languageNames = { en: "English", es: "Spanish" } as const;

/** CR/LF (and other control characters) become spaces, so nothing can add a header line. */
function oneLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

export function contactSubject(submission: Pick<ContactSubmission, "name" | "locale">): string {
  const language = submission.locale === "en" ? "" : ` (${languageNames[submission.locale]})`;
  return oneLine(`Website inquiry: ${oneLine(submission.name)}${language}`);
}

/** Plain-text body listing every field, labeled as on the (English) form. */
export function contactBody(submission: ContactSubmission): string {
  const { labels } = contact;
  const serviceLabels = submission.services.map((id) => contact.serviceOptions.find((option) => option.id === id)?.label.en ?? id);

  return [
    `${labels.name.en}: ${submission.name}`,
    `${labels.email.en}: ${submission.email}`,
    `${labels.phone.en}: ${submission.phone || "(not given)"}`,
    `${labels.date.en}: ${submission.date || "(not given)"}`,
    `${labels.services.en} ${serviceLabels.length > 0 ? serviceLabels.join(", ") : "(none selected)"}`,
    `Language: ${languageNames[submission.locale]}`,
    ...(submission.season ? [`Season: ${submission.season}`] : []),
    "",
    `${labels.details.en}:`,
    submission.details,
  ].join("\n");
}

/**
 * Sends the inquiry email through Resend. Resolves ok only when Resend returns an email id.
 * Never throws; every failure comes back as a reason the route can log and report.
 */
export async function sendContactEmail(
  submission: ContactSubmission,
  env: Record<string, string | undefined> = process.env,
): Promise<SendResult> {
  const missing = requiredEnv.filter((name) => !env[name]?.trim());
  if (missing.length > 0) return { ok: false, reason: "missing-env", detail: missing.join(", ") };

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL!,
      to: env.CONTACT_TO_EMAIL!.split(",").map((address) => address.trim()).filter(Boolean),
      replyTo: submission.email,
      subject: contactSubject(submission),
      text: contactBody(submission),
    });

    if (error || !data?.id) {
      return { ok: false, reason: "resend-error", detail: error ? `${error.name} (${error.statusCode ?? "no status"})` : "no email id returned" };
    }
    return { ok: true, id: data.id };
  } catch (cause) {
    return { ok: false, reason: "network-error", detail: cause instanceof Error ? cause.name : "unknown" };
  }
}
