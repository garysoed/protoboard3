import {expect, test} from '@playwright/test';

test.describe('D2 end-to-end interactions', () => {
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
            .coin {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 18px;
            }
            .heads {
              background-color: #fbbf24;
              border: 3px solid #d97706;
              color: #78350f;
            }
            .tails {
              background-color: #94a3b8;
              border: 3px solid #64748b;
              color: #1e293b;
            }
          </style>
        </head>
        <body>
          <div id="tabletop">
            <pb-d2 id="coin">
              <div slot="face0" class="coin heads">HEADS</div>
              <div slot="face1" class="coin tails">TAILS</div>
            </pb-d2>
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
    const piece = page.locator('#coin');
    await expect(piece).toHaveScreenshot('d2_e2e-initial.png');
  });

  test('flips coin to face1 on keypress and matches visual snapshot', async ({
    page,
  }) => {
    const piece = page.locator('#coin');
    await piece.hover();
    await page.keyboard.press('f');
    await expect(piece).toHaveScreenshot('d2_e2e-flipped.png');
  });

  test('picks up coin into hand overlay on hover and keypress', async ({
    page,
  }) => {
    await page.mouse.move(50, 50);
    await page.keyboard.press('c');
    await page.mouse.move(200, 200);
    await expect(page).toHaveScreenshot('d2_e2e-picked.png');
  });
});
