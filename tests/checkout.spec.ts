import { test, expect } from '../fixtures/pages.fixture';
import { products, checkoutInfo } from '../utils/test-data';

test.describe('Checkout', () => {
  test('completes a purchase end to end @smoke', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await test.step('add items to cart', async () => {
      await inventoryPage.goto('/inventory.html');
      await inventoryPage.addToCart(products.backpack);
      await inventoryPage.addToCart(products.fleeceJacket);
      await expect(inventoryPage.cartBadge).toHaveText('2');
    });

    await test.step('go to cart and start checkout', async () => {
      await inventoryPage.goToCart();
      await cartPage.checkout();
    });

    await test.step('fill in checkout information', async () => {
      const { firstName, lastName, postalCode } = checkoutInfo.valid;
      await checkoutPage.fillInfo(firstName, lastName, postalCode);
      await expect(page).toHaveURL(/checkout-step-two/);
      await expect(checkoutPage.summaryTotalLabel).toBeVisible();
    });

    await test.step('finish the order', async () => {
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(checkoutPage.completeHeader).toHaveText(/Thank you/i);
    });
  });

  test('checkout requires a first name', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('', checkoutInfo.valid.lastName, checkoutInfo.valid.postalCode);

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });
});
