import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    // This test assumes a user is already created and can log in.
    // For a real-world scenario, you might use a seeded user or create one programmatically.
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:text("Sign In")');
    await page.waitForURL('/dashboard');
  });

  test('should show the connect button when not connected', async ({ page }) => {
    // Mock the API response for the status check
    await page.route('/api/instagram/status', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ connected: false }),
      });
    });

    await page.goto('/dashboard');
    
    await expect(page.locator('button:text("Connect Instagram")')).toBeVisible();
    await expect(page.locator('h3:text("Profile Summary")')).not.toBeVisible();
  });

  test('should show profile and media when connected', async ({ page }) => {
    // Mock all necessary API endpoints for a connected state
    await page.route('/api/instagram/status', route => {
      route.fulfill({ status: 200, body: JSON.stringify({ connected: true }) });
    });

    await page.route('/api/instagram/me', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: '12345',
          username: 'test_ig_user',
          followers_count: 100,
          profile_picture_url: 'https://via.placeholder.com/80',
          account_type: 'BUSINESS',
        }),
      });
    });

    await page.route('/api/instagram/media', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: [
            { id: 'media1', media_type: 'IMAGE', media_url: 'https://via.placeholder.com/300', timestamp: new Date().toISOString() },
            { id: 'media2', media_type: 'VIDEO', media_url: 'fake.mp4', thumbnail_url: 'https://via.placeholder.com/300', timestamp: new Date().toISOString() },
          ],
        }),
      });
    });

    await page.goto('/dashboard');

    // Check for profile info
    await expect(page.locator('h3:text("test_ig_user")')).toBeVisible();
    await expect(page.locator('p:text("100 Followers")')).toBeVisible();

    // Check for media
    await expect(page.locator('img[alt="Instagram media"]')).toHaveCount(1);
    await expect(page.locator('video')).toHaveCount(1);

    // Check for disconnect button
    await expect(page.locator('button:text("Disconnect Account")')).toBeVisible();
  });
});
