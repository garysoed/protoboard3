import {expect, Page, test} from '@playwright/test';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          pb-test-container {
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

    class TestContainer extends window.Protoboard.BaseElement {
      constructor() {
        super('Test Container', () => [new window.Protoboard.ShuffleAction()]);
      }
    }

    customElements.define('pb-test-container', TestContainer);
  });
}

test.describe('ShuffleAction', () => {
  test('randomizes child element DOM order when triggered', async ({page}) => {
    await setupPage(
      page,
      `
      <pb-test-container id="container">
        <div id="item-a">A</div>
        <div id="item-b">B</div>
        <div id="item-c">C</div>
        <div id="item-d">D</div>
      </pb-test-container>
    `,
    );

    await page.evaluate(() => {
      Math.random = () => 0;
    });

    const container = page.locator('#container');
    await container.hover();
    await page.keyboard.press('s');

    const childIds = await page.evaluate(() => {
      const el = document.querySelector('#container')!;
      return Array.from(el.children).map((child) => child.id);
    });

    expect(childIds).toEqual(['item-b', 'item-c', 'item-d', 'item-a']);
  });
});
