import {expect, test} from '@playwright/test';

test.describe('BaseElement', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('triggers action with custom shortcut', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick="k"
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Custom</div>
          </pb-d1>
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

    await page.keyboard.press('k');
    await expect(overlay.locator('#piece')).toBeAttached();
  });

  test('triggers action when element is focused', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick="k"
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Focused</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    // Move cursor away so element is not hovered, then focus it
    await page.mouse.move(0, 0);
    await page.locator('#piece').focus();
    await page.keyboard.press('k');

    await expect(overlay.locator('#piece')).toBeAttached();
  });

  test('disables action when action attribute is empty', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick=""
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Disabled</div>
          </pb-d1>
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
  });

  test('triggers action with meta key modifier shortcut', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick="shift+x"
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Modifier</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#piece').hover();
    await page.keyboard.press('x');
    await expect(overlay.locator('#piece')).not.toBeAttached();

    await page.keyboard.press('Shift+x');
    await expect(overlay.locator('#piece')).toBeAttached();
  });

  test('does not trigger action when typing inside form input', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1 id="piece" style="display: inline-block; width: 50px; height: 50px;">
            <div slot="face0" style="width: 50px; height: 50px;">Face</div>
          </pb-d1>
          <input id="text-input" type="text" />
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#text-input').focus();
    await page.keyboard.type('c');

    await expect(overlay.locator('#piece')).not.toBeAttached();
    await expect(page.locator('#text-input')).toHaveValue('c');
  });
});
