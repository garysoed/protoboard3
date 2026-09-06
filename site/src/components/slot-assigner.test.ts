import {expect, test} from '@playwright/test';

test.describe('render', () => {
  test('matches visual snapshot for static 3-sided slot assigner', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-slot-assigner id="assigner" side-count="3"></pbd-slot-assigner>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-slot-assigner'));
    await page.evaluate(() => document.fonts.ready);

    const assigner = page.locator('#assigner');
    await expect(assigner).toHaveScreenshot('slot-assigner-render.png');
  });
});

test.describe('connectedCallback', () => {
  test('throws an error when connected without side-count attribute', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body></body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-slot-assigner'));

    const errorPromise = page.waitForEvent('pageerror');
    await page.evaluate(() => {
      const el = document.createElement('pbd-slot-assigner');
      document.body.appendChild(el);
    });
    const error = await errorPromise;
    expect(error.message).toBe(
      'Attribute "side-count" is required on <pbd-slot-assigner>',
    );
  });
});

test.describe('selectChange', () => {
  test('updates slot faces when selecting a different preset', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-slot-assigner id="assigner" side-count="2"></pbd-slot-assigner>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-slot-assigner'));

    const select = page
      .locator('#assigner')
      .locator('pbd-slot-row')
      .first()
      .locator('cds-select select');
    await select.selectOption('card-spade');

    const slotFaces = await page.evaluate(() => {
      const assigner = document.querySelector('pbd-slot-assigner')!;
      return assigner.getSlotFaces();
    });
    expect(slotFaces).toEqual(['card-spade', 'pip-2']);
  });
});
