import {defineConfig, devices} from '@playwright/test';

declare const process: {
  env: {
    CI?: string;
  };
};

const DEFAULT_VIEWPORT = {
  height: 480,
  width: 480,
};

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: 'unit',
      testMatch: 'src/**/*.test.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: DEFAULT_VIEWPORT,
      },
    },
    {
      name: 'e2e-chromium',
      testMatch: 'e2e/**/*.test.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: DEFAULT_VIEWPORT,
      },
    },
    {
      name: 'e2e-firefox',
      testMatch: 'e2e/**/*.test.ts',
      use: {
        ...devices['Desktop Firefox'],
        viewport: DEFAULT_VIEWPORT,
      },
    },
    {
      name: 'e2e-webkit',
      testMatch: 'e2e/**/*.test.ts',
      use: {
        ...devices['Desktop Safari'],
        viewport: DEFAULT_VIEWPORT,
      },
    },
  ],
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  snapshotPathTemplate: '{testFileDir}/goldens/{arg}{ext}',
  testDir: '.',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    viewport: DEFAULT_VIEWPORT,
  },
  workers: process.env.CI ? 1 : undefined,
});
