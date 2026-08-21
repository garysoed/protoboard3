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
          new window.Protoboard.NextFaceAction(
            this.activeFace,
            window.Protoboard.signal(3),
          ),
        ]);
      }
    }

    customElements.define('pb-test-piece', TestPiece);
  });
}

test.describe('NextFaceAction', () => {
  test('advances active face to next index on hover when pressing bracket key', async ({
    page,
  }) => {
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
    await page.keyboard.press(']');

    const slotName = await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face1');
  });

  test('wraps around to 0 when advancing past last face', async ({page}) => {
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

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press(']');
    await page.keyboard.press(']');
    await page.keyboard.press(']');

    const slotName = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face0');
  });

  test('reacts to dynamic totalSides signal updates', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-dynamic-piece id="piece">
            <div slot="face0" style="width: 50px; height: 50px;">0</div>
            <div slot="face1" style="width: 50px; height: 50px;">1</div>
            <div slot="face2" style="width: 50px; height: 50px;">2</div>
            <div slot="face3" style="width: 50px; height: 50px;">3</div>
          </pb-dynamic-piece>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();

      class DynamicPiece extends window.Protoboard.BasePiece {
        readonly sides = 2;
        readonly totalSides = window.Protoboard.signal(2);

        constructor() {
          super(() => [
            new window.Protoboard.NextFaceAction(
              this.activeFace,
              this.totalSides,
            ),
          ]);
        }
      }

      customElements.define('pb-dynamic-piece', DynamicPiece);
    });

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press(']');

    let slotName = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slotName).toBe('face1');

    await page.evaluate(() => {
      const el = document.querySelector<
        HTMLElement & {totalSides: {set: (v: number) => void}}
      >('#piece');
      if (el) {
        el.totalSides.set(4);
      }
    });

    await page.keyboard.press(']');
    slotName = await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slotName).toBe('face2');
  });
});
