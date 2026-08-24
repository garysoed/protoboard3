import {expect, Page, test} from '@playwright/test';

async function setupPage(page: Page, bodyContent: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        ${bodyContent}
      </body>
    </html>
  `);
  await page.addScriptTag({path: 'dist/testing.min.js'});
  await page.evaluate(() => {
    window.Protoboard.initialize();
  });
}

test.describe('ActionPopup', () => {
  test.describe('onQueryActions', () => {
    test('renders popup anchored to target element and matches visual snapshot', async ({
      page,
    }) => {
      await setupPage(
        page,
        `
        <div style="position: absolute; left: 100px; top: 150px;">
          <div id="target" style="display: block; width: 60px; height: 60px;">Target</div>
        </div>
        <pb-action-popup id="popup"></pb-action-popup>
      `,
      );

      await page.evaluate(() => {
        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, [
          {
            actions: [
              {
                id: 'pick',
                label: 'Pick',
                shortcut: window.Protoboard.parseTriggerKey('c'),
              },
              {
                id: 'rotate',
                label: 'Rotate',
                shortcut: window.Protoboard.parseTriggerKey('t'),
              },
            ],
            name: 'Pawn Piece',
          },
        ]);
        target.dispatchEvent(event);
      });

      const popup = page.locator('#popup .popup');
      await expect(popup).toBeVisible();
      await expect(page).toHaveScreenshot('action_popup_opened.png');
    });

    test('renders multi-key shortcut with separate kbd elements for each key', async ({
      page,
    }) => {
      await setupPage(
        page,
        `
        <div id="target" style="display: block; width: 60px; height: 60px;">Target</div>
        <pb-action-popup id="popup"></pb-action-popup>
      `,
      );

      await page.evaluate(() => {
        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, [
          {
            actions: [
              {
                id: 'custom',
                label: 'Custom Action',
                shortcut: window.Protoboard.parseTriggerKey('ctrl+shift+k'),
              },
            ],
            name: 'Test Target',
          },
        ]);
        target.dispatchEvent(event);
      });

      const popup = page.locator('#popup .popup');
      await expect(popup).toBeVisible();
      await expect(page).toHaveScreenshot('action_popup_multi_key.png');
    });

    test('toggles popup closed when event is dispatched again for the same element', async ({
      page,
    }) => {
      await setupPage(
        page,
        `
        <div id="target" style="display: inline-block; width: 50px; height: 50px;">Target</div>
        <pb-action-popup id="popup"></pb-action-popup>
      `,
      );

      await page.evaluate(() => {
        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, [
          {
            actions: [
              {
                id: 'pick',
                label: 'Pick',
                shortcut: window.Protoboard.parseTriggerKey('c'),
              },
            ],
            name: 'Piece',
          },
        ]);
        target.dispatchEvent(event);
      });

      const popup = page.locator('#popup .popup');
      await expect(popup).toBeVisible();

      await page.evaluate(() => {
        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, []);
        target.dispatchEvent(event);
      });

      await expect(popup).not.toBeAttached();
    });
  });

  test.describe('onKeyDown', () => {
    test('dismisses popup when Escape key is pressed', async ({page}) => {
      await setupPage(
        page,
        `
        <div id="target" style="display: inline-block; width: 50px; height: 50px;">Target</div>
        <pb-action-popup id="popup"></pb-action-popup>
      `,
      );

      await page.evaluate(() => {
        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, [
          {
            actions: [
              {
                id: 'test',
                label: 'Test Action',
                shortcut: window.Protoboard.parseTriggerKey('t'),
              },
            ],
            name: 'Piece',
          },
        ]);
        target.dispatchEvent(event);
      });

      const popup = page.locator('#popup .popup');
      await expect(popup).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(popup).not.toBeAttached();
    });
  });

  test.describe('onPointerDown', () => {
    test('dismisses popup when clicking outside the popup', async ({page}) => {
      await setupPage(
        page,
        `
        <div id="outside" style="width: 200px; height: 200px; background: red;">Outside</div>
        <div id="target" style="display: inline-block; width: 50px; height: 50px;">Target</div>
        <pb-action-popup id="popup"></pb-action-popup>
      `,
      );

      await page.evaluate(() => {
        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, [
          {
            actions: [
              {
                id: 'test',
                label: 'Test Action',
                shortcut: window.Protoboard.parseTriggerKey('t'),
              },
            ],
            name: 'Piece',
          },
        ]);
        target.dispatchEvent(event);
      });

      const popup = page.locator('#popup .popup');
      await expect(popup).toBeVisible();

      await page.locator('#outside').click({position: {x: 10, y: 10}});
      await expect(popup).not.toBeAttached();
    });
  });

  test.describe('disconnectedCallback', () => {
    test('cleans up event listeners and does not respond to events after removal', async ({
      page,
    }) => {
      await setupPage(
        page,
        `
        <div id="target" style="display: inline-block; width: 50px; height: 50px;">Target</div>
        <pb-action-popup id="popup"></pb-action-popup>
      `,
      );

      await page.evaluate(() => {
        const popup = document.querySelector('#popup')!;
        popup.remove();

        const target = document.querySelector('#target')!;
        const event = new window.Protoboard.QueryActionsEvent(target, [
          {
            actions: [
              {
                id: 'test',
                label: 'Test Action',
                shortcut: window.Protoboard.parseTriggerKey('t'),
              },
            ],
            name: 'Piece',
          },
        ]);
        target.dispatchEvent(event);
      });

      const popup = page.locator('#popup .popup');
      await expect(popup).not.toBeAttached();
    });
  });
});
