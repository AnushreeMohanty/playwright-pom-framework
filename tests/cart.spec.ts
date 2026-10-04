import { test, expect } from '../fixtures/pages.fixture';
import { products } from '../utils/test-data';

test.describe('Cart', () => {
  test('cart reflects items added from inventory @smoke', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.boltTShirt);

    await inventoryPage.goToCart();

    const names = (await cartPage.getItemNames()).sort();
    expect(names).toEqual([products.backpack, products.boltTShirt].sort());
  });

  test('continue shopping returns to the inventory page', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.goToCart();

    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
