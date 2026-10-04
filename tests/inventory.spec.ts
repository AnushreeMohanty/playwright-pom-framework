import { test, expect } from '../fixtures/pages.fixture';
import { products } from '../utils/test-data';

// No login here — the chromium/firefox projects already carry
// playwright/.auth/user.json, produced by tests/auth.setup.ts.
test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto('/inventory.html');
  });

  test('sorts products price low to high @smoke', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorts products name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('adding items updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.addToCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('removing an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
