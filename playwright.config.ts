import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:5178",
    channel: "chrome",
    viewport: { width: 1440, height: 960 },
    launchOptions: { args: ["--enable-unsafe-webgpu"] },
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5178",
    url: "http://127.0.0.1:5178",
    reuseExistingServer: !process.env.CI,
  },
});
