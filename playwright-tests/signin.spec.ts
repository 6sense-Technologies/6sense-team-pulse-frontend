import { test} from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-in');
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('john.doe@example.com');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Strong@Password123!');
  await page.getByText('By clicking continue, you').click();
  await page.getByRole('button', { name: 'Sign in' }).click();
});