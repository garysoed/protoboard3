import {expect, Page, test} from '@playwright/test';

import {BasePiece} from '../pieces/base-piece';

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
      readonly sides = 3;

      constructor() {
        super(() => [
          new window.Protoboard.RollAction((element) => {
            if (element instanceof TestPiece) {
              element.roll();
            }
          }),
        ]);
      }

      roll(): void {
        const totalSides = Math.max(1, this.sides);
        this.activeFace.set(Math.floor(Math.random() * totalSides));
      }
    }

    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('RollAction', () => {
  test('triggers roll on hover when pressing r key', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="0"></pb-test-face>
        <pb-test-face slot="face1" text="1"></pb-test-face>
        <pb-test-face slot="face2" text="2"></pb-test-face>
      </pb-test-piece>
    `,
    );

    await page.locator('#piece').hover();
    await page.keyboard.press('r');

    const slotName = await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toMatch(/^face[0-2]$/);
  });
});
