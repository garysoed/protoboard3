import {expect, test} from '@playwright/test';

test.describe('End-to-End smoke test', () => {
  test('evaluates page interactions across browser engines', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Protoboard E2E Test</title>
        </head>
        <body>
          <div id="e2e-root">
            <h1>Protoboard E2E</h1>
            <p id="desc">Multi-browser test</p>
          </div>
        </body>
      </html>
    `);

    const heading = page.locator('h1');
    await expect(heading).toHaveText('Protoboard E2E');

    const desc = page.locator('#desc');
    await expect(desc).toHaveText('Multi-browser test');

    const title = await page.title();
    expect(title).toBe('Protoboard E2E Test');
  });

  test('matches visual snapshot for e2e test markup', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            #card {
              width: 140px;
              height: 70px;
              background-color: #10b981;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: sans-serif;
              font-size: 14px;
              font-weight: bold;
              border-radius: 8px;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 16px; background-color: #f8fafc;">
          <div id="card">E2E Card</div>
        </body>
      </html>
    `);

    const card = page.locator('#card');
    await expect(card).toHaveScreenshot('smoke_sample-card.png');
  });
});
