import { content } from "../content";
import { seasonal } from "../content/seasonal";
import { site } from "../content/site";
import { findStockPhotos, runGates } from "../lib/gates";
import { findSeasonProblems } from "../lib/seasons";

// Broken data fails every build, previews included: a season with an impossible date or an overlap
// would show the wrong copy, and there's no question left for anyone to answer.
const seasonProblems = findSeasonProblems(seasonal.seasons);
if (seasonProblems.length > 0) {
  console.error("SEASONS_VALID: FAIL. Fix content/seasonal.ts:");
  for (const problem of seasonProblems) console.error(`- ${problem}`);
  process.exitCode = 1;
}

// The gates run before every build (npm "prebuild") but only block production (VERCEL_ENV=production),
// so previews build with placeholders. `npm run gates` runs them anywhere to see what's left.
const force = process.argv.includes("--all");

if (force || process.env.VERCEL_ENV === "production") {
  for (const gate of runGates(content, site)) {
    if (gate.problems.length === 0) {
      console.log(`${gate.name}: PASS`);
      continue;
    }
    console.error(`${gate.name}: FAIL. Resolve these in content/ before production:`);
    for (const problem of gate.problems) console.error(`- ${problem}`);
    process.exitCode = 1;
  }

  // Not a gate: licensed stand-ins are allowed, but listed so they get replaced with S&A's own photos.
  const stock = findStockPhotos(content);
  console.log(stock.length === 0 ? "STOCK_IN_USE: none" : `STOCK_IN_USE (not blocking): ${stock.length} stock photo(s):`);
  for (const photo of stock) console.log(`- ${photo}`);
}
