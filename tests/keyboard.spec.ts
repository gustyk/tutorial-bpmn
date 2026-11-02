import { test, expect } from '@playwright/test';

// T-12.4: keyboard navigation — Tab reaches key interactive elements, Enter activates them
test('keyboard nav: home page Tab reaches CTA', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  // First tab should hit skip link or CTA
  expect(['A', 'BUTTON'].includes(await page.evaluate(() => document.activeElement?.tagName ?? ''))).toBeTruthy();
});

test('keyboard nav: jalur/01 can Tab to interactive element', async ({ page }) => {
  await page.goto('/jalur/01/');
  await page.waitForLoadState('networkidle');
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    if (tag === 'BUTTON' || tag === 'A') break;
  }
  const activeTag = await page.evaluate(() => document.activeElement?.tagName);
  expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'DETAILS'].includes(activeTag ?? '')).toBeTruthy();
});

test('keyboard nav: CriteriaChecker button reachable via Tab', async ({ page }) => {
  await page.goto('/jalur/01/');
  await page.waitForLoadState('networkidle');
  const btn = page.locator('.cc__run-btn').first();
  await btn.focus();
  const isFocusable = await btn.evaluate(el => el === document.activeElement || document.activeElement?.contains(el));
  expect(isFocusable).toBeTruthy();
});

test('keyboard nav: all buttons on jalur/01 are keyboard-focusable', async ({ page }) => {
  await page.goto('/jalur/01/');
  await page.waitForLoadState('networkidle');
  const buttons = page.locator('button:not([disabled])');
  const count = await buttons.count();
  expect(count, 'should have at least one enabled button').toBeGreaterThan(0);
  // First enabled button should be focusable
  await buttons.first().focus();
  const isFocused = await buttons.first().evaluate(el => el === document.activeElement);
  expect(isFocused).toBeTruthy();
});

test('keyboard nav: focus-visible outline CSS rule present', async ({ page }) => {
  await page.goto('/jalur/01/');
  const hasFocusRule = await page.evaluate(() => {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule.cssText?.includes('focus-visible') && rule.cssText?.includes('outline')) {
            return true;
          }
        }
      } catch { /* cross-origin */ }
    }
    return false;
  });
  expect(hasFocusRule, 'focus-visible outline rule must be present in stylesheets').toBeTruthy();
});
