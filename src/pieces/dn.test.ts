import {expect, Page, test} from '@playwright/test';

import {DN} from './dn';

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
      <pb-dn id="piece" sides="3">
        <pb-test-face slot="face0" text="Face 0" class="die"></pb-test-face>
        <pb-test-face slot="face1" text="Face 1" class="die"></pb-test-face>
        <pb-test-face slot="face2" text="Face 2" class="die"></pb-test-face>
      </pb-dn>
    `,
    );

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('dn_face0.png');
  });
});

test.describe('nextFace', () => {
  test('cycles active face with next-face shortcut', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-dn id="piece" sides="3">
        <div slot="face0">0</div>
        <div slot="face1">1</div>
        <div slot="face2">2</div>
      </pb-dn>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press(']');

    const nextSlot = await page.evaluate(() => {
      const el = document.querySelector<DN>('#piece');
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
      <pb-dn id="piece" sides="3">
        <div slot="face0">0</div>
        <div slot="face1">1</div>
        <div slot="face2">2</div>
      </pb-dn>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('[');

    const prevSlot = await page.evaluate(() => {
      const el = document.querySelector<DN>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(prevSlot).toBe('face2');
  });
});

test.describe('roll', () => {
  test('randomizes face when pressing r key', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-dn id="piece" sides="3">
        <div slot="face0">0</div>
        <div slot="face1">1</div>
        <div slot="face2">2</div>
      </pb-dn>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('r');

    const slotName = await page.evaluate(() => {
      const el = document.querySelector<DN>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slotName).toMatch(/^face[0-2]$/);
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
        <pb-dn id="piece" sides="3">
          <div slot="face0" style="width: 50px; height: 50px;">0</div>
        </pb-dn>
      </div>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.locator('#piece').hover();
    await page.keyboard.press('c');

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#board pb-dn')).not.toBeAttached();
  });
});

test.describe('rotate', () => {
  test('rotates piece when pressing t key and matches visual snapshot', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-dn id="piece" sides="3">
        <pb-test-face slot="face0" text="DN"></pb-test-face>
      </pb-dn>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press('t');

    await expect(piece).toHaveScreenshot('dn_rotated_90.png');
  });
});

test.describe('sides', () => {
  test('dynamically updates boundary when sides attribute changes', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-dn id="piece" sides="2">
        <div slot="face0">0</div>
        <div slot="face1">1</div>
        <div slot="face2">2</div>
      </pb-dn>
    `,
    );

    const piece = page.locator('#piece');
    await piece.hover();
    await page.keyboard.press(']');
    await page.keyboard.press(']');

    let slot = await page.evaluate(() => {
      const el = document.querySelector<DN>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slot).toBe('face0');

    await page.evaluate(() => {
      const el = document.querySelector<DN>('#piece');
      if (el) {
        el.sides = 3;
      }
    });

    await page.keyboard.press('[');
    slot = await page.evaluate(() => {
      const el = document.querySelector<DN>('#piece');
      return el?.shadowRoot?.querySelector('slot')?.name;
    });
    expect(slot).toBe('face2');
  });
});
