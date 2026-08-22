import {expect, test} from '@playwright/test';

import type {BaseElement} from './base-element';

test.describe('BaseElement', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('triggers action with custom shortcut', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick="k"
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Custom</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#piece').hover();
    await page.keyboard.press('c');
    await expect(overlay.locator('#piece')).not.toBeAttached();

    await page.keyboard.press('k');
    await expect(overlay.locator('#piece')).toBeAttached();
  });

  test('triggers action when element is focused', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick="k"
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Focused</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    // Move cursor away so element is not hovered, then focus it
    await page.mouse.move(0, 0);
    await page.locator('#piece').focus();
    await page.keyboard.press('k');

    await expect(overlay.locator('#piece')).toBeAttached();
  });

  test('disables action when action attribute is empty', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick=""
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Disabled</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#piece').hover();
    await page.keyboard.press('c');
    await expect(overlay.locator('#piece')).not.toBeAttached();
  });

  test('triggers action with meta key modifier shortcut', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1
            id="piece"
            action-pick="shift+x"
            style="display: inline-block; width: 50px; height: 50px;"
          >
            <div slot="face0" style="width: 50px; height: 50px;">Modifier</div>
          </pb-d1>
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#piece').hover();
    await page.keyboard.press('x');
    await expect(overlay.locator('#piece')).not.toBeAttached();

    await page.keyboard.press('Shift+x');
    await expect(overlay.locator('#piece')).toBeAttached();
  });

  test('does not trigger action when typing inside form input', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <pb-d1 id="piece" style="display: inline-block; width: 50px; height: 50px;">
            <div slot="face0" style="width: 50px; height: 50px;">Face</div>
          </pb-d1>
          <input id="text-input" type="text" />
        </body>
      </html>
    `);
    await page.addScriptTag({path: 'dist/testing.min.js'});
    await page.evaluate(() => {
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#text-input').focus();
    await page.keyboard.type('c');

    await expect(overlay.locator('#piece')).not.toBeAttached();
    await expect(page.locator('#text-input')).toHaveValue('c');
  });

  test.describe('getActionDescriptors', () => {
    test('returns descriptors for configured actions with correct shortcut keys', async ({
      page,
    }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <body>
            <pb-d1 id="piece" action-pick="x">
              <div slot="face0">Face</div>
            </pb-d1>
          </body>
        </html>
      `);
      await page.addScriptTag({path: 'dist/testing.min.js'});
      await page.evaluate(() => {
        window.Protoboard.initialize();
      });

      const descriptors = await page.evaluate(() => {
        const piece = document.querySelector('#piece')! as BaseElement;
        return piece.getActionDescriptors().map((desc) => ({
          isPickAction: desc.id === window.Protoboard.PickAction,
          isRotateAction: desc.id === window.Protoboard.RotateAction,
          key: desc.shortcut.key,
          label: desc.label,
        }));
      });

      expect(descriptors.length).toBe(2);
      expect(descriptors.find((d) => d.isPickAction)).toEqual({
        isPickAction: true,
        isRotateAction: false,
        key: 'x',
        label: 'Pick',
      });
      expect(descriptors.find((d) => d.isRotateAction)).toEqual({
        isPickAction: false,
        isRotateAction: true,
        key: 't',
        label: 'Rotate',
      });
    });
  });

  test.describe('onQueryActions', () => {
    test('aggregates action groups in bubbling order using default tag names', async ({
      page,
    }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <body>
            <test-container id="container">
              <pb-d1 id="piece">
                <div slot="face0">Face</div>
              </pb-d1>
            </test-container>
          </body>
        </html>
      `);
      await page.addScriptTag({path: 'dist/testing.min.js'});
      await page.evaluate(() => {
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom Container Action';

          protected override onTrigger(): void {}
        }
        class TestContainer extends window.Protoboard.BaseElement {
          protected override readonly defaultName = 'Test Container';

          constructor() {
            super(() => [
              new CustomAction(window.Protoboard.parseTriggerKey('s')),
            ]);
          }
        }
        customElements.define('test-container', TestContainer);
        window.Protoboard.initialize();
      });

      const groups = await page.evaluate(() => {
        const piece = document.querySelector('#piece')! as BaseElement;
        const event = new window.Protoboard.QueryActionsEvent(piece, []);
        piece.dispatchEvent(event);
        return event.detail.actionGroups.map((g) => ({
          actionLabels: g.actions.map((a) => a.label),
          name: g.name,
        }));
      });

      expect(groups.length).toBe(2);
      expect(groups[0]!).toEqual({
        actionLabels: ['Pick', 'Rotate'],
        name: 'D1',
      });
      expect(groups[1]!).toEqual({
        actionLabels: ['Custom Container Action'],
        name: 'Test Container',
      });
    });
  });
});
