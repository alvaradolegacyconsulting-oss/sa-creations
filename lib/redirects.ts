// Relative imports only: next.config.ts loads this file, and it doesn't resolve "@/".
import type { Redirect } from "../content/redirects";

/** Next.js redirect entries. statusCode 301, not `permanent: true`, which would send 308. */
export function toNextRedirects(redirects: Redirect[]) {
  return redirects.map(({ from, to }) => ({ source: from, destination: to, statusCode: 301 as const }));
}

/** Everything wrong with the redirect list; empty means it's valid. The build fails on any problem. */
export function findRedirectProblems(redirects: Redirect[], pagePaths: string[]): string[] {
  const problems: string[] = [];
  const froms = new Set<string>();

  for (const { from, to } of redirects) {
    const label = `${from} → ${to}`;
    if (!from.startsWith("/") || from.includes("[")) problems.push(`${label}: "from" must be a path starting with "/"`);
    if (from !== "/" && from.endsWith("/")) problems.push(`${label}: "from" must not end with "/"`);
    if (froms.has(from)) problems.push(`${label}: "${from}" is listed more than once`);
    froms.add(from);
    if (pagePaths.includes(from)) problems.push(`${label}: "${from}" is a page on this site and would be hidden`);
    if (!pagePaths.includes(to.split("#")[0])) problems.push(`${label}: "${to}" is not a page on this site`);
  }

  for (const { from, to } of redirects) {
    if (froms.has(to.split("#")[0])) problems.push(`${from} → ${to}: chains into another redirect; point it at the final page`);
  }

  return problems;
}
