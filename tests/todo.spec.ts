import { test, expect } from '@playwright/test';

test('should add a new todo item', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // Add a new todo item
  await page.getByPlaceholder('What needs to be done?').fill('Buy groceries');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  
  // Verify the new todo item is added
  await expect(page.getByText('Buy groceries')).toBeVisible();
});
