import {expect, Page, test} from '@playwright/test';

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
        super('Test Container', () => [
          new window.Protoboard.PickAllAction(this.handService),
        ]);
      }
    }

    class TestPiece extends window.Protoboard.BasePiece {
      readonly sides = 1;

      constructor() {
        super('Test Piece', () => []);
      }
    }

    customElements.define('pb-test-container', TestContainer);
    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('PickAllAction', () => {
  test('pops all child pieces into hand overlay when Shift+C is triggered', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-container id="container">
        <pb-test-piece id="piece-1">
          <pb-test-face slot="face0" text="Card 1"></pb-test-face>
        </pb-test-piece>
        <pb-test-piece id="piece-2">
          <pb-test-face slot="face0" text="Card 2"></pb-test-face>
        </pb-test-piece>
      </pb-test-container>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    const container = page.locator('#container');
    await container.hover();
    await page.keyboard.press('Shift+C');

    await expect(overlay.locator('#piece-1')).toBeAttached();
    await expect(overlay.locator('#piece-2')).toBeAttached();
    await expect(page.locator('#container pb-test-piece')).not.toBeAttached();
  });
});
