import {expect, Page, test} from '@playwright/test';

import {D4} from './d4';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .die {
            width: 80px;
            height: 80px;
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
  test('matches visual snapshot for rendered face0 slot', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <pb-test-face slot="face0" text="1" class="die"></pb-test-face>
        <pb-test-face slot="face1" text="2" class="die"></pb-test-face>
        <pb-test-face slot="face2" text="3" class="die"></pb-test-face>
        <pb-test-face slot="face3" text="4" class="die"></pb-test-face>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('d4_face0.png');
  });

  test('matches visual snapshot for rendered face3 slot after flipping', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <pb-test-face slot="face0" text="1" class="die"></pb-test-face>
        <pb-test-face slot="face1" text="2" class="die"></pb-test-face>
        <pb-test-face slot="face2" text="3" class="die"></pb-test-face>
        <pb-test-face slot="face3" text="4" class="die"></pb-test-face>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('f');

    await expect(piece).toHaveScreenshot('d4_face3.png');
  });
});

test.describe('flip', () => {
  test('flips to opposite face (face0 <-> face3)', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <div slot="face0">1</div>
        <div slot="face3">4</div>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('f');

    const slot = await page.evaluate(() => {
      const el = document.querySelector<D4>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slot).toBe('face3');
  });
});

test.describe('nextFace', () => {
  test('cycles active face with next-face shortcut', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <div slot="face0">1</div>
        <div slot="face1">2</div>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press(']');

    const nextSlot = await page.evaluate(() => {
      const el = document.querySelector<D4>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(nextSlot).toBe('face1');
  });
});

test.describe('prevFace', () => {
  test('cycles active face with prev-face shortcut', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <div slot="face0">1</div>
        <div slot="face3">4</div>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('[');

    const prevSlot = await page.evaluate(() => {
      const el = document.querySelector<D4>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(prevSlot).toBe('face3');
  });
});

test.describe('roll', () => {
  test('randomizes face when pressing r key', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <div slot="face0">1</div>
        <div slot="face1">2</div>
        <div slot="face2">3</div>
        <div slot="face3">4</div>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('r');

    const slotName = await page.evaluate(() => {
      const el = document.querySelector<D4>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slotName).toMatch(/^face[0-3]$/);
  });
});

test.describe('pick', () => {
  test('picks piece into hand overlay when hovering and pressing c', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="board">
        <pb-d4 id="piece">
          <div slot="face0" style="width: 50px; height: 50px;">1</div>
        </pb-d4>
      </div>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.locator('#piece').hover();
    await page.keyboard.press('c');

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#board pb-d4')).not.toBeAttached();
  });
});

test.describe('rotate', () => {
  test('rotates piece when pressing t key and matches visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-d4 id="piece">
        <pb-test-face slot="face0" text="D4"></pb-test-face>
      </pb-d4>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('t');

    await expect(piece).toHaveScreenshot('d4_rotated_90.png');
  });
});
