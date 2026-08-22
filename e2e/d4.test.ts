import {expect, test} from '@playwright/test';

test.describe('D4 end-to-end interactions', () => {
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
            .die {
              width: 80px;
              height: 80px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 20px;
              background-color: #8b5cf6;
              border: 2px solid #a78bfa;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div id="tabletop">
            <pb-d4 id="die">
              <div slot="face0" class="die">1</div>
              <div slot="face1" class="die">2</div>
              <div slot="face2" class="die">3</div>
              <div slot="face3" class="die">4</div>
            </pb-d4>
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
    const piece = page.locator('#die');
    await expect(piece).toHaveScreenshot('d4_e2e-initial.png');
  });

  test('flips die to face3 on keypress and matches visual snapshot', async ({
    page,
  }) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('f');
    await expect(piece).toHaveScreenshot('d4_e2e-flipped.png');
  });

  test('picks up die into hand overlay on hover and keypress', async ({
    page,
  }) => {
    await page.mouse.move(50, 50);
    await page.keyboard.press('c');
    await page.mouse.move(100, 200);
    await expect(page).toHaveScreenshot('d4_e2e-picked.png');
  });
});
