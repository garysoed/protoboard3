import {expect, Page, test} from '@playwright/test';

import {BasePiece} from '../pieces/base-piece';

async function setupPage(
  page: Page,
  bodyContent: string,
  sides: number,
): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        ${bodyContent}
      </body>
    </html>
  `);
  await page.addScriptTag({path: 'dist/testing.min.js'});
  await page.evaluate((sides) => {
    window.Protoboard.initialize();

    class TestPiece extends window.Protoboard.BasePiece {
      readonly sides = sides;

      constructor() {
        super('Test Piece', () => [
          new window.Protoboard.FlipAction(this.activeFace, sides),
        ]);
      }
    }

    customElements.define('pb-test-piece', TestPiece);
  }, sides);
}

test.describe('FlipAction', () => {
  test('flips back to initial face on 6-sided piece when pressing f key twice', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="0"></pb-test-face>
        <pb-test-face slot="face1" text="1"></pb-test-face>
        <pb-test-face slot="face2" text="2"></pb-test-face>
        <pb-test-face slot="face3" text="3"></pb-test-face>
        <pb-test-face slot="face4" text="4"></pb-test-face>
        <pb-test-face slot="face5" text="5"></pb-test-face>
      </pb-test-piece>
    `,
      6,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('f');
    await page.keyboard.press('f');

    const slotName = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face0');
  });

  test('flips to opposite face (N - 1 - current) on 6-sided piece', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="0"></pb-test-face>
        <pb-test-face slot="face1" text="1"></pb-test-face>
        <pb-test-face slot="face2" text="2"></pb-test-face>
        <pb-test-face slot="face3" text="3"></pb-test-face>
        <pb-test-face slot="face4" text="4"></pb-test-face>
        <pb-test-face slot="face5" text="5"></pb-test-face>
      </pb-test-piece>
    `,
      6,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('f');

    const slotName = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face5');
  });
});
