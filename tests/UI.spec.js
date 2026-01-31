const { test, expect } = require('@playwright/test');

async function ensureTamilModeAndConvert(page, textarea, text) {
  // Try conversion 1
  await textarea.fill('');
  await textarea.type(text + ' ', { delay: 80 });
  await textarea.press('Space');

  // If Tamil unicode not present, toggle Ctrl+G and retry once
  const val1 = await textarea.inputValue();
  const hasTamil1 = /[\u0B80-\u0BFF]/.test(val1);

  if (!hasTamil1) {
    // Toggle mode
    await textarea.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyG');
    await page.keyboard.up('Control');

    // Retry conversion
    await textarea.fill('');
    await textarea.type(text + ' ', { delay: 80 });
    await textarea.press('Space');
  }
}

test('UI_01: Real-time Transliteration & Clear Behavior', async ({ page }) => {
  await page.goto('https://tamil.changathi.com/', { waitUntil: 'domcontentloaded' });

  const textarea = page.locator('#transliterateTextarea');
  await expect(textarea).toBeVisible({ timeout: 10000 });

  await textarea.click();

  // Convert with mode-check + retry
  await ensureTamilModeAndConvert(page, textarea, 'Vanakkam');

  // ✅ Wait until Tamil appears
  await expect(textarea).toHaveValue(/[\u0B80-\u0BFF]/, { timeout: 15000 });
  await expect(textarea).toHaveValue(/வணக்கம்/, { timeout: 15000 });

  // Clear behavior
  await textarea.fill('');
  await expect(textarea).toHaveValue('', { timeout: 5000 });
});
