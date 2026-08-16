import {expect, test} from '@playwright/test';

test.describe('Playwright test runner smoke test', () => {
  test('launches page and evaluates basic DOM operations', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Protoboard Smoke Test</title>
        </head>
        <body>
          <div id="root">
            <h1>Protoboard</h1>
            <p id="desc">Tabletop prototyping library</p>
          </div>
        </body>
      </html>
    `);

    const heading = page.locator('h1');
    await expect(heading).toHaveText('Protoboard');

    const desc = page.locator('#desc');
    await expect(desc).toHaveText('Tabletop prototyping library');

    const title = await page.title();
    expect(title).toBe('Protoboard Smoke Test');
  });

  test('matches visual snapshot for rendered component markup', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            #box {
              width: 120px;
              height: 60px;
              background-color: #3b82f6;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: sans-serif;
              font-size: 14px;
              font-weight: bold;
              border-radius: 6px;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 16px; background-color: #f8fafc;">
          <div id="box">Protoboard</div>
        </body>
      </html>
    `);

    const box = page.locator('#box');
    await expect(box).toHaveScreenshot('smoke_sample-box.png');
  });
});
