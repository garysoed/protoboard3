import {expect, test} from '@playwright/test';

test.describe('Protoboard Registration Foundation', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('registers d1 and d2 elements using default prefix on custom registry', async ({
    page,
  }) => {
    const d1Element = await page.evaluateHandle(() => {
      window.Protoboard.initialize();
      return customElements.get('pb-d1');
    });
    const d2Element = await page.evaluateHandle(() => {
      return customElements.get('pb-d2');
    });

    expect(d1Element).toBeDefined();
    expect(d2Element).toBeDefined();
  });

  test('registers d1 and d2 elements using custom prefix', async ({page}) => {
    const d1Element = await page.evaluateHandle(() => {
      window.Protoboard.initialize({prefix: 'tabletop'});
      return customElements.get('tabletop-d1');
    });
    const d2Element = await page.evaluateHandle(() => {
      return customElements.get('tabletop-d2');
    });

    expect(d1Element).toBeDefined();
    expect(d2Element).toBeDefined();
  });
});
