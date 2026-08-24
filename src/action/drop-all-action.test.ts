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
          new window.Protoboard.DropAllAction(
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

test.describe('DropAllAction', () => {
  test('pops all pieces from hand service and appends each to element when triggered', async ({
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
      const piece1 = document.createElement('div');
      piece1.id = 'piece-1';
      const piece2 = document.createElement('div');
      piece2.id = 'piece-2';
      const region = document.querySelector<BaseElement>('#region')!;
      const service = region.handService.get()!;
      service.push(piece1);
      service.push(piece2);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#piece-1')).toBeAttached();
    await expect(overlay.locator('#piece-2')).toBeAttached();

    await page.locator('#region').hover();
    await page.keyboard.press('Shift+Space');

    await expect(overlay.locator('#piece-1')).not.toBeAttached();
    await expect(overlay.locator('#piece-2')).not.toBeAttached();
    await expect(page.locator('#region #piece-1')).toBeAttached();
    await expect(page.locator('#region #piece-2')).toBeAttached();
  });
});
