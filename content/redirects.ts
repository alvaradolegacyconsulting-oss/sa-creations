export type Redirect = {
  /** Old path, starting with "/". */
  from: string;
  /** New path on this site, starting with "/". Must be a real page (tests check it). */
  to: string;
};

/**
 * Old URLs that should keep working; each returns a 301 (see next.config.ts). Empty: S&A Creations
 * has no old site. (The ALC holding page /s-and-a-creations is redirected from the alc-site repo
 * once this site has a domain.)
 */
export const redirects: Redirect[] = [];
