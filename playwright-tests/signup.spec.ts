import { test} from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-up');
  await page.getByRole('textbox', { name: 'Enter your full name' }).click();
  await page.getByRole('textbox', { name: 'Enter your full name' }).fill('Khan Atik Faisal');
  await page.getByRole('textbox', { name: 'Enter your email' }).dblclick();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('nesame9192@bmixr.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Khan23#');
  await page.getByRole('button', { name: 'Sign up' }).click();
});