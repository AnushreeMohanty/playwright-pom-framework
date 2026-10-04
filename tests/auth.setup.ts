import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

/**
 * Runs once before the chromium/firefox projects (see playwright.config.ts
 * `dependencies`). Every other spec in this suite starts already logged in,
 * which removes ~400ms x N tests of UI login and a whole class of
 * login-related flakiness from the rest of the run.
 */
setup('authenticate as standard user', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: authFile });
});
