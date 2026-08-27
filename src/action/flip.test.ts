import {expect, test} from '@playwright/test';

test.describe('flip', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('inverts active face on multi-sided piece', async ({page}) => {
    const result = await page.evaluate(() => {
      const {flip, signal} = window.Protoboard;
      const activeFace = signal(0);
      flip(activeFace, 6);
      const afterFirstFlip = activeFace.get();
      flip(activeFace, 6);
      const afterSecondFlip = activeFace.get();
      return {afterFirstFlip, afterSecondFlip};
    });

    expect(result.afterFirstFlip).toBe(5);
    expect(result.afterSecondFlip).toBe(0);
  });

  test('maintains face 0 on 1-sided piece', async ({page}) => {
    const result = await page.evaluate(() => {
      const {flip, signal} = window.Protoboard;
      const activeFace = signal(0);
      flip(activeFace, 1);
      return activeFace.get();
    });

    expect(result).toBe(0);
  });
});
