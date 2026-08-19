import {expect, Page, test} from '@playwright/test';

import {BaseElement} from '../core/base-element';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        ${bodyContent}
      </body>
    </html>
  `);
  await page.addScriptTag({path: 'dist/testing.min.js'});
  await page.evaluate(() => {
    window.Protoboard.initialize();
  });
}

test.describe('PickAction', () => {
  test('pushes target into hand service when triggered', async ({page}) => {
    await setupPage(
      page,
      `
      <div id="board">
        <pb-d1 id="piece">
          <div slot="face0">Card</div>
        </pb-d1>
      </div>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.evaluate(() => {
      const piece = document.querySelector<BaseElement>('#piece');
      const action = new window.Protoboard.PickAction(() => piece?.handService);
      action.observe(piece!);
      const keyboardEvent = new KeyboardEvent('keydown', {key: 'c'});
      piece?.dispatchEvent(
        new window.Protoboard.ActionEvent('c', keyboardEvent),
      );
    });

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#board pb-d1')).not.toBeAttached();
  });
});
