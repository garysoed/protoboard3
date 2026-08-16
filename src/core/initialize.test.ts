import {expect, test} from '@playwright/test';

test.describe('Protoboard Registration Foundation', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/protoboard.min.js'});
  });

  test('registers d1 element using default prefix on custom registry', async ({
    page,
  }) => {
    const customElement = await page.evaluateHandle(() => {
      window.Protoboard.initialize();
      return customElements.get('pb-d1');
    });

    expect(customElement).toBeDefined();
  });

  test('registers d1 element using custom prefix', async ({page}) => {
    const customElement = await page.evaluateHandle(() => {
      window.Protoboard.initialize({prefix: 'tabletop'});
      return customElements.get('tabletop-d1');
    });

    expect(customElement).toBeDefined();
  });
});
