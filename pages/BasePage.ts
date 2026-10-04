import { Page } from '@playwright/test';

/**
 * Common navigation that every page object shares. Locators and
 * business actions live in the subclasses — this class knows nothing
 * about the application's domain, only how to get around it.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
