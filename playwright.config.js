// @ts-check
const { devices } = require('@playwright/test');
const { permission } = require('process');

// to check downloaded trace.zip file - https://trace.playwright.dev/
// to run customized test script command from package.json: npm run APITest

const config = {
  testDir: './tests',
  retries: 1, // retries test run for flaky test
  workers: 3, // will not start test in default parallel mode that is 5 workers,
  // instead will trigger one by one
  // worker - test execution environment
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',
  // Run command: --config playwright.config.js --project=safari/chrome/firefox
  projects: [
    {
      name: 'chrome',
      use: {

        browserName: 'chromium', // 'webkit' for safari  | 'chromium' for chrome  | 'firefox' for firefox
        headless: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure', // logs trace only failed tests
        video: 'retain-on-failure', // logs video only failed tests
        ignoreHttpsErrors: true,  // handle ssl certifications
        permissions: ['geolocation'], // handle Allow location pop up
        // viewport: {width:720, height:720},
        // ...devices['iPhone 15 Pro Max'],
      }
    },
    {
      name: 'safari',
      use: {

        browserName: 'webkit', // 'webkit' for safari  | 'chromium' for chrome  | 'firefox' for firefox
        headless: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure', // logs trace only failed tests
        video: 'retain-on-failure', // logs video only failed tests
        ignoreHttpsErrors: true,  // handle ssl certifications
        permissions: ['geolocation'], // handle Allow location pop up
        // ...devices['iPhone 15 Pro Max'],
      }
    },
    {
      name: 'firefox',
      use: {

        browserName: 'firefox', // 'webkit' for safari  | 'chromium' for chrome  | 'firefox' for firefox
        headless: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure', // logs trace only failed tests
        video: 'retain-on-failure', // logs video only failed tests
        ignoreHttpsErrors: true,  // handle ssl certifications
        permissions: ['geolocation'], // handle Allow location pop up,
      }
    },
  ]
  /* Shared settings for all the projects below. See https://playwright.dev/doc*/
  // use: {

  //   browserName: 'chromium', // 'webkit' for safari  | 'chromium' for chrome  | 'firefox' for firefox
  //   headless: false,
  //   screenshot: 'only-on-failure',
  //   //trace: 'retain-on-failure',

  // },
};

module.exports = config;

//***trace.playwright.dev - to trace all your logs**//
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 /** @see https://playwright.dev/docs/test-configuration
 */
/**
 module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
/* fullyParallel: true,
 /* Fail the build on CI if you accidentally left test.only in the source code. */
/* forbidOnly: !!process.env.CI,
 /* Retry on CI only */
/* retries: process.env.CI ? 2 : 0,
 /* Opt out of parallel tests on CI. */
/* workers: process.env.CI ? 1 : undefined,
 /* Reporter to use. See https://playwright.dev/docs/test-reporters */
/* reporter: 'html',
 /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
/* use: {
   /* Base URL to use in actions like `await page.goto('/')`. */
// baseURL: 'http://127.0.0.1:3000',

/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
/*   trace: 'on-first-retry',
/* },

 /* Configure projects for major browsers */
/* projects: [
   {
     name: 'chromium',
     use: { ...devices['Desktop Chrome'] },
   },

   {
     name: 'firefox',
     use: { ...devices['Desktop Firefox'] },
   },

   {
     name: 'webkit',
     use: { ...devices['Desktop Safari'] },
   },

   /* Test against mobile viewports. */
// {
//   name: 'Mobile Chrome',
//   use: { ...devices['Pixel 5'] },
// },
// {
//   name: 'Mobile Safari',
//   use: { ...devices['iPhone 12'] },
// },

/* Test against branded browsers. */
// {
//   name: 'Microsoft Edge',
//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
// },
// {
//   name: 'Google Chrome',
//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
// },
/*],

/* Run your local dev server before starting the tests */
// webServer: {
//   command: 'npm run start',
//   url: 'http://127.0.0.1:3000',
//   reuseExistingServer: !process.env.CI,
// },
//});


