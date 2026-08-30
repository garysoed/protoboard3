import {expect, Page, test} from '@playwright/test';

import type {Deck} from './deck';

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
          pb-deck {
            display: inline-block;
            width: 80px;
            height: 120px;
            border: 2px solid #95a5a6;
            border-radius: 8px;
            background: #f8f9fa;
          }
          .test-card {
            width: 80px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: sans-serif;
            font-weight: bold;
            color: white;
            box-sizing: border-box;
          }
          .card-bottom {
            background: #e74c3c;
          }
          .card-top {
            background: #2ecc71;
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
  test('renders only the top piece and hides non-top pieces matching visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div style="padding: 20px;">
        <pb-deck id="test-deck">
          <div class="test-card card-bottom" id="card-1">Bottom</div>
          <div class="test-card card-top" id="card-2">Top</div>
        </pb-deck>
      </div>
    `,
    );

    const deck = page.locator('#test-deck');
    await expect(deck).toHaveScreenshot('deck_slotted.png');
  });
});

test.describe('onDrop', () => {
  test('appends dropped piece as the new top element on Space keypress', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-deck id="test-deck">
          <div class="test-card card-bottom" id="card-1">Bottom</div>
        </pb-deck>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece = document.createElement('div');
      piece.id = 'dropped-card';
      piece.className = 'test-card card-top';
      piece.textContent = 'Dropped';
      const deck = document.querySelector<Deck>('#test-deck')!;
      const service = deck.handService.get()!;
      service.push(piece);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#dropped-card')).toBeAttached();

    await page.locator('#test-deck').hover();
    await page.keyboard.press('Space');

    await expect(overlay.locator('#dropped-card')).not.toBeAttached();
    const droppedCard = page.locator('#test-deck #dropped-card');
    await expect(droppedCard).toBeAttached();

    const lastChildId = await page.evaluate(() => {
      const deck = document.querySelector('#test-deck')!;
      return deck.lastElementChild!.id;
    });
    expect(lastChildId).toBe('dropped-card');
  });
});

test.describe('onDropAll', () => {
  test('appends all dropped pieces to top of deck on Shift+Space', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="parent-container" style="padding: 20px;">
        <pb-deck id="test-deck">
          <div class="test-card card-bottom" id="card-1">Card 1</div>
        </pb-deck>
      </div>
    `,
    );

    await page.evaluate(() => {
      const piece2 = document.createElement('div');
      piece2.id = 'card-2';
      piece2.className = 'test-card card-top';
      piece2.textContent = 'Card 2';

      const piece3 = document.createElement('div');
      piece3.id = 'card-3';
      piece3.className = 'test-card card-top';
      piece3.textContent = 'Card 3';

      const deck = document.querySelector<Deck>('#test-deck')!;
      const service = deck.handService.get()!;
      service.push(piece2);
      service.push(piece3);
    });

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay.locator('#card-2')).toBeAttached();
    await expect(overlay.locator('#card-3')).toBeAttached();

    await page.locator('#test-deck').hover();
    await page.keyboard.press('Shift+Space');

    await expect(overlay.locator('#card-2')).not.toBeAttached();
    await expect(overlay.locator('#card-3')).not.toBeAttached();

    const childIds = await page.evaluate(() => {
      const deck = document.querySelector('#test-deck')!;
      return Array.from(deck.children).map((child) => child.id);
    });
    expect(childIds).toEqual(['card-1', 'card-3', 'card-2']);
  });
});
