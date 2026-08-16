import {expect, test} from '@playwright/test';

test.describe('D1 Component', () => {
  test('matches visual snapshot for rendered face0 slot', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .tile {
              width: 80px;
              height: 80px;
            }
          </style>
        </head>
        <body>
          <pb-d1 id="piece">
            <div slot="face0" class="tile">Face 0</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('d1-face0.png');
  });
});
