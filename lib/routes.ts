// Relative imports only: next.config.ts loads this file, and it doesn't resolve "@/".

/** Every page route on the site. Add new pages here; redirect tests check targets against this list. */
export const pages = {
  home: "/",
} as const;

export const pagePaths: string[] = Object.values(pages);
