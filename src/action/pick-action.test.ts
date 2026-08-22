import {expect, Page, test} from '@playwright/test';

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

    class TestPiece extends window.Protoboard.BasePiece {
      readonly sides = 1;

      protected override readonly defaultName = 'Test Piece';

      constructor() {
        super(() => [new window.Protoboard.PickAction(this.handService)]);
      }
    }

    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('PickAction', () => {
  test('pushes target into hand service when triggered', async ({page}) => {
    await setupPage(
      page,
      `
      <div id="board">
        <pb-test-piece id="piece">
          <pb-test-face slot="face0" text="Card"></pb-test-face>
        </pb-test-piece>
      </div>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.locator('#piece').hover();
    await page.keyboard.press('c');

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#board pb-test-piece')).not.toBeAttached();
  });
});
