import { test} from '@playwright/test';

test('Logout', async ({ page }) => {
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
    await page.getByRole('img', { name: 'Avatar' }).click();
    await page.getByRole('listitem').filter({ hasText: 'Sign out' }).locator('div').click();
    
});
});
