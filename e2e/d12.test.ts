import {expect, test} from '@playwright/test';

test.describe('D12 end-to-end interactions', () => {
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
              background-color: #f59e0b;
              border: 2px solid #fbbf24;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div id="tabletop">
            <pb-d12 id="die">
              <div slot="face0" class="die">1</div>
              <div slot="face1" class="die">2</div>
              <div slot="face2" class="die">3</div>
              <div slot="face3" class="die">4</div>
              <div slot="face4" class="die">5</div>
              <div slot="face5" class="die">6</div>
              <div slot="face6" class="die">7</div>
              <div slot="face7" class="die">8</div>
              <div slot="face8" class="die">9</div>
              <div slot="face9" class="die">10</div>
              <div slot="face10" class="die">11</div>
              <div slot="face11" class="die">12</div>
            </pb-d12>
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
    await expect(piece).toHaveScreenshot('d12_e2e-initial.png');
  });

  test('flips die to face11 on keypress and matches visual snapshot', async ({
    page,
  }) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('f');
    await expect(piece).toHaveScreenshot('d12_e2e-flipped.png');
  });

  test('picks up die into hand overlay on hover and keypress', async ({
    page,
  }) => {
    await page.mouse.move(50, 50);
    await page.keyboard.press('c');
    await page.mouse.move(100, 200);
    await expect(page).toHaveScreenshot('d12_e2e-picked.png');
  });
});
