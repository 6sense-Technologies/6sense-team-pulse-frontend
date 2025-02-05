import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-up/create-organization');
  await page.getByRole('textbox', { name: 'Enter your organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter your organization name' }).fill('sdas');
  await page.getByRole('textbox', { name: 'Domain' }).click();
  await page.getByRole('textbox', { name: 'Domain' }).fill('sasd');
  await page.getByRole('button', { name: 'Submit' }).click();
});