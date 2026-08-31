import {expect, Page, test} from '@playwright/test';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          pb-test-chute, #target-container {
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

    class TestChute extends window.Protoboard.BaseElement {
      constructor() {
        super('Test Chute', () => [new window.Protoboard.FlushAction()]);
      }
    }

    customElements.define('pb-test-chute', TestChute);
  });
}

test.describe('FlushAction', () => {
  test('evacuates trapped child pieces into resolved target container', async ({
    page,
  }) => {
    await setupPage(
      page,
      `
      <div id="target-container"></div>
      <pb-test-chute id="chute" target="#target-container">
        <pb-chute-layer layer="1" chance="0.5"></pb-chute-layer>
        <div id="trapped-1" class="piece">Piece 1</div>
        <div id="trapped-2" class="piece">Piece 2</div>
      </pb-test-chute>
    `,
    );

    const chute = page.locator('#chute');
    await chute.hover();
    await page.keyboard.press('f');

    const targetChildIds = await page.evaluate(() => {
      const target = document.querySelector('#target-container')!;
      return Array.from(target.children).map((child) => child.id);
    });
    expect(targetChildIds).toEqual(['trapped-1', 'trapped-2']);

    const remainingChuteChildIds = await page.evaluate(() => {
      const chuteEl = document.querySelector('#chute')!;
      return Array.from(chuteEl.children).map((child) =>
        child.tagName.toLowerCase(),
      );
    });
    expect(remainingChuteChildIds).toEqual(['pb-chute-layer']);
  });

  test('does nothing if target container is not found', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-chute id="chute" target="#non-existent">
        <div id="trapped-1" class="piece">Piece 1</div>
      </pb-test-chute>
    `,
    );

    const chute = page.locator('#chute');
    await chute.hover();
    await page.keyboard.press('f');

    const chuteChildIds = await page.evaluate(() => {
      const chuteEl = document.querySelector('#chute')!;
      return Array.from(chuteEl.children).map((child) => child.id);
    });
    expect(chuteChildIds).toEqual(['trapped-1']);
  });
});
