# Playwright POM Framework (TypeScript)

![Playwright Tests](https://github.com/AnushreeMohanty/playwright-pom-framework/actions/workflows/playwright.yml/badge.svg)

A small, intentionally complete Playwright + TypeScript automation framework,
built against the public [SauceDemo](https://www.saucedemo.com) practice site.
It demonstrates the patterns I use in production delivery work — Page Object
Model, fixtures for dependency injection, authentication reuse via
`storageState`, and a CI pipeline that runs the suite on every push.

This is a portfolio project, not production code for a client, so it is
deliberately scoped to be readable end to end in a few minutes.

## Why this exists

I automate in both Selenium and Playwright day to day. This repo is where I
keep my Playwright muscle memory sharp — the execution model (auto-waiting,
browser contexts, fixtures) is different enough from Selenium that I wanted a
real, working example rather than notes.

## Architecture

```
pages/              Page objects — locators and actions only, no assertions
  BasePage.ts        shared navigation every page object extends
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts

fixtures/
  pages.fixture.ts    extends `test` with one fixture per page object,
                       so a test declares only what it needs:
                       test('...', async ({ inventoryPage, cartPage }) => {...})

tests/
  auth.setup.ts        logs in once, saves storage state — runs before
                       every other spec via a project dependency
  login.spec.ts        the one spec that deliberately opts OUT of the
                       saved session, since it's testing login itself
  inventory.spec.ts
  cart.spec.ts
  checkout.spec.ts     full purchase flow, written with test.step() so
                       the HTML report reads like the user's journey

utils/
  test-data.ts         users, products and checkout data, kept out of
                       the specs so adding a case means adding a row

playwright.config.ts   projects, the setup→browser dependency, retries,
                       trace/video/screenshot-on-failure
.github/workflows/     CI: installs, runs headless, uploads the HTML
  playwright.yml       report as a build artifact on every push/PR
```

### Design decisions worth noting

- **Fixtures over `beforeEach`.** Each page object is built only if a test
  asks for it, and teardown is implicit — nothing leaks between the
  parallel workers that run this suite.
- **Authentication reuse.** `auth.setup.ts` logs in once; the `chromium`
  and `firefox` projects declare it as a dependency and load the saved
  `storageState`. `login.spec.ts` is the deliberate exception — it resets
  to a logged-out state per file, since it's testing the login flow itself.
- **Locators prefer role and text over CSS/XPath** (`getByRole`,
  `.filter({ hasText })`) wherever the site's structure allows it, since
  they survive markup changes that would break a positional selector.
- **Test data lives in `utils/test-data.ts`**, not inline in specs — the
  same discipline I'd apply to Excel/JSON-backed data in a Selenium suite.
- **`test.step()`** groups each spec into named phases in the HTML report,
  so a failure is immediately legible without reading the stack trace.

## Running it locally

```bash
git clone https://github.com/AnushreeMohanty/playwright-pom-framework.git
cd playwright-pom-framework
npm install
npx playwright install        # downloads the browser binaries

npm test                      # full suite, headless, both browsers
npm run test:headed           # watch it run
npm run test:ui               # Playwright's UI mode — time travel, watch
npm run test:smoke            # only tests tagged @smoke
npm run report                # open the last HTML report
```

## CI

Every push and pull request to `main` runs the full suite on GitHub Actions
(`.github/workflows/playwright.yml`) and publishes the HTML report —
including traces and videos for any failure — as a downloadable artifact.

## Stack

Playwright Test · TypeScript · Page Object Model · GitHub Actions

## Author

**Anushree Mohanty** — Automation Test Engineer (Selenium, Playwright, API &
SAP automation)
[LinkedIn](https://www.linkedin.com/) · [GitHub](https://github.com/AnushreeMohanty)
