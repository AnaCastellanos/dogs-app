import { test, expect, Page } from '@playwright/test';

const MAIN_DOG_URL = 'https://images.dog.ceo/breeds/labrador/test_main.jpg';
const THUMBNAIL_URLS = Array.from(
  { length: 10 },
  (_, i) => `https://images.dog.ceo/breeds/poodle/test_thumb_${i}.jpg`
);

async function mockDogApi(page: Page): Promise<void> {
  await page.route('https://dog.ceo/api/breeds/image/random', (route) => {
    route.fulfill({ json: { message: MAIN_DOG_URL, status: 'success' } });
  });

  await page.route('https://dog.ceo/api/breeds/image/random/10', (route) => {
    route.fulfill({ json: { message: THUMBNAIL_URLS, status: 'success' } });
  });
}

test.beforeEach(async ({ page }) => {
  await mockDogApi(page);
});

test.describe('Dogs App', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dogs App');
  });

  test('should show the main dog image after loading', async ({ page }) => {
    await page.goto('/');
    const mainImage = page.locator('section').first().locator('img');
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('src', MAIN_DOG_URL);
  });

  test('should show the Refresh All button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Refresh All' })).toBeVisible();
  });

  test('should render 10 thumbnails in the grid', async ({ page }) => {
    await page.goto('/');
    const thumbnailSection = page.locator('section').nth(1);
    await expect(thumbnailSection.locator('img')).toHaveCount(10);
  });

  test('should display the Favorites sidebar with empty state', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('aside')).toContainText('No favorites yet');
  });

  test('should add the main dog to favorites', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add to Favorites' }).click();

    await expect(page.getByRole('button', { name: 'Favorited' })).toBeVisible();
    await expect(page.locator('aside')).toContainText('1');
    await expect(page.locator('aside').locator('img').first()).toBeVisible();
  });

  test('should not allow adding the same dog to favorites twice', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add to Favorites' }).click();
    const favoritedBtn = page.getByRole('button', { name: 'Favorited' });
    await expect(favoritedBtn).toBeDisabled();
  });

  test('should remove a dog from favorites', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add to Favorites' }).click();
    await expect(page.locator('aside').locator('img')).toHaveCount(1);

    const removeBtn = page.locator('aside').getByTitle('Remove from favorites');
    await removeBtn.hover();
    await removeBtn.click();

    await expect(page.locator('aside')).toContainText('No favorites yet');
  });

  test('should switch main dog when clicking a thumbnail', async ({ page }) => {
    await page.goto('/');
    const thumbnails = page.locator('section').nth(1).locator('[class*="cursor-pointer"]');
    await thumbnails.nth(2).click();

    const mainImage = page.locator('section').first().locator('img');
    await expect(mainImage).toHaveAttribute('src', THUMBNAIL_URLS[2]);
  });

  test('should reload images when clicking Refresh All', async ({ page }) => {
    const REFRESHED_URL = 'https://images.dog.ceo/breeds/beagle/refreshed.jpg';
    let callCount = 0;

    await page.route('https://dog.ceo/api/breeds/image/random', (route) => {
      callCount++;
      const url = callCount > 1 ? REFRESHED_URL : MAIN_DOG_URL;
      route.fulfill({ json: { message: url, status: 'success' } });
    });

    await page.goto('/');
    const mainImage = page.locator('section').first().locator('img');
    await expect(mainImage).toHaveAttribute('src', MAIN_DOG_URL);

    await page.getByRole('button', { name: 'Refresh All' }).click();
    await expect(mainImage).toHaveAttribute('src', REFRESHED_URL);
  });
});
