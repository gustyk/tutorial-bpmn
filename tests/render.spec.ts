import { test, expect } from '@playwright/test';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const bpmnDir = fileURLToPath(new URL('../public/bpmn', import.meta.url));

async function getBpmnFiles(): Promise<string[]> {
  const entries = await readdir(bpmnDir);
  return entries.filter((f) => f.endsWith('.bpmn'));
}

const files = await getBpmnFiles();

for (const file of files) {
  test(`render ${file}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    // Navigate to a page that uses this BPMN file
    const slug = file.replace('.bpmn', '');
    const pageMap: Record<string, string> = {
      'case-01-order': '/practice/narrative/',
      'case-11-capstone': '/practice/capstone/',
    };
    const url = pageMap[slug] ?? `/practice/narrative/`;
    await page.goto(url);

    // Wait for viewer status to indicate loaded or error
    const status = page.locator('.viewer-status').first();
    await status.waitFor({ timeout: 15_000 });
    await page.waitForFunction(
      () => {
        const el = document.querySelector('.viewer-status');
        return el && !el.textContent?.includes('Memuat');
      },
      { timeout: 15_000 }
    );

    const statusText = await status.textContent();
    expect(
      statusText,
      `BPMN viewer failed for ${file}: ${statusText}`
    ).not.toContain('tidak dapat dimuat');

    await page.screenshot({ path: path.join('tests/__screenshots__', `${slug}.png`) });
    expect(consoleErrors, `Console errors for ${file}: ${consoleErrors.join('; ')}`).toHaveLength(0);
  });
}
