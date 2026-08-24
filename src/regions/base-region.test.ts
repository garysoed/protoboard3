import {expect, Page, test} from '@playwright/test';

import type {BaseRegion} from './base-region';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          pb-test-region {
            display: block;
            width: 200px;
            height: 100px;
            background: #f0f0f0;
          }
          .test-item {
            width: 50px;
            height: 50px;
            background: #3498db;
            color: white;
            display: inline-block;
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

    class TestRegion extends window.Protoboard.BaseRegion {
      constructor() {
        super('Test Region', () => []);
      }

      protected override onDrop(target: Element): void {
        this.appendChild(target);
      }
    }

    customElements.define('pb-test-region', TestRegion);
  });
}

test.describe('render', () => {
  test('renders slotted children and matches visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-region id="test-region">
        <div class="test-item" id="item-1">Item 1</div>
        <div class="test-item" id="item-2">Item 2</div>
      </pb-test-region>
    `,
    );

    const region = page.locator('#test-region');
    await expect(region).toHaveScreenshot('base_region_slotted.png');
  });
});

test.describe('onDrop', () => {
  test('appends dropped piece to region when drop action is triggered', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container">
        <pb-test-region id="test-region"></pb-test-region>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece = document.createElement('div');
      piece.id = 'dropped-piece';
      piece.className = 'test-item';
      piece.textContent = 'Piece';
      const region = document.querySelector<BaseRegion>('#test-region')!;
      const service = region.handService.get()!;
      service.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece')).toBeAttached();

    await page.locator('#test-region').hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#dropped-piece')).not.toBeAttached();
    await expect(page.locator('#test-region #dropped-piece')).toBeAttached();
  });

  test('appends all dropped pieces to region when drop-all action is triggered', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container">
        <pb-test-region id="test-region"></pb-test-region>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece1 = document.createElement('div');
      piece1.id = 'dropped-piece-1';
      piece1.className = 'test-item';
      piece1.textContent = 'Piece 1';

      const piece2 = document.createElement('div');
      piece2.id = 'dropped-piece-2';
      piece2.className = 'test-item';
      piece2.textContent = 'Piece 2';

      const region = document.querySelector<BaseRegion>('#test-region')!;
      const service = region.handService.get()!;
      service.push(piece1);
      service.push(piece2);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece-1')).toBeAttached();
    await expect(overlay.locator('#dropped-piece-2')).toBeAttached();

    await page.locator('#test-region').hover();
    await page.keyboard.press('Shift+Space');

    await expect(overlay.locator('#dropped-piece-1')).not.toBeAttached();
    await expect(overlay.locator('#dropped-piece-2')).not.toBeAttached();
    await expect(page.locator('#test-region #dropped-piece-1')).toBeAttached();
    await expect(page.locator('#test-region #dropped-piece-2')).toBeAttached();
  });
});
