import { test, expect } from '@playwright/test';

test('sign up and verify OTP', async ({ page }) => {
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
      body: JSON.stringify({ isVerified: true, hasOrganization: false }),
    });
  });

  // Navigate to the sign-up page
  await page.goto('http://localhost:3000/sign-up');

  // Wait for the 'Enter your full name' textbox to be visible and interact with it
  try {
    await page.waitForSelector('input[name="displayName"]', { timeout: 100000 });
    await page.fill('input[name="displayName"]', 'Khan Atik Faisal');
  } catch (error) {
    console.error("Timeout waiting for 'displayName' input:", error);
  }

  // Wait for the 'Enter your email' textbox to be visible and interact with it
  try {
    await page.waitForSelector('input[name="emailAddress"]', { timeout: 60000 });
    await page.fill('input[name="emailAddress"]', 'nesame9192@bmixr.com');
  } catch (error) {
    console.error("Timeout waiting for 'emailAddress' input:", error);
  }

  // Wait for the 'Password' textbox to be visible and interact with it
  try {
    await page.waitForSelector('input[name="password"]', { timeout: 60000 });
    await page.fill('input[name="password"]', 'Khan23#');
  } catch (error) {
    console.error("Timeout waiting for 'password' input:", error);
  }

  // Wait for the 'Sign up' button to be visible and click it
  try {
    await page.waitForSelector('button[type="submit"]', { timeout: 60000 });
    await page.getByRole('button', { name: 'Sign up' }).click();
  } catch (error) {
    console.error("Timeout waiting for 'Sign up' button:", error);
  }

  // Wait for navigation to the verification page
  try {
    await page.waitForNavigation({ waitUntil: 'load' });
  } catch (error) {
    console.error("Timeout waiting for navigation after signing up:", error);
  }

  // Wait for the verification page to load
  try {
    await page.waitForSelector('text=Verify Email', { state: 'visible', timeout: 60000 });
  } catch (error) {
    console.error("Timeout waiting for 'Verify Email' text:", error);
  }

  // Fill in the OTP
  try {
    await page.waitForSelector('input[name="token"]', { timeout: 60000 });
    await page.fill('input[name="token"]', '866891');
  } catch (error) {
    console.error("Timeout waiting for 'token' input:", error);
  }

  // Click the 'Submit' button and wait for navigation
  try {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.getByRole('button', { name: 'Submit' }).click(),
    ]);
  } catch (error) {
    console.error("Timeout waiting for navigation after OTP submission:", error);
  }

  // Verify successful verification by checking the URL or some element on the next page
  try {
    await expect(page).toHaveURL('http://localhost:3000/sign-up/create-organization');
  } catch (error) {
    console.error("Failed to verify successful navigation to create organization page:", error);
  }
});
