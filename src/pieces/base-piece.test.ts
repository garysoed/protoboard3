import {expect, Page, test} from '@playwright/test';

import type {BasePiece} from './base-piece';

interface TestPiece extends BasePiece {
  readonly sides: number;

  setFace(face: number): void;
}

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
        super(() => []);
      }

      setFace(face: number): void {
        this.activeFace.set(face);
      }
    }
    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('render', () => {
  test('renders active face slot initially and matches visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="Face 0"></pb-test-face>
        <pb-test-face slot="face1" text="Face 1"></pb-test-face>
        <pb-test-face slot="face2" text="Face 2"></pb-test-face>
      </pb-test-piece>
    `,
    );

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('base_piece_face0.png');
  });

  test('switches rendered slot when activeFace changes', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="Face 0"></pb-test-face>
        <pb-test-face slot="face1" text="Face 1"></pb-test-face>
        <pb-test-face slot="face2" text="Face 2"></pb-test-face>
      </pb-test-piece>
    `,
    );

    await page.evaluate(() => {
      const piece = document.querySelector<TestPiece>('#piece');
      piece?.setFace(1);
    });

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('base_piece_face1.png');
  });
});
