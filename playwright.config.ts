import {defineConfig, devices} from '@playwright/test';

declare const process: {
  env: {
    CI?: string;
  };
};

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: 'unit',
      testMatch: 'src/**/*.test.ts',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'e2e-chromium',
      testMatch: 'e2e/**/*.test.ts',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'e2e-firefox',
      testMatch: 'e2e/**/*.test.ts',
      use: {...devices['Desktop Firefox']},
    },
    {
      name: 'e2e-webkit',
      testMatch: 'e2e/**/*.test.ts',
      use: {...devices['Desktop Safari']},
    },
  ],
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  snapshotPathTemplate:
    '{testFileDir}/goldens/{arg}-{projectName}-{platform}{ext}',
  testDir: '.',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  workers: process.env.CI ? 1 : undefined,
});
