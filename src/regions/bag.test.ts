import {expect, Page, test} from '@playwright/test';

import type {Bag} from './bag';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
          pb-bag {
            display: inline-block;
            width: 100px;
            height: 100px;
            border: 2px solid #8e44ad;
            border-radius: 8px;
            background: #f4ecf7;
          }
          .test-piece {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: sans-serif;
            font-weight: bold;
            color: white;
            box-sizing: border-box;
            background: #e74c3c;
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
  });
}

test.describe('render', () => {
  test('suppresses rendering of all child pieces matching visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div style="padding: 20px;">
        <pb-bag id="test-bag">
          <div class="test-piece" id="piece-1">Piece 1</div>
          <div class="test-piece" id="piece-2">Piece 2</div>
        </pb-bag>
      </div>
    `,
    );

    const bag = page.locator('#test-bag');
    await expect(bag).toHaveScreenshot('bag_slotted.png');
  });
});

test.describe('onDrop', () => {
  test('appends dropped piece into bag on Space keypress', async ({page}) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-bag id="test-bag">
          <div class="test-piece" id="piece-1">Piece 1</div>
        </pb-bag>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece = document.createElement('div');
      piece.id = 'dropped-piece';
      piece.className = 'test-piece';
      piece.textContent = 'Dropped';
      const bag = document.querySelector<Bag>('#test-bag')!;
      const service = bag.handService.get()!;
      service.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece')).toBeAttached();

    await page.locator('#test-bag').hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#dropped-piece')).not.toBeAttached();
    const droppedPiece = page.locator('#test-bag #dropped-piece');
    await expect(droppedPiece).toBeAttached();
  });
});

test.describe('onDropAll', () => {
  test('appends all dropped pieces into bag on Shift+Space', async ({page}) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-bag id="test-bag">
          <div class="test-piece" id="piece-1">Piece 1</div>
        </pb-bag>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece2 = document.createElement('div');
      piece2.id = 'piece-2';
      piece2.className = 'test-piece';
      piece2.textContent = 'Piece 2';

      const piece3 = document.createElement('div');
      piece3.id = 'piece-3';
      piece3.className = 'test-piece';
      piece3.textContent = 'Piece 3';

      const bag = document.querySelector<Bag>('#test-bag')!;
      const service = bag.handService.get()!;
      service.push(piece2);
      service.push(piece3);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#piece-2')).toBeAttached();
    await expect(overlay.locator('#piece-3')).toBeAttached();

    await page.locator('#test-bag').hover();
    await page.keyboard.press('Shift+Space');

    await expect(overlay.locator('#piece-2')).not.toBeAttached();
    await expect(overlay.locator('#piece-3')).not.toBeAttached();

    const piece2 = page.locator('#test-bag #piece-2');
    const piece3 = page.locator('#test-bag #piece-3');
    await expect(piece2).toBeAttached();
    await expect(piece3).toBeAttached();
  });
});

test.describe('onPick', () => {
  test('picks a random child piece into hand overlay on c keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-bag id="test-bag">
          <div class="test-piece" id="piece-1">Piece 1</div>
          <div class="test-piece" id="piece-2">Piece 2</div>
        </pb-bag>
      </div>
    `,
    );

    await page.evaluate(() => {
      Math.random = () => 0;
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.locator('#test-bag').hover();
    await page.keyboard.press('c');

    await expect(overlay.locator('#piece-1')).toBeAttached();
    await expect(page.locator('#test-bag #piece-1')).not.toBeAttached();
    await expect(page.locator('#test-bag #piece-2')).toBeAttached();
  });
});

test.describe('onPickAll', () => {
  test('pops all child pieces into hand overlay on Shift+C', async ({page}) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-bag id="test-bag">
          <div class="test-piece" id="piece-1">Piece 1</div>
          <div class="test-piece" id="piece-2">Piece 2</div>
        </pb-bag>
      </div>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.locator('#test-bag').hover();
    await page.keyboard.press('Shift+C');

    await expect(overlay.locator('#piece-1')).toBeAttached();
    await expect(overlay.locator('#piece-2')).toBeAttached();
    await expect(page.locator('#test-bag .test-piece')).not.toBeAttached();
  });
});
