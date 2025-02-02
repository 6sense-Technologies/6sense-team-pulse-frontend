import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/projects');
  await page.getByRole('button', { name: 'Create Project' }).click();
});