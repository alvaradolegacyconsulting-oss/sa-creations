import { content } from "../content";
import { runGates } from "../lib/gates";

// Runs before every build (npm "prebuild") but only blocks production (VERCEL_ENV=production), so
// previews build with placeholders. `npm run gates` runs it anywhere to see what's left.
const force = process.argv.includes("--all");

if (force || process.env.VERCEL_ENV === "production") {
  for (const gate of runGates(content)) {
    if (gate.problems.length === 0) {
      console.log(`${gate.name}: PASS`);
      continue;
    }
    console.error(`${gate.name}: FAIL. Resolve these in content/ before production:`);
    for (const problem of gate.problems) console.error(`- ${problem}`);
    process.exitCode = 1;
  }
}
