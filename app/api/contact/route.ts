import { contactFields, contactLimits, type ContactResponse } from "@/lib/contact";
import { contactSchema } from "@/lib/contact-schema";
import { sendContactEmail } from "@/lib/email";

const reply = (body: ContactResponse, status: number) => Response.json(body, { status });

/** The body as text, or null if it's larger than `maxBytes` (checked on the header and while reading). */
async function readLimitedBody(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/**
 * Inquiry form → email (from alc-site). Replies { ok: true } only after Resend confirms the send. Logs
 * record what happened (outcome, Resend id or error name, invalid field names), never the API key or message.
 */
export async function POST(request: Request) {
  const text = await readLimitedBody(request, contactLimits.bodyBytes);
  if (text === null) {
    console.warn(`contact: NOT sent, body over ${contactLimits.bodyBytes} bytes`);
    return reply({ ok: false, reason: "send-failed" }, 413);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    console.warn("contact: NOT sent, body is not JSON");
    return reply({ ok: false, reason: "send-failed" }, 400);
  }

  // Honeypot: people never see this field. Accept quietly so bots don't retry, but send nothing.
  const honeypot = (raw as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    console.warn("contact: dropped, honeypot filled (not sent)");
    return reply({ ok: true }, 200);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    // Field names only, in form order; never the values.
    const flagged = new Set(parsed.error.issues.map((issue) => String(issue.path[0])));
    const fields = contactFields.filter((field) => flagged.has(field));
    console.warn(`contact: NOT sent, invalid fields: ${fields.join(", ") || "(unknown)"}`);
    return fields.length > 0 ? reply({ ok: false, reason: "invalid", fields }, 400) : reply({ ok: false, reason: "send-failed" }, 400);
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    console.error(`contact: NOT sent, ${result.reason}: ${result.detail}`);
    return reply({ ok: false, reason: "send-failed" }, result.reason === "missing-env" ? 500 : 502);
  }

  console.info(`contact: sent, resend id ${result.id}`);
  return reply({ ok: true }, 200);
}
