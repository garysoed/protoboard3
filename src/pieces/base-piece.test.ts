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
    class RollAction extends window.Protoboard.BaseAction {
      readonly attrName = 'action-roll';

      constructor() {
        super(window.Protoboard.parseTriggerKey('r'));
      }

      protected override onTrigger(element: Element): void {
        if (element instanceof TestPiece) {
          element.roll();
        }
      }
    }
    class NextFaceAction extends window.Protoboard.BaseAction {
      readonly attrName = 'action-next-face';

      constructor() {
        super(window.Protoboard.parseTriggerKey(']'));
      }

      protected override onTrigger(element: Element): void {
        if (element instanceof TestPiece) {
          element.nextFace();
        }
      }
    }
    class PrevFaceAction extends window.Protoboard.BaseAction {
      readonly attrName = 'action-prev-face';

      constructor() {
        super(window.Protoboard.parseTriggerKey('['));
      }

      protected override onTrigger(element: Element): void {
        if (element instanceof TestPiece) {
          element.prevFace();
        }
      }
    }

    class TestPiece extends window.Protoboard.BasePiece {
      readonly sides = 3;

      constructor() {
        super([new RollAction(), new NextFaceAction(), new PrevFaceAction()]);
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
