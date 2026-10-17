/**
 * Props for every link that opens a new tab. noopener: the new page can't reach back through
 * window.opener; noreferrer: it isn't told which page linked to it. Use this, never a hand-written target="_blank".
 */
export const newTabLinkProps = { target: "_blank", rel: "noopener noreferrer" } as const;
