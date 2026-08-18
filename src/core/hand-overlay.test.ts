import {expect, test} from '@playwright/test';

test.describe('HandOverlay', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <pb-hand-overlay>
            <pb-test-face text="Held"></pb-test-face>
          </pb-hand-overlay>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('matches visual snapshot of floating hand overlay at cursor location', async ({
    page,
  }) => {
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    await page.mouse.move(30, 30);
    await expect(page).toHaveScreenshot('hand-overlay_floating.png');
  });
});
