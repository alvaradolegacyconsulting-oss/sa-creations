"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ButtonLink";
import { contact } from "@/content/contact";
import type { ServiceId } from "@/content/services";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { seasonal, type Season } from "@/content/seasonal";
import {
  PRESELECT_EVENT,
  SEASON_PARAM,
  SERVICE_PARAM,
  contactLimits,
  interpretReply,
  payloadFromForm,
  seasonFromParam,
  serviceFromParam,
  withoutPreselectParams,
  type ContactPreselect,
} from "@/lib/contact";
import { isValidEmail } from "@/lib/email-rule";
import { t } from "@/lib/i18n";

type FormStatus = "idle" | "invalid" | "pending" | "sent" | "failed";

const STATUS_ID = "contact-status";

/** State updater that checks a service, leaving it checked if it already is. */
const withService = (id: ServiceId) => (current: ServiceId[]) => (current.includes(id) ? current : [...current, id]);

const inputClasses =
  "min-h-12 w-full rounded-sm border border-ink/55 bg-white px-3 text-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-alert";

/**
 * Inquiry form. Ported from alc-site's ContactForm, with these states:
 * invalid (inline message, first bad field focused, nothing sent) · pending (button disabled,
 * "Sending...") · sent (only after /api/contact confirms { ok: true }) · failed (the inquiry email
 * as a link; every field stays filled so nothing is lost).
 */
