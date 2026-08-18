import {expect, Page, test} from '@playwright/test';

import {BasePiece} from './base-piece';

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
      constructor() {
        super();
        this.sides = 3;
        this.registerAction({
          defaultShortcut: 'r',
          handler: () => this.roll(),
          id: 'roll',
        });
        this.registerAction({
          defaultShortcut: ']',
          handler: () => this.nextFace(),
          id: 'next-face',
        });
        this.registerAction({
          defaultShortcut: '[',
          handler: () => this.prevFace(),
          id: 'prev-face',
        });
      }
    }
    if (!customElements.get('pb-test-piece')) {
      customElements.define('pb-test-piece', TestPiece);
    }
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

  test('switches rendered slot when nextFace is called programmatically', async ({
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

    await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.nextFace();
    });

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('base_piece_face1.png');
  });
});

test.describe('roll', () => {
  test('randomizes active face within bounds when roll is called programmatically', async ({
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

    const slotName = await page.evaluate(async () => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.roll();
      await piece?.updateComplete;
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toMatch(/^face[0-2]$/);
  });

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

  test('supports custom shortcut attribute for roll action', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece" action-roll="o">
        <pb-test-face slot="face0" text="0"></pb-test-face>
        <pb-test-face slot="face1" text="1"></pb-test-face>
        <pb-test-face slot="face2" text="2"></pb-test-face>
      </pb-test-piece>
    `,
    );

    await page.locator('#piece').hover();
    await page.keyboard.press('o');

    const slotName = await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toMatch(/^face[0-2]$/);
  });
});

test.describe('nextFace', () => {
  test('advances active face to next index', async ({page}) => {
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

    const slotName = await page.evaluate(async () => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.nextFace();
      await piece?.updateComplete;
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

    const slotName = await page.evaluate(async () => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.nextFace();
      piece?.nextFace();
      piece?.nextFace();
      await piece?.updateComplete;
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face0');
  });

  test('triggers nextFace on hover when pressing bracket key', async ({
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

  test('supports custom shortcut attribute for next-face action', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece" action-next-face="n">
        <pb-test-face slot="face0" text="0"></pb-test-face>
        <pb-test-face slot="face1" text="1"></pb-test-face>
        <pb-test-face slot="face2" text="2"></pb-test-face>
      </pb-test-piece>
    `,
    );

    await page.locator('#piece').hover();
    await page.keyboard.press('n');

    const slotName = await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face1');
  });
});

test.describe('prevFace', () => {
  test('steps back active face to previous index', async ({page}) => {
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

    const slotName = await page.evaluate(async () => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.nextFace();
      piece?.nextFace();
      piece?.prevFace();
      await piece?.updateComplete;
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face1');
  });

  test('wraps around to last face when stepping back from 0', async ({
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

    const slotName = await page.evaluate(async () => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.prevFace();
      await piece?.updateComplete;
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face2');
  });

  test('triggers prevFace on hover when pressing left bracket key', async ({
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
    await page.keyboard.press('[');

    const slotName = await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face2');
  });

  test('supports custom shortcut attribute for prev-face action', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece" action-prev-face="p">
        <pb-test-face slot="face0" text="0"></pb-test-face>
        <pb-test-face slot="face1" text="1"></pb-test-face>
        <pb-test-face slot="face2" text="2"></pb-test-face>
      </pb-test-piece>
    `,
    );

    await page.locator('#piece').hover();
    await page.keyboard.press('p');

    const slotName = await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      return piece?.shadowRoot?.querySelector('slot')?.name;
    });

    expect(slotName).toBe('face2');
  });
});

test.describe('rotate', () => {
  test('cycles through default rotations 0, 90, 180, 270', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="0"></pb-test-face>
      </pb-test-piece>
    `,
    );

    const piece = page.locator('#piece');

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });
    await expect(piece).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });
    await expect(piece).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });
    await expect(piece).toHaveCSS('transform', 'matrix(0, -1, 1, 0, 0, 0)');

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });
    await expect(piece).toHaveCSS('transform', 'none');
  });

  test('matches visual snapshot for rotated piece', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="Face"></pb-test-face>
      </pb-test-piece>
    `,
    );

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });

    const piece = page.locator('#piece');
    await expect(piece).toHaveScreenshot('base_piece_rotated_90.png');
  });

  test('parses custom rotations attribute and cycles accordingly', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece" rotations="0, 180">
        <pb-test-face slot="face0" text="0"></pb-test-face>
      </pb-test-piece>
    `,
    );

    const piece = page.locator('#piece');

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });
    await expect(piece).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');

    await page.evaluate(() => {
      const el = document.querySelector<BasePiece>('#piece');
      el?.rotate();
    });
    await expect(piece).toHaveCSS('transform', 'none');
  });

  test('triggers rotate on hover when pressing t key', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece">
        <pb-test-face slot="face0" text="0"></pb-test-face>
      </pb-test-piece>
    `,
    );

    const piece = page.locator('#piece');

    await piece.hover();
    await page.keyboard.press('t');

    await expect(piece).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');
  });

  test('supports custom shortcut attribute for rotate action', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <pb-test-piece id="piece" action-rotate="y">
        <pb-test-face slot="face0" text="0"></pb-test-face>
      </pb-test-piece>
    `,
    );

    const piece = page.locator('#piece');

    await piece.hover();
    await page.keyboard.press('y');

    await expect(piece).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');
  });
});

test.describe('pick', () => {
  test('pushes piece into hand service when pick is called programmatically', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="board">
        <pb-test-piece id="piece">
          <pb-test-face slot="face0" text="0"></pb-test-face>
        </pb-test-piece>
      </div>
    `,
    );

    const overlay = page.locator('pb-hand-overlay');
    await expect(overlay).not.toBeAttached();

    await page.evaluate(() => {
      const piece = document.querySelector<BasePiece>('#piece');
      piece?.pick();
    });

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#board pb-test-piece')).not.toBeAttached();
  });

  test('picks piece into hand overlay when hovering and pressing c', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="board">
        <pb-test-piece id="piece">
          <pb-test-face slot="face0" text="0"></pb-test-face>
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
