import {expect, test} from '@playwright/test';

test.describe('Chute end-to-end interactions', () => {
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
            .chute-zone {
              display: inline-block;
              width: 100px;
              height: 100px;
              border: 2px solid #d35400;
              border-radius: 8px;
              background-color: #78281f;
            }
            .slot-zone {
              display: block;
              width: 200px;
              height: 120px;
              border: 2px dashed #334155;
              border-radius: 8px;
              background-color: #1e293b;
              margin-top: 16px;
              position: relative;
            }
            .token-face {
              width: 40px;
              height: 40px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 11px;
              box-sizing: border-box;
              border: 2px solid #f97316;
              background-color: #ea580c;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div id="test-wrapper">
            <pb-chute id="test-chute" name="Dice Chute" target="#exit-slot" class="chute-zone">
              <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
              <pb-d1 id="trapped-token" name="Trapped Token">
                <div slot="face0" class="token-face">Trapped</div>
              </pb-d1>
            </pb-chute>
            <pb-d1 id="test-token" name="Test Token">
              <div slot="face0" class="token-face">Token</div>
            </pb-d1>
            <pb-slot id="exit-slot" name="Exit Slot" class="slot-zone"></pb-slot>
          </div>
          <pb-hand-overlay></pb-hand-overlay>
          <pb-action-popup id="test-popup"></pb-action-popup>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });
  });

  test('renders chute container with all child pieces hidden and matches visual snapshot', async ({
    page,
  }) => {
    const chute = page.locator('#test-chute');
    await expect(chute).toHaveScreenshot('chute_e2e-initial.png');
  });

  test('drops piece passing layers to target slot and matches visual snapshot', async ({
    page,
  }) => {
    await page.evaluate(() => {
      Math.random = () => 0;
    });

    const token = page.locator('#test-token');
    await token.hover();
    await page.keyboard.press('c');

    const chute = page.locator('#test-chute');
    await chute.hover();
    await page.keyboard.press('Space');

    const exitPiece = page.locator('#exit-slot #test-token');
    await expect(exitPiece).toBeAttached();

    await expect(page).toHaveScreenshot('chute_e2e-passed.png');
  });

  test('drops piece into chute that fails layers and remains trapped', async ({
    page,
  }) => {
    await page.evaluate(() => {
      Math.random = () => 0.99;
    });

    const token = page.locator('#test-token');
    await token.hover();
    await page.keyboard.press('c');

    const chute = page.locator('#test-chute');
    await chute.hover();
    await page.keyboard.press('Space');

    const chutePiece = page.locator('#test-chute #test-token');
    await expect(chutePiece).toBeAttached();

    const exitPiece = page.locator('#exit-slot #test-token');
    await expect(exitPiece).not.toBeAttached();
  });

  test('flushes trapped pieces to target slot on f keypress and matches visual snapshot', async ({
    page,
  }) => {
    const chute = page.locator('#test-chute');
    await chute.hover();
    await page.keyboard.press('f');

    const exitPiece = page.locator('#exit-slot #trapped-token');
    await expect(exitPiece).toBeAttached();

    await expect(page).toHaveScreenshot('chute_e2e-flushed.png');
  });

  test('renders action popup on ? keypress showing aggregated chute actions', async ({
    page,
  }) => {
    const chute = page.locator('#test-chute');
    await chute.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#test-popup .popup');
    await expect(popup).toBeVisible();

    await expect(page).toHaveScreenshot('chute_e2e-popup.png');
  });
});
