// Relative imports only: scripts/review.ts runs this under tsx without the "@/" alias.
import { findTexts } from "./gates";

/** Human headings for each content export, in page order. Exports not listed here go last, by name. */
const sectionNames: Record<string, string> = {
  site: "Site-wide (titles, header, footer)",
  navLabels: "Menus and labels",
  headerNav: "Header links",
  hero: "Hero (top of the page)",
  values: "Values strip",
  servicesSection: "Services: heading",
  services: "Services",
  seasonal: "This Season",
  gallery: "Gallery",
  story: "Our story and verse",
  contact: "Contact form",
  notFound: "Page not found (404)",
};

const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");

/**
 * docs/REVIEW.md, generated from content/ by `npm run review`: every piece of text as
 * Where | English | Español, for S&A to mark up. The same text used in several places is listed once.
 */
export function reviewDoc(content: Record<string, unknown>): string {
  const names = Object.keys(content).sort((a, b) => {
    const order = Object.keys(sectionNames);
    const rank = (name: string) => (order.includes(name) ? order.indexOf(name) : order.length);
    return rank(a) - rank(b) || a.localeCompare(b);
  });
  const seen = new Map<string, string[]>();
  const sections: { name: string; rows: { path: string; en: string; es?: string }[] }[] = [];

  for (const name of names) {
    const rows: { path: string; en: string; es?: string }[] = [];
    for (const { path, text } of findTexts(content[name], name)) {
      const key = `${text.en}|${text.es ?? ""}`;
      const paths = seen.get(key);
      if (paths) {
        paths.push(path);
        continue;
      }
      const row = { path, en: text.en, es: text.es };
      seen.set(key, [path]);
      rows.push(row);
    }
    if (rows.length > 0) sections.push({ name, rows });
  }

  const total = sections.reduce((sum, section) => sum + section.rows.length, 0);
  const missing = sections.reduce((sum, section) => sum + section.rows.filter((row) => !row.es?.trim()).length, 0);
  const lines = [
    "# Website text for review (English and Spanish)",
    "",
    "Generated from `content/` by `npm run review`; don't edit this file by hand (a test fails if it's out of date).",
    "",
    "**How to review:** read each row. Mark any change in the Español (or English) column, or write it beside",
    "the row, and send it back. Your edits come back as small content changes, then this page is regenerated.",
    "The Spanish is drafted for you to approve: natural US Spanish, not word-for-word.",
    "",
    "- The Bible verse is quoted from the NIV in English and the **Reina-Valera 1960** in Spanish (see",
    "  `story.verse`). Tell us if you'd like a different version.",
    "- Text used in more than one place (for example a photo's description) is listed once; the \"Where\"",
    "  column names the other places.",
    "",
    `${total} pieces of text; ${missing === 0 ? "every one has Spanish" : `${missing} still without Spanish (marked —)`}.`,
  ];

  for (const { name, rows } of sections) {
    lines.push("", `## ${sectionNames[name] ?? name}`, "", "| Where | English | Español |", "|---|---|---|");
    for (const row of rows) {
      const others = seen.get(`${row.en}|${row.es ?? ""}`)!.slice(1);
      const where = `\`${row.path}\`${others.length > 0 ? ` (also ${others.map((path) => `\`${path}\``).join(", ")})` : ""}`;
      lines.push(`| ${where} | ${cell(row.en)} | ${row.es?.trim() ? cell(row.es) : "—"} |`);
    }
  }

  return `${lines.join("\n")}\n`;
}
