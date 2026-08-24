import {expect, test} from '@playwright/test';

test.describe('Protoboard Registration Foundation', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('registers piece elements using default prefix on custom registry', async ({
    page,
  }) => {
    const allRegistered = await page.evaluate(() => {
      window.Protoboard.initialize();
      const tags = [
        'pb-d1',
        'pb-d2',
        'pb-d4',
        'pb-d6',
        'pb-d8',
        'pb-d12',
        'pb-d20',
        'pb-dn',
        'pb-hand-overlay',
        'pb-slot',
      ];
      return tags.every((tag) => !!customElements.get(tag));
    });

    expect(allRegistered).toBe(true);
  });

  test('registers piece elements using custom prefix', async ({page}) => {
    const allRegistered = await page.evaluate(() => {
      window.Protoboard.initialize({prefix: 'tabletop'});
      const tags = [
        'tabletop-d1',
        'tabletop-d2',
        'tabletop-d4',
        'tabletop-d6',
        'tabletop-d8',
        'tabletop-d12',
        'tabletop-d20',
        'tabletop-dn',
        'tabletop-hand-overlay',
        'tabletop-slot',
      ];
      return tags.every((tag) => !!customElements.get(tag));
    });

    expect(allRegistered).toBe(true);
  });
});
