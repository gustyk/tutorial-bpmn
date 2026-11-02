import { test, expect } from '@playwright/test';
import path from 'node:path';

const ROUTES = [
  { name: 'home',      url: '/' },
  { name: 'jalur-01',  url: '/jalur/01/' },
  { name: 'jalur-10',  url: '/jalur/10/' },
  { name: 'notasi-a01', url: '/notasi/task/' },
  { name: 'katalog',   url: '/katalog/' },
  { name: 'matriks',   url: '/katalog/matriks-event/' },
  { name: 'referensi-review', url: '/referensi/review/' },
  { name: 'alat-periksa', url: '/alat/periksa-model/' },
];

for (const route of ROUTES) {
  test(`360px — ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(route.url);
    await page.waitForLoadState('networkidle');

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(
      scrollWidth,
      `Horizontal overflow at ${route.url}: scrollWidth=${scrollWidth} > 360`
    ).toBeLessThanOrEqual(365); // small tolerance for scrollbar

    await page.screenshot({
      path: path.join('tests/__screenshots__', `360px-${route.name}.png`),
      fullPage: false,
    });
  });
}
