import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/projects/create');
  await page.getByRole('textbox', { name: 'Project Name' }).click();
  await page.getByRole('textbox', { name: 'Project Name' }).fill('apple vinagire');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Jira' }).click();
  await page.getByRole('textbox', { name: 'https://' }).click();
  await page.getByRole('textbox', { name: 'https://' }).fill('www.jira.com');
  await page.getByRole('button', { name: 'Create Project' }).click();
});