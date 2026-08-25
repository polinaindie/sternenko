import { defineConfig } from "vitest/config"

// Standalone config so unit tests don't load the Tailwind/React Vite plugins;
// Vite still resolves the `@workspace/*` workspace packages and transforms TS.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
