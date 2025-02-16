import { test} from '@playwright/test';

test('InviteMember', async ({ page }) => {
  // Set a longer timeout for the entire test
  test.setTimeout(120000); // 2 minutes

  // Mock the network request for the sign-up process
  await page.route('**/api/auth/signup', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        userInfo: { emailAddress: 'nesame9192@bmixr.com' },
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      }),
    });
  });

  // Mock the network request for the verification process
  await page.route('**/api/auth/verify', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, isValidated: true }),
    });
  });

  // Mock the network request for the session update
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isVerified: true, hasOrganization: true }),
    });

      await page.goto('http://localhost:3000/sign-in');
      await page.getByRole('textbox', { name: 'Enter your email' }).click();
      await page.getByRole('textbox', { name: 'Enter your email' }).fill('6sensehq@example.com');
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('Strong@Password123!');
      await page.getByRole('button', { name: 'Sign in' }).click();
      await page.goto('http://localhost:3000/dashboard');
      await page.getByRole('button', { name: 'Members' }).click();
      await page.getByRole('button', { name: 'Invite Member' }).click();
      await page.getByRole('button', { name: 'Upload Picture' }).click();
      await page.getByRole('button', { name: 'Upload Picture' }).setInputFiles('91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg');
      await page.getByRole('textbox', { name: 'Full Name' }).click();
      await page.getByRole('textbox', { name: 'Full Name' }).fill('Khan Atik Faisal');
      await page.getByRole('textbox', { name: 'Email' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill('');
      await page.getByRole('textbox', { name: 'Email' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill('khanatik1176@gmail.com');
      await page.getByRole('combobox').first().click();
      await page.getByRole('option', { name: 'SQA Engineer II' }).click();
      await page.locator('div').filter({ hasText: /^SelectSelect the project\(s\) assigned to the member$/ }).getByRole('combobox').click();
      await page.getByRole('option', { name: 'Refresh Token' }).click();
      await page.getByRole('option', { name: 'AIUB GANG' }).click();
      await page.getByRole('textbox', { name: 'Jira' }).click();
      await page.getByRole('textbox', { name: 'Jira' }).fill('asa');
      await page.getByRole('textbox', { name: 'Trello ID' }).click();
      await page.getByRole('textbox', { name: 'Trello ID' }).fill('asa');
      await page.getByRole('textbox', { name: 'GitHub Username' }).click();
      await page.getByRole('textbox', { name: 'GitHub Username' }).fill('asa');
      await page.getByRole('combobox').filter({ hasText: 'Select' }).click();
      await page.getByRole('option', { name: 'Member' }).click();
      await page.getByRole('button', { name: 'Invite' }).click();
      await page.getByRole('textbox', { name: 'Email' }).click();
      await page.getByRole('textbox', { name: 'Email' }).click();
      await page.getByRole('textbox', { name: 'Email' }).dblclick();
      await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
      await page.getByRole('textbox', { name: 'Email' }).press('ArrowRight');
      await page.getByRole('textbox', { name: 'Email' }).press('ArrowRight');
      await page.getByRole('textbox', { name: 'Email' }).press('ArrowRight');
      await page.getByRole('textbox', { name: 'Email' }).fill('wobori4703@owlny.com');
      await page.getByRole('button', { name: 'Invite' }).click();
      await page.goto('http://localhost:3000/members');
});
});
 