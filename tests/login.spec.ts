import { test, expect } from '../fixtures/pages.fixture';
import { users } from '../utils/test-data';

// This spec tests the login flow itself, so every test here must start
// logged OUT — it overrides the storageState the config applies by default.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login @smoke', () => {
  test('logs in with a valid standard user', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('shows an error for a locked out user', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('locked out');
  });

  test('shows an error for a wrong password', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, 'wrong_password');

    expect(await loginPage.getErrorText()).toContain('do not match');
  });

  test('shows an error when the username is empty', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('', users.standard.password);

    expect(await loginPage.getErrorText()).toContain('Username is required');
  });
});
