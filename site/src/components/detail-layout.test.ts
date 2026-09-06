import {expect, test} from '@playwright/test';

test.describe('render', () => {
  test('matches visual snapshot for detail layout with live preview', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-detail-layout
            id="layout"
            title="D6 Die"
            tag="pb-d6"
            code="<pb-d6></pb-d6>"
          >
            <p slot="description">A standard 6-sided die.</p>
            <div slot="preview" style="padding: 20px; font-size: 16px;">Live Die Preview</div>
          </pbd-detail-layout>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-detail-layout'));
    await page.evaluate(() => document.fonts.ready);

    const layout = page.locator('#layout');
    await expect(layout).toHaveScreenshot('detail_layout_render.png');
  });
});

test.describe('previewSwitcher', () => {
  test('matches visual snapshot when switched to HTML Code view', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-detail-layout
            id="layout"
            title="D6 Die"
            tag="pb-d6"
            code="<pb-d6>\n  <span slot=&quot;face0&quot;>1</span>\n</pb-d6>"
          >
            <p slot="description">A standard 6-sided die.</p>
            <div slot="preview" style="padding: 20px; font-size: 16px;">Live Die Preview</div>
          </pbd-detail-layout>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-detail-layout'));

    const switcher = page.locator('#layout').locator('cds-content-switcher');
    const htmlItem = switcher.locator(
      'cds-content-switcher-item[value="html"]',
    );
    await htmlItem.click();
    await page.evaluate(() => document.fonts.ready);

    const layout = page.locator('#layout');
    await expect(layout).toHaveScreenshot('detail_layout_code_view.png');
  });
});

test.describe('addToSandbox', () => {
  test('dispatches pbd-add-to-sandbox event when button is clicked', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <pbd-detail-layout
            id="layout"
            title="D6 Die"
            tag="pb-d6"
            code="<pb-d6></pb-d6>"
          >
          </pbd-detail-layout>
        </body>
      </html>
    `);
    await page.addStyleTag({path: 'site/dist/styles.css'});
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
    await page.addScriptTag({path: 'site/dist/site.min.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('pbd-detail-layout'));

    const target = await page.evaluateHandle(() => {
      const state: {detail?: {code: string; tag: string; title: string}} = {};
      document.addEventListener('pbd-add-to-sandbox', (event: Event) => {
        const customEvent = event as CustomEvent<{
          code: string;
          tag: string;
          title: string;
        }>;
        state.detail = customEvent.detail;
      });
      return state;
    });

    await page.locator('#layout').locator('#add-to-sandbox-btn').click();

    const detail = await target.evaluate((state) => state.detail);
    expect(detail).toEqual({
      code: '<pb-d6></pb-d6>',
      tag: 'pb-d6',
      title: 'D6 Die',
    });
  });
});
