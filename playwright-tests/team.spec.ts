import { test} from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/team');
  await page.getByText('2', { exact: true }).click();
});