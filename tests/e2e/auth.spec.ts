import { test, expect } from '@playwright/test';

const TEST_USER_EMAIL = `test-user-${Date.now()}@example.com`;
const TEST_USER_PASSWORD = 'password123';

test.describe('Authentication Flow', () => {
  test('should allow a user to sign up', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', TEST_USER_EMAIL);
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button:text("Sign Up")');

    // After signup, user should be redirected to the dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });

  test('should show an error if signing up with an existing email', async ({ page }) => {
    // First, sign up the user to ensure the email exists
    await page.goto('/signup');
    await page.fill('input[name="email"]', TEST_USER_EMAIL);
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button:text("Sign Up")');
    await page.waitForURL('/dashboard');
    
    // Logout
    await page.locator('button[aria-haspopup="menu"]').click();
    await page.locator('div[role="menuitem"]:has-text("Log out")').click();
    await page.waitForURL('/');

    // Attempt to sign up again with the same email
    await page.goto('/signup');
    await page.fill('input[name="email"]', TEST_USER_EMAIL);
    await page.fill('input[name="password"]', 'anotherpassword');
    await page.click('button:text("Sign Up")');

    // Check for error message
    await expect(page.locator('.text-red-500')).toBeVisible();
    await expect(page.locator('.text-red-500')).toHaveText('User with this email already exists');
  });

  test('should allow a user to log in', async ({ page }) => {
    // Assuming the user from the first test exists
    await page.goto('/login');
    
    await page.fill('input[name="email"]', TEST_USER_EMAIL);
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button:text("Sign In")');

    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });
});
