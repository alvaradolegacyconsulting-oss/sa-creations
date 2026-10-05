import { afterEach } from "vitest";

// Testing Library only auto-cleans with test globals on; unmount rendered trees after each test.
afterEach(async () => {
  if (typeof document === "undefined") return;
  const { cleanup } = await import("@testing-library/react");
  cleanup();
});
