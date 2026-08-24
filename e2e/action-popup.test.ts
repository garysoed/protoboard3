import {expect, test} from '@playwright/test';

test.describe('ActionPopup end-to-end interactions', () => {
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
              background-color: #ef4444;
              border: 2px solid #f87171;
              color: #ffffff;
            }
          </style>
        </head>
        <body>
          <div id="tabletop" style="padding-top: 20px;">
            <pb-d6 id="die" name="Red D6">
              <div slot="face0" class="die">1</div>
              <div slot="face1" class="die">2</div>
              <div slot="face2" class="die">3</div>
              <div slot="face3" class="die">4</div>
              <div slot="face4" class="die">5</div>
              <div slot="face5" class="die">6</div>
            </pb-d6>
          </div>
          <pb-action-popup id="popup"></pb-action-popup>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });
  });

  test('renders action popup anchored to piece on ? keypress and matches visual snapshot', async ({
    page,
  }) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#popup .popup');
    await expect(popup).toBeVisible();
    await expect(page).toHaveScreenshot('action-popup_opened.png');
  });

  test('executes action on piece and closes popup when action item is clicked', async ({
    page,
  }) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#popup .popup');
    await expect(popup).toBeVisible();

    await page.locator('#popup .action-item').filter({hasText: 'Flip'}).click();
    await expect(popup).not.toBeAttached();
    await expect(piece).toHaveScreenshot('action-popup_flipped.png');
  });

  test('dismisses popup when Escape key is pressed', async ({page}) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#popup .popup');
    await expect(popup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(popup).not.toBeAttached();
  });

  test('toggles popup closed when ? is pressed again on the same piece', async ({
    page,
  }) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#popup .popup');
    await expect(popup).toBeVisible();

    await page.keyboard.press('?');
    await expect(popup).not.toBeAttached();
  });

  test('dismisses popup when clicking outside', async ({page}) => {
    const piece = page.locator('#die');
    await piece.hover();
    await page.keyboard.press('?');

    const popup = page.locator('#popup .popup');
    await expect(popup).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(popup).not.toBeAttached();
  });
});
