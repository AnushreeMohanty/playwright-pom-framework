import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  /** Scope down to the single product card matching this name. */
  itemByName(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  async addToCart(itemName: string): Promise<void> {
    await this.itemByName(itemName)
      .getByRole('button', { name: /add to cart/i })
      .click();
  }

  async removeFromCart(itemName: string): Promise<void> {
    await this.itemByName(itemName)
      .getByRole('button', { name: /remove/i })
      .click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.inventoryItems.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }
}
