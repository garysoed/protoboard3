import {expect, test} from '@playwright/test';

test.describe('render', () => {
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
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('d1_face0.png');
  });
});

test.describe('pick', () => {
  test('picks piece into hand overlay when hovering and pressing c', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="board">
            <pb-d1 id="piece">
              <div slot="face0" style="width: 50px; height: 50px;">Face 0</div>
            </pb-d1>
          </div>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.locator('#piece').hover();
    await page.keyboard.press('c');

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#board pb-d1')).not.toBeAttached();
  });

  test('supports custom shortcut attribute for pick action', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="board">
            <pb-d1 id="piece" action-pick="x">
              <div slot="face0" style="width: 50px; height: 50px;">Face 0</div>
            </pb-d1>
          </div>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#piece').hover();
    await page.keyboard.press('c');
    await expect(overlay.locator('#piece')).not.toBeAttached();

    await page.keyboard.press('x');
    await expect(overlay.locator('#piece')).toBeAttached();
  });
});

test.describe('rotate', () => {
  test('rotates piece when pressing t key and matches visual snapshot', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1 id="piece">
            <pb-test-face slot="face0" text="Pawn"></pb-test-face>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('t');

    await expect(piece).toHaveScreenshot('d1_rotated_90.png');
  });
});
