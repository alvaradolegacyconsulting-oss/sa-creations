import { regexes } from "zod/v4/core";

/**
 * The email rule zod's z.email() uses on the server (from alc-site). The form checks it in the browser
 * too, so an address like "maria@email" (fine for type="email", rejected by the server) is caught first.
 */
export const emailPattern: RegExp = regexes.email;

export function isValidEmail(value: string): boolean {
  return emailPattern.test(value.trim());
}
