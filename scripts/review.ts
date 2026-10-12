import { writeFileSync } from "node:fs";
import { content } from "../content";
import { reviewDoc } from "../lib/review";

// npm run review: regenerates docs/REVIEW.md, the page S&A marks up. Run it after any content change.
const path = new URL("../docs/REVIEW.md", import.meta.url);
writeFileSync(path, reviewDoc(content));
console.log("Wrote docs/REVIEW.md");
