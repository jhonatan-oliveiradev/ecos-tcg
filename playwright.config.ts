import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: process.env.ECOS_TEST_URL ?? "http://127.0.0.1:4173",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "compact-desktop",
      use: { viewport: { width: 1280, height: 720 } },
    },
  ],
  webServer: process.env.ECOS_TEST_URL
    ? undefined
    : {
        command: "npm run dev -- --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: true,
      },
});
