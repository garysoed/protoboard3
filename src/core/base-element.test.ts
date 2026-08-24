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

  test('bubbles unhandled keypress from child piece to enclosing container', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <test-container
            id="parent-container"
            style="display: block; width: 200px; height: 200px;"
          >
            <pb-d1 id="piece" style="display: inline-block; width: 50px; height: 50px;">
              <div slot="face0" style="width: 50px; height: 50px;">Piece</div>
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

        protected override onTrigger(el: Element): void {
          el.setAttribute('data-triggered', 'true');
        }
      }
      class TestContainer extends window.Protoboard.BaseElement {
        constructor() {
          super('Test Container', () => [
            new CustomAction(window.Protoboard.parseTriggerKey('s')),
          ]);
        }

        protected override render(): unknown {
          return window.Protoboard.html`<slot></slot>`;
        }
      }
      customElements.define('test-container', TestContainer);
      window.Protoboard.initialize();
    });

    await page.locator('#piece').hover();
    await page.keyboard.press('s');

    await expect(page.locator('#parent-container')).toHaveAttribute(
      'data-triggered',
      'true',
    );
  });

  test('does not trigger container action when key is handled by child piece', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <test-container
            id="parent-container"
            style="display: block; width: 200px; height: 200px;"
          >
            <pb-d1
              id="piece"
              action-pick="c"
              style="display: inline-block; width: 50px; height: 50px;"
            >
              <div slot="face0" style="width: 50px; height: 50px;">Piece</div>
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

        protected override onTrigger(el: Element): void {
          el.setAttribute('data-container-triggered', 'true');
        }
      }
      class TestContainer extends window.Protoboard.BaseElement {
        constructor() {
          super('Test Container', () => [
            new CustomAction(window.Protoboard.parseTriggerKey('c')),
          ]);
        }

        protected override render(): unknown {
          return window.Protoboard.html`<slot></slot>`;
        }
      }
      customElements.define('test-container', TestContainer);
      window.Protoboard.initialize();
    });

    const overlay = page.locator('pb-hand-overlay');

    await page.locator('#piece').hover();
    await page.keyboard.press('c');

    await expect(overlay.locator('#piece')).toBeAttached();
    await expect(page.locator('#parent-container')).not.toHaveAttribute(
      'data-container-triggered',
      'true',
    );
  });

  test('triggers container action when container is directly hovered', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <test-container
            id="parent-container"
            style="display: block; width: 200px; height: 200px;"
          >
            <pb-d1 id="piece" style="display: inline-block; width: 50px; height: 50px;">
              <div slot="face0" style="width: 50px; height: 50px;">Piece</div>
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

        protected override onTrigger(el: Element): void {
          el.setAttribute('data-triggered', 'true');
        }
      }
      class TestContainer extends window.Protoboard.BaseElement {
        constructor() {
          super('Test Container', () => [
            new CustomAction(window.Protoboard.parseTriggerKey('s')),
          ]);
        }

        protected override render(): unknown {
          return window.Protoboard.html`<slot></slot>`;
        }
      }
      customElements.define('test-container', TestContainer);
      window.Protoboard.initialize();
    });

    await page.locator('#parent-container').hover({position: {x: 150, y: 150}});
    await page.keyboard.press('s');

    await expect(page.locator('#parent-container')).toHaveAttribute(
      'data-triggered',
      'true',
    );
  });

  test('triggers container action when container is directly focused', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <test-container
            id="parent-container"
            style="display: block; width: 200px; height: 200px;"
          >
            <pb-d1 id="piece" style="display: inline-block; width: 50px; height: 50px;">
              <div slot="face0" style="width: 50px; height: 50px;">Piece</div>
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

        protected override onTrigger(el: Element): void {
          el.setAttribute('data-triggered', 'true');
        }
      }
      class TestContainer extends window.Protoboard.BaseElement {
        constructor() {
          super('Test Container', () => [
            new CustomAction(window.Protoboard.parseTriggerKey('s')),
          ]);
        }

        protected override render(): unknown {
          return window.Protoboard.html`<slot></slot>`;
        }
      }
      customElements.define('test-container', TestContainer);
      window.Protoboard.initialize();
    });

    await page.mouse.move(0, 0);
    await page.locator('#parent-container').focus();
    await page.keyboard.press('s');

    await expect(page.locator('#parent-container')).toHaveAttribute(
      'data-triggered',
      'true',
    );
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
        const idNames = new Map<unknown, string>([
          [window.Protoboard.HelpAction, 'HelpAction'],
          [window.Protoboard.PickAction, 'PickAction'],
          [window.Protoboard.RotateAction, 'RotateAction'],
        ]);
        return piece.getActionDescriptors().map((desc) => ({
          id: idNames.get(desc.id),
          key: desc.shortcut.key,
          label: desc.label,
        }));
      });

      expect(descriptors).toEqual([
        {
          id: 'HelpAction',
          key: '?',
          label: 'Help',
        },
        {
          id: 'PickAction',
          key: 'x',
          label: 'Pick',
        },
        {
          id: 'RotateAction',
          key: 't',
          label: 'Rotate',
        },
      ]);
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
          constructor() {
            super('Test Container', () => [
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
        actionLabels: ['Help', 'Pick', 'Rotate'],
        name: 'D1',
      });
      expect(groups[1]!).toEqual({
        actionLabels: ['Help', 'Custom Container Action'],
        name: 'Test Container',
      });
    });

    test('uses customized element names from name attributes', async ({
      page,
    }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <body>
            <test-container id="container" name="Special Zone">
              <pb-d1 id="piece" name="Custom Die">
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
          constructor() {
            super('Test Container', () => [
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
        actionLabels: ['Help', 'Pick', 'Rotate'],
        name: 'Custom Die',
      });
      expect(groups[1]!).toEqual({
        actionLabels: ['Help', 'Custom Container Action'],
        name: 'Special Zone',
      });
    });

    test('updates element name reactively when name attribute changes', async ({
      page,
    }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <body>
            <pb-d1 id="piece">
              <div slot="face0">Face</div>
            </pb-d1>
          </body>
        </html>
      `);
      await page.addScriptTag({path: 'dist/testing.min.js'});
      await page.evaluate(() => {
        window.Protoboard.initialize();
      });

      const updatedName = await page.evaluate(() => {
        const piece = document.querySelector('#piece')! as BaseElement;
        piece.setAttribute('name', 'Dynamically Renamed');
        const event = new window.Protoboard.QueryActionsEvent(piece, []);
        piece.dispatchEvent(event);
        return event.detail.actionGroups[0]!.name;
      });

      expect(updatedName).toBe('Dynamically Renamed');
    });

    test('reverts element name to defaultName when name attribute is removed', async ({
      page,
    }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <body>
            <pb-d1 id="piece" name="Custom Die">
              <div slot="face0">Face</div>
            </pb-d1>
          </body>
        </html>
      `);
      await page.addScriptTag({path: 'dist/testing.min.js'});
      await page.evaluate(() => {
        window.Protoboard.initialize();
      });

      const revertedName = await page.evaluate(() => {
        const piece = document.querySelector('#piece')! as BaseElement;
        piece.removeAttribute('name');
        const event = new window.Protoboard.QueryActionsEvent(piece, []);
        piece.dispatchEvent(event);
        return event.detail.actionGroups[0]!.name;
      });

      expect(revertedName).toBe('D1');
    });
  });
});
