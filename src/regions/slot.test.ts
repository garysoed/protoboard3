import {expect, Page, test} from '@playwright/test';

import type {Slot} from './slot';

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
          pb-slot {
            display: block;
            width: 200px;
            height: 200px;
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
  });
}

test.describe('render', () => {
  test('renders slotted children with absolute positioning and matches visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-slot id="test-slot">
        <div
          class="test-item"
          id="item-1"
          style="position: absolute; left: 20px; top: 30px;"
        >Item 1</div>
        <div
          class="test-item"
          id="item-2"
          style="position: absolute; left: 100px; top: 80px;"
        >Item 2</div>
      </pb-slot>
    `,
    );

    const slot = page.locator('#test-slot');
    await expect(slot).toHaveScreenshot('slot_slotted.png');
  });
});

test.describe('onDrop', () => {
  test('positions dropped piece at cursor coordinates relative to slot on Space keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 50px;">
        <pb-slot id="test-slot"></pb-slot>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece = document.createElement('div');
      piece.id = 'dropped-piece';
      piece.className = 'test-item';
      piece.textContent = 'Piece';
      const slot = document.querySelector<Slot>('#test-slot')!;
      const service = slot.handService.get()!;
      service.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece')).toBeAttached();

    await page.mouse.move(120, 140);
    await page.keyboard.press('Space');

    await expect(overlay.locator('#dropped-piece')).not.toBeAttached();
    const droppedPiece = page.locator('#test-slot #dropped-piece');
    await expect(droppedPiece).toBeAttached();

    const positionStyle = await droppedPiece.evaluate((el: HTMLElement) => ({
      left: el.style.left,
      position: el.style.position,
      top: el.style.top,
    }));

    expect(positionStyle.position).toBe('absolute');
    expect(positionStyle.left).toBe('70px');
    expect(positionStyle.top).toBe('90px');
  });
});

test.describe('onDropAll', () => {
  test('positions all dropped pieces at cursor coordinates on Shift+Space', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 50px;">
        <pb-slot id="test-slot"></pb-slot>
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

      const slot = document.querySelector<Slot>('#test-slot')!;
      const service = slot.handService.get()!;
      service.push(piece1);
      service.push(piece2);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-piece-1')).toBeAttached();
    await expect(overlay.locator('#dropped-piece-2')).toBeAttached();

    await page.mouse.move(150, 110);
    await page.keyboard.press('Shift+Space');

    await expect(overlay.locator('#dropped-piece-1')).not.toBeAttached();
    await expect(overlay.locator('#dropped-piece-2')).not.toBeAttached();

    const piece1 = page.locator('#test-slot #dropped-piece-1');
    const piece2 = page.locator('#test-slot #dropped-piece-2');
    await expect(piece1).toBeAttached();
    await expect(piece2).toBeAttached();

    const pos1 = await piece1.evaluate((el: HTMLElement) => ({
      left: el.style.left,
      position: el.style.position,
      top: el.style.top,
    }));
    const pos2 = await piece2.evaluate((el: HTMLElement) => ({
      left: el.style.left,
      position: el.style.position,
      top: el.style.top,
    }));

    expect(pos1.position).toBe('absolute');
    expect(pos1.left).toBe('100px');
    expect(pos1.top).toBe('60px');

    expect(pos2.position).toBe('absolute');
    expect(pos2.left).toBe('100px');
    expect(pos2.top).toBe('60px');
  });
});
