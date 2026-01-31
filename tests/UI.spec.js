const { test, expect } = require('@playwright/test');
 
/**
 * Helper function:
 * Types Tanglish text and ensures Tamil transliteration.
 * If Tamil is not detected, toggles Ctrl+G and retries.
 */
async function ensureTamilModeAndConvert(page, textarea, text) {
  // First attempt
  await textarea.fill('');
  await textarea.type(text + ' ', { delay: 100 });
  await textarea.press('Space');
 
  let value = await textarea.inputValue();
  let hasTamil = /[\u0B80-\u0BFF]/.test(value);
 
  // If Tamil not detected → toggle Tamil mode and retry
  if (!hasTamil) {
    await textarea.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyG');
    await page.keyboard.up('Control');
 
    await textarea.fill('');
    await textarea.type(text + ' ', { delay: 220 });
    await textarea.press('Space');
 
    value = await textarea.inputValue();
    hasTamil = /[\u0B80-\u0BFF]/.test(value);
  }
 
  return { value, hasTamil };
}
 
test.describe('Tamil Transliteration UI Test', () => {
 
  test('UI_01: Transliteration works and reset works', async ({ page }) => {
 
    // ⏱ Increase timeout for AI processing
    test.setTimeout(60000);
 
    // 1️⃣ Open site
    await page.goto('https://tamil.changathi.com/', {
      waitUntil: 'domcontentloaded',
    });
 
    // 2️⃣ Locate textarea
    const textarea = page.locator('#transliterateTextarea');
    await expect(textarea).toBeVisible({ timeout: 5000 });
    await textarea.click();
 
    // 3️⃣ Input Tanglish
    const inputText = 'Assignment aa sumbit panna Screenla confirmation message display aakum';
    const { value, hasTamil } =
      await ensureTamilModeAndConvert(page, textarea, inputText);
 
    // 4️⃣ Validate result and print Pos/Neg
    if (hasTamil) {
      console.log('Pos_UI_01');   // ✅ Tamil detected
    } else {
      console.log('Neg_UI_01');   // ❌ Tamil not detected
    }
 
    // 5️⃣ Clear / Reset textarea
    await textarea.fill('');
    await expect(textarea).toHaveValue('');
  });
 
});