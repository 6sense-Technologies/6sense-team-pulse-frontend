import { test} from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-up/verification');
  await page.locator('input[name="token"]').click();
  await page.locator('input[name="token"]').fill('123456');
  await page.getByRole('button', { name: 'Submit' }).click();
});