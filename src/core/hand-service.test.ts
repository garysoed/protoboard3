import {expect, test} from '@playwright/test';

test.describe('HandService', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('manages stack in LIFO order and updates overlay children', async ({
    page,
  }) => {
    const handles = await page.evaluateHandle(() => {
      window.Protoboard.initialize();
      const piece1 = document.createElement('div');
      piece1.id = 'p1';
      piece1.textContent = 'Piece 1';

      const piece2 = document.createElement('div');
      piece2.id = 'p2';
      piece2.textContent = 'Piece 2';

      const service = new window.Protoboard.HandService();
      return {piece1, piece2, service};
    });

    const overlay = page.locator('pb-hand-overlay');

    await handles.evaluate(({piece1, service}) => {
      service.push(piece1);
    });
    await expect(overlay.locator('#p1')).toBeAttached();

    await handles.evaluate(({piece2, service}) => {
      service.push(piece2);
    });
    await expect(overlay.locator('#p2')).toBeAttached();

    const popped1Id = await handles.evaluate(({service}) => service.pop()?.id);
    expect(popped1Id).toBe('p2');
    await expect(overlay.locator('#p2')).not.toBeAttached();
    await expect(overlay.locator('#p1')).toBeAttached();

    const popped2Id = await handles.evaluate(({service}) => service.pop()?.id);
    expect(popped2Id).toBe('p1');
    await expect(overlay.locator('#p1')).not.toBeAttached();
  });

  test('popAll returns all pieces in LIFO order and clears overlay', async ({
    page,
  }) => {
    const handles = await page.evaluateHandle(() => {
      window.Protoboard.initialize();
      const piece1 = document.createElement('div');
      piece1.id = 'p1';
      const piece2 = document.createElement('div');
      piece2.id = 'p2';
      const piece3 = document.createElement('div');
      piece3.id = 'p3';

      const service = new window.Protoboard.HandService();
      return {piece1, piece2, piece3, service};
    });

    const overlay = page.locator('pb-hand-overlay');

    await handles.evaluate(({piece1, piece2, piece3, service}) => {
      service.push(piece1);
      service.push(piece2);
      service.push(piece3);
    });

    await expect(overlay.locator('#p1')).toBeAttached();
    await expect(overlay.locator('#p2')).toBeAttached();
    await expect(overlay.locator('#p3')).toBeAttached();

    const poppedIds = await handles.evaluate(({service}) =>
      service.popAll().map((el) => el.id),
    );
    expect(poppedIds).toEqual(['p3', 'p2', 'p1']);

    await expect(overlay.locator('#p1')).not.toBeAttached();
    await expect(overlay.locator('#p2')).not.toBeAttached();
    await expect(overlay.locator('#p3')).not.toBeAttached();
  });
});
