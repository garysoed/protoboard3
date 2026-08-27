import {expect, Page, test} from '@playwright/test';

import type {BasePiece} from '../pieces/base-piece';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          pb-test-container {
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

    class TestContainer extends window.Protoboard.BaseElement {
      constructor() {
        super('Test Container', () => [new window.Protoboard.FlipAllAction()]);
      }
    }

    class TestPiece extends window.Protoboard.BasePiece {
      readonly sides = 2;

      constructor() {
        super('Test Piece', () => [new window.Protoboard.FlipAction()]);
      }
    }

    customElements.define('pb-test-container', TestContainer);
    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('FlipAllAction', () => {
  test('reverses child element DOM order and flips child pieces when triggered', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-container id="container">
        <pb-test-piece id="piece-1">
          <pb-test-face slot="face0" text="Card 1 Front"></pb-test-face>
          <pb-test-face slot="face1" text="Card 1 Back"></pb-test-face>
        </pb-test-piece>
        <pb-test-piece id="piece-2">
          <pb-test-face slot="face0" text="Card 2 Front"></pb-test-face>
          <pb-test-face slot="face1" text="Card 2 Back"></pb-test-face>
        </pb-test-piece>
      </pb-test-container>
    `,
    );

    const container = page.locator('#container');
    await container.hover();
    await page.keyboard.press('f');

    const childIds = await page.evaluate(() => {
      const el = document.querySelector('#container')!;
      return Array.from(el.children).map((child) => child.id);
    });
    expect(childIds).toEqual(['piece-2', 'piece-1']);

    const piece1Slot = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece-1')!;
      return el.shadowRoot!.querySelector('slot')!.name;
    });
    const piece2Slot = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece-2')!;
      return el.shadowRoot!.querySelector('slot')!.name;
    });

    expect(piece1Slot).toBe('face1');
    expect(piece2Slot).toBe('face1');
  });
});