export function ContactForm({ locale, seasons = seasonal.seasons }: { locale: Locale; seasons?: Season[] }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [invalid, setInvalid] = useState<string[]>([]);
  const [services, setServices] = useState<ServiceId[]>([]);
  /** The season a visitor came from (This Season's button); shown as a chip and sent with the form. */
  const [season, setSeason] = useState<Season | null>(null);

  // Links from other pages arrive as /?service=<id>&season=<id>#contact: apply them once, then drop the
  // parameters so a reload doesn't re-apply them. Read in the browser, since the page is built statically.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const service = serviceFromParam(query.get(SERVICE_PARAM));
    const fromSeason = seasonFromParam(query.get(SEASON_PARAM), seasons);
    if (!query.has(SERVICE_PARAM) && !query.has(SEASON_PARAM)) return;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after mount */
    if (service) setServices(withService(service));
    if (fromSeason) setSeason(fromSeason);
    /* eslint-enable react-hooks/set-state-in-effect */
    window.history.replaceState(window.history.state, "", withoutPreselectParams(window.location.href));
  }, [seasons]);

  // Contact links on this page fire an event instead of reloading, so anything typed is kept.
  useEffect(() => {
    const onPreselect = (event: Event) => {
      const detail = ((event as CustomEvent<unknown>).detail ?? {}) as ContactPreselect;
      const service = serviceFromParam(detail.service);
      const fromSeason = seasonFromParam(detail.season, seasons);
      if (service) setServices(withService(service));
      if (fromSeason) setSeason(fromSeason);
    };
    window.addEventListener(PRESELECT_EVENT, onPreselect);
    return () => window.removeEventListener(PRESELECT_EVENT, onPreselect);
  }, [seasons]);

  function toggleService(id: ServiceId, checked: boolean) {
    setServices((current) => (checked ? [...current, id] : current.filter((value) => value !== id)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // The browser's own checks, plus the server's email rule ("maria@email" passes type="email").
    const badFields = [...form.elements].filter(
      (element): element is HTMLInputElement | HTMLTextAreaElement =>
        (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) &&
        (!element.checkValidity() || (element.name === "email" && !isValidEmail(element.value))),
    );
    if (badFields.length > 0) {
      showInvalid(form, badFields.map((field) => field.name));
      return;
    }

    setInvalid([]);
    setStatus("pending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFromForm(form, locale)),
      });
      const outcome = await interpretReply(response);
      // Success is shown only after the server confirms the email API accepted it. A field the
      // server rejected is a field to fix, not a failed send. Either way the fields stay filled.
      if (outcome.kind === "invalid") {
        showInvalid(form, outcome.fields);
        return;
      }
      setStatus(outcome.kind);
      if (outcome.kind === "sent") {
        form.reset();
        setServices([]);
        setSeason(null);
      }
    } catch {
      setStatus("failed");
    }
  }

  /** Marks the fields, shows the inline message and focuses the first one. Nothing is sent. */
  function showInvalid(form: HTMLFormElement, names: string[]) {
    setInvalid(names);
    setStatus("invalid");
    const first = form.elements.namedItem(names[0]);
    if (first instanceof HTMLElement) first.focus();
    else if (first instanceof RadioNodeList && first[0] instanceof HTMLElement) first[0].focus();
  }

  const { labels } = contact;
  const fieldProps = (name: string) => ({
    "aria-invalid": invalid.includes(name) || undefined,
    "aria-describedby": invalid.includes(name) ? STATUS_ID : undefined,
  });

  return (
    <form className="space-y-5 rounded-lg border border-line bg-ivory p-5 text-ink sm:p-7" onSubmit={handleSubmit} noValidate>
      {season && (
        <div className="flex w-fit max-w-full items-center gap-1 rounded-full border border-copper/50 bg-white py-1 pl-4 pr-1 text-sm">
          <input type="hidden" name="season" value={season.id} />
          <span>
            {t(labels.askingAbout, locale)}: <strong className="font-semibold text-navy">{t(season.name, locale)}</strong>
          </span>
          <button
            type="button"
            onClick={() => setSeason(null)}
            aria-label={`${t(labels.remove, locale)} ${t(season.name, locale)}`}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink/75 hover:bg-sand hover:text-navy"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t(labels.name, locale)} name="name" autoComplete="name" required maxLength={contactLimits.name} {...fieldProps("name")} />
        <Field
          label={t(labels.email, locale)}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={contactLimits.email}
          {...fieldProps("email")}
        />
        <Field
          label={t(labels.phone, locale)}
          hint={t(labels.optional, locale)}
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={contactLimits.phone}
          {...fieldProps("phone")}
        />
        <Field label={t(labels.date, locale)} hint={t(labels.optional, locale)} name="date" type="date" {...fieldProps("date")} />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">
          {t(labels.services, locale)} <span className="font-normal text-ink/80">({t(labels.optional, locale)})</span>
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-x-5 min-[400px]:grid-cols-2 lg:flex lg:flex-wrap">
          {contact.serviceOptions.map((option) => (
            <label key={option.id} className="inline-flex min-h-11 items-center gap-2.5 text-sm">
              <input
                className="size-5 accent-navy"
                type="checkbox"
                name="services"
                value={option.id}
                checked={services.includes(option.id)}
                onChange={(event) => toggleService(option.id, event.target.checked)}
              />
              {t(option.label, locale)}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="details">
          {t(labels.details, locale)}
        </label>
        <textarea
          className={`${inputClasses} min-h-32 resize-y py-2`}
          id="details"
          name="details"
          rows={5}
          required
          maxLength={contactLimits.details}
          {...fieldProps("details")}
        />
      </div>

      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">{t(labels.honeypot, locale)}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        className={`${buttonClasses("primary")} w-full disabled:cursor-wait disabled:opacity-80`}
        type="submit"
        disabled={status === "pending"}
      >
        {t(status === "pending" ? contact.pending : contact.submit, locale)}
      </button>

      <div id={STATUS_ID} aria-live="polite">
        {status === "invalid" && <StatusMessage tone="failure">{t(contact.invalid, locale)}</StatusMessage>}
        {status === "sent" && <StatusMessage tone="success">{t(contact.success, locale)}</StatusMessage>}
        {status === "failed" && (
          <StatusMessage tone="failure">
            {t(contact.failure, locale)}{" "}
            <a className="break-all font-semibold underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            {site.phone && (
              <>
                , {t(contact.failurePhone, locale)}{" "}
                <a className="whitespace-nowrap font-semibold underline underline-offset-4" href={`tel:${site.phone.tel}`}>
                  {site.phone.display}
                </a>
              </>
            )}
            .
          </StatusMessage>
        )}
      </div>
    </form>
  );
}

function StatusMessage({ tone, children }: { tone: "success" | "failure"; children: ReactNode }) {
  const success = tone === "success";
  return (
    <p
      role={success ? "status" : "alert"}
      className={`flex gap-2.5 rounded-sm border-l-4 bg-white px-4 py-3 text-sm leading-relaxed ${
        success ? "border-navy text-navy" : "border-alert text-alert"
      }`}
    >
      <span aria-hidden="true" className="font-bold">
        {success ? "✓" : "!"}
      </span>
      <span>{children}</span>
    </p>
  );
}

function Field({
  label,
  hint,
  name,
  type = "text",
  ...inputProps
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" htmlFor={name}>
        {label}
        {hint && <span className="font-normal text-ink/80"> ({hint})</span>}
      </label>
      <input className={inputClasses} id={name} name={name} type={type} {...inputProps} />
    </div>
  );
}
