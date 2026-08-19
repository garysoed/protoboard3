import {expect, Page, test} from '@playwright/test';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        ${bodyContent}
      </body>
    </html>
  `);
  await page.addScriptTag({path: 'dist/testing.min.js'});
  await page.evaluate(() => {
    window.Protoboard.initialize();
  });
}

test.describe('RotateAction', () => {
  test('cycles through default rotations 0, 90, 180, 270', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d1 id="piece">
        <pb-test-face slot="face0" text="0"></pb-test-face>
      </pb-d1>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();

    await page.keyboard.press('t');
    await expect(piece).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');

    await page.keyboard.press('t');
    await expect(piece).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');

    await page.keyboard.press('t');
    await expect(piece).toHaveCSS('transform', 'matrix(0, -1, 1, 0, 0, 0)');

    await page.keyboard.press('t');
    await expect(piece).toHaveCSS('transform', 'none');
  });

  test('matches visual snapshot for rotated piece', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d1 id="piece">
        <pb-test-face slot="face0" text="Face"></pb-test-face>
      </pb-d1>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('t');

    await expect(piece).toHaveScreenshot('base_piece_rotated_90.png');
  });

  test('parses custom action-rotate-stops attribute and cycles accordingly', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-d1 id="piece" action-rotate-stops="0, 180">
        <pb-test-face slot="face0" text="0"></pb-test-face>
      </pb-d1>
    `,
    );

    const piece = page.locator('#piece');

    await piece.hover();
    await page.keyboard.press('t');
    await expect(piece).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');

    await page.keyboard.press('t');
    await expect(piece).toHaveCSS('transform', 'none');
  });
});
