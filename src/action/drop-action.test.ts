import {expect, Page, test} from '@playwright/test';

import type {BaseElement} from '../core/base-element';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          pb-test-region {
            display: block;
            width: 100px;
            height: 100px;
          }
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
    </html>
  `);
  await page.addScriptTag({path: 'dist/testing.min.js'});
  await page.evaluate(() => {
    window.Protoboard.initialize();

    class TestRegion extends window.Protoboard.BaseElement {
      constructor() {
        super('Test Region', () => [
          new window.Protoboard.DropAction(
            this.handService,
            (target: Element) => {
              this.appendChild(target);
            },
          ),
        ]);
      }
    }

    customElements.define('pb-test-region', TestRegion);
  });
}

test.describe('DropAction', () => {
  test('pops piece from hand service and appends to element when triggered', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container">
        <pb-test-region id="region"></pb-test-region>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece = document.createElement('div');
      piece.id = 'piece-1';
      const region = document.querySelector<BaseElement>('#region')!;
      region.handService.get()!.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#piece-1')).toBeAttached();

    await page.locator('#region').hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#piece-1')).not.toBeAttached();
    await expect(page.locator('#region #piece-1')).toBeAttached();
  });
});
