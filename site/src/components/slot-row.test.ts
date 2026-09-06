import {expect, test} from '@playwright/test';

test.describe('render', () => {
  test('matches visual snapshot for slot row', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-slot-row id="row" index="2"></pbd-slot-row>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-slot-row'));
    await page.evaluate(() => document.fonts.ready);

    const row = page.locator('#row');
    await expect(row).toHaveScreenshot('slot_row_render.png');
  });
});

test.describe('selectChange', () => {
  test('dispatches pbd-preset-change when a new preset is selected', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-slot-row id="row" index="0"></pbd-slot-row>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-slot-row'));

    const state = await page.evaluateHandle(() => {
      const holder: {lastDetail?: {index: number; presetId: string}} = {};
      document.addEventListener('pbd-preset-change', (event: Event) => {
        const customEvent = event as CustomEvent<{
          index: number;
          presetId: string;
        }>;
        holder.lastDetail = customEvent.detail;
      });
      return holder;
    });

    const select = page.locator('#row').locator('cds-select select');
    await select.selectOption('card-spade');

    const detail = await state.evaluate((s) => s.lastDetail);
    expect(detail).toEqual({index: 0, presetId: 'card-spade'});

    const rowFace = await page.evaluate(() => {
      const row = document.querySelector('pbd-slot-row')!;
      return row.getSlotFace();
    });
    expect(rowFace).toBe('card-spade');
  });
});
