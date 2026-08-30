import {expect, test} from '@playwright/test';

test.describe('Bag end-to-end interactions', () => {
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
            .bag-zone {
              display: inline-block;
              width: 100px;
              height: 100px;
              border: 2px solid #8e44ad;
              border-radius: 8px;
              background-color: #3b1d4a;
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
              border: 2px solid #f87171;
              background-color: #ef4444;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div id="bag-wrapper">
            <pb-bag id="test-bag" name="Token Bag" class="bag-zone">
              <pb-d1 id="token-1" name="Ruby Token">
                <div slot="face0" class="token-face">Ruby</div>
              </pb-d1>
              <pb-d1 id="token-2" name="Sapphire Token">
                <div slot="face0" class="token-face">Sapphire</div>
              </pb-d1>
            </pb-bag>
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

  test('renders bag container with all child pieces hidden and matches visual snapshot', async ({
    page,
  }) => {
    const bag = page.locator('#test-bag');
    await expect(bag).toHaveScreenshot('bag_e2e-initial.png');
  });

  test('draws a random token on hover and c keypress and matches visual snapshot', async ({
    page,
  }) => {
    await page.evaluate(() => {
      Math.random = () => 0;
    });

    const bag = page.locator('#test-bag');
    await bag.hover();
    await page.keyboard.press('c');

    await page.mouse.move(100, 250);
    await expect(page).toHaveScreenshot('bag_e2e-picked.png');
  });

  test('renders action popup on ? keypress showing aggregated bag actions', async ({
    page,
  }) => {
    const bag = page.locator('#test-bag');
    await bag.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#test-popup .popup');
    await expect(popup).toBeVisible();

    await expect(page).toHaveScreenshot('bag_e2e-popup.png');
  });

  test('drops held token into bag on Space keypress', async ({page}) => {
    await page.evaluate(() => {
      Math.random = () => 0;
    });

    const bag = page.locator('#test-bag');
    await bag.hover();
    await page.keyboard.press('c');

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#token-1')).toBeAttached();

    await bag.hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#token-1')).not.toBeAttached();
    const lastChildId = await page.evaluate(() => {
      const el = document.querySelector('#test-bag')!;
      return el.lastElementChild!.id;
    });
    expect(lastChildId).toBe('token-1');
  });

  test('picks all tokens into hand overlay on Shift+C keypress', async ({
    page,
  }) => {
    const bag = page.locator('#test-bag');
    await bag.hover();
    await page.keyboard.press('Shift+C');

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#token-1')).toBeAttached();
    await expect(overlay.locator('#token-2')).toBeAttached();

    const childCount = await page.evaluate(() => {
      const el = document.querySelector('#test-bag')!;
      return el.children.length;
    });
    expect(childCount).toBe(0);
  });
});
