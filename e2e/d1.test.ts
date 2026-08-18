import {expect, test} from '@playwright/test';

test.describe('D1 end-to-end interactions', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 24px;
              background-color: #0f172a;
              font-family: sans-serif;
            }
            .card {
              width: 100px;
              height: 100px;
              background-color: #1e293b;
              border: 2px solid #38bdf8;
              border-radius: 8px;
              color: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div id="tabletop">
            <pb-d1 id="gem">
              <div slot="face0" class="card">Diamond</div>
            </pb-d1>
          </div>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });
  });

  test('renders face0 slot initially and matches visual snapshot', async ({
    page,
  }) => {
    const piece = page.locator('#gem');
    await expect(piece).toHaveScreenshot('d1_e2e-initial.png');
  });

  test('picks up piece into hand overlay on hover and keypress', async ({
    page,
  }) => {
    await page.mouse.move(50, 50);
    await page.keyboard.press('c');
    await page.mouse.move(200, 200);
    await expect(page).toHaveScreenshot('d1_e2e-picked.png');
  });
});
