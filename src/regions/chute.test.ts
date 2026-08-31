import {expect, Page, test} from '@playwright/test';

import type {Chute} from './chute';

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
          pb-chute {
            display: inline-block;
            width: 100px;
            height: 100px;
            border: 2px solid #d35400;
            border-radius: 8px;
            background: #edbb99;
          }
          #target-container {
            display: block;
            width: 200px;
            height: 200px;
            background: #ecf0f1;
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
        <pb-chute id="test-chute" target="#target-container">
          <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
          <div class="test-piece" id="piece-1">Piece 1</div>
          <div class="test-piece" id="piece-2">Piece 2</div>
        </pb-chute>
        <div id="target-container"></div>
      </div>
    `,
    );

    const chute = page.locator('#test-chute');
    await expect(chute).toHaveScreenshot('chute_slotted.png');
  });
});

test.describe('onDrop', () => {
  test('reparents dropped piece to target region when all layers pass on Space keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-chute id="test-chute" target="#target-container">
          <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
        </pb-chute>
        <div id="target-container"></div>
      </div>
    `,
    );

    await page.evaluate(() => {
      Math.random = () => 0;
      const piece = document.createElement('div');
      piece.id = 'dropped-piece';
      piece.className = 'test-piece';
      piece.textContent = 'Dropped';
      const chute = document.querySelector<Chute>('#test-chute')!;
      const service = chute.handService.get()!;
      service.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece')).toBeAttached();

    await page.locator('#test-chute').hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#dropped-piece')).not.toBeAttached();
    const targetPiece = page.locator('#target-container #dropped-piece');
    await expect(targetPiece).toBeAttached();
  });

  test('retains dropped piece inside chute when a layer fails on Space keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-chute id="test-chute" target="#target-container">
          <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
        </pb-chute>
        <div id="target-container"></div>
      </div>
    `,
    );

    await page.evaluate(() => {
      Math.random = () => 0.99;
      const piece = document.createElement('div');
      piece.id = 'dropped-piece';
      piece.className = 'test-piece';
      piece.textContent = 'Dropped';
      const chute = document.querySelector<Chute>('#test-chute')!;
      const service = chute.handService.get()!;
      service.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece')).toBeAttached();

    await page.locator('#test-chute').hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#dropped-piece')).not.toBeAttached();
    const chutePiece = page.locator('#test-chute #dropped-piece');
    await expect(chutePiece).toBeAttached();
    const targetPiece = page.locator('#target-container #dropped-piece');
    await expect(targetPiece).not.toBeAttached();
  });

  test('reparents piece to target region when chute has no layers', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-chute id="test-chute" target="#target-container"></pb-chute>
        <div id="target-container"></div>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece = document.createElement('div');
      piece.id = 'dropped-piece';
      piece.className = 'test-piece';
      piece.textContent = 'Dropped';
      const chute = document.querySelector<Chute>('#test-chute')!;
      const service = chute.handService.get()!;
      service.push(piece);
    });

    await page.locator('#test-chute').hover();
    await page.keyboard.press('Space');

    const targetPiece = page.locator('#target-container #dropped-piece');
    await expect(targetPiece).toBeAttached();
  });
});

test.describe('onDropAll', () => {
  test('evaluates each dropped piece independently on Shift+Space', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-chute id="test-chute" target="#target-container">
          <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
        </pb-chute>
        <div id="target-container"></div>
      </div>
    `,
    );

    await page.evaluate(() => {
      const randomValues: number[] = [0, 0.9];
      let callCount = 0;
      Math.random = () => {
        const val = randomValues[callCount]!;
        callCount++;
        return val;
      };

      const piece1 = document.createElement('div');
      piece1.id = 'piece-1';
      piece1.className = 'test-piece';
      piece1.textContent = 'Piece 1';

      const piece2 = document.createElement('div');
      piece2.id = 'piece-2';
      piece2.className = 'test-piece';
      piece2.textContent = 'Piece 2';

      const chute = document.querySelector<Chute>('#test-chute')!;
      const service = chute.handService.get()!;
      service.push(piece1);
      service.push(piece2);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#piece-1')).toBeAttached();
    await expect(overlay.locator('#piece-2')).toBeAttached();

    await page.locator('#test-chute').hover();
    await page.keyboard.press('Shift+Space');

    await expect(overlay.locator('#piece-1')).not.toBeAttached();
    await expect(overlay.locator('#piece-2')).not.toBeAttached();

    const targetPiece2 = page.locator('#target-container #piece-2');
    await expect(targetPiece2).toBeAttached();

    const trappedPiece1 = page.locator('#test-chute #piece-1');
    await expect(trappedPiece1).toBeAttached();
  });
});

test.describe('onFlush', () => {
  test('evacuates all trapped pieces to target region on f keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-chute id="test-chute" target="#target-container">
          <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
          <div class="test-piece" id="trapped-1">Trapped 1</div>
          <div class="test-piece" id="trapped-2">Trapped 2</div>
        </pb-chute>
        <div id="target-container"></div>
      </div>
    `,
    );

    const chute = page.locator('#test-chute');
    await chute.hover();
    await page.keyboard.press('f');

    const targetPiece1 = page.locator('#target-container #trapped-1');
    const targetPiece2 = page.locator('#target-container #trapped-2');
    await expect(targetPiece1).toBeAttached();
    await expect(targetPiece2).toBeAttached();

    const chutePieces = page.locator('#test-chute .test-piece');
    await expect(chutePieces).not.toBeAttached();
  });
});
