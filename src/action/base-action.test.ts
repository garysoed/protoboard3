import {expect, test} from '@playwright/test';

test.describe('BaseAction', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test.describe('onAction', () => {
    test('triggers onTrigger with element when ActionEvent matches triggerKey', async ({
      page,
    }) => {
      const triggered = await page.evaluate(() => {
        let passedElement: Element | undefined;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override onTrigger(el: Element): void {
            passedElement = el;
          }
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        element.id = 'test-el';
        action.observe(element);

        const keyboardEvent = new KeyboardEvent('keydown', {key: 'k'});
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('k', keyboardEvent),
        );
        return {passedElementId: passedElement?.id};
      });

      expect(triggered.passedElementId).toBe('test-el');
    });

    test('does not trigger when ActionEvent does not match triggerKey', async ({
      page,
    }) => {
      const triggered = await page.evaluate(() => {
        let count = 0;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override onTrigger(): void {
            count++;
          }
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        action.observe(element);

        const keyboardEvent = new KeyboardEvent('keydown', {key: 'z'});
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('z', keyboardEvent),
        );
        return {count};
      });

      expect(triggered.count).toBe(0);
    });

    test('does not trigger when triggerKey is disabled', async ({page}) => {
      const triggered = await page.evaluate(() => {
        let count = 0;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override onTrigger(): void {
            count++;
          }
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        element.setAttribute('action-custom', '');
        action.observe(element);

        const keyboardEvent = new KeyboardEvent('keydown', {key: 'k'});
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('k', keyboardEvent),
        );
        return {count};
      });

      expect(triggered.count).toBe(0);
    });
  });

  test.describe('observe', () => {
    test('updates triggerKey and initializes attributes on initial observe', async ({
      page,
    }) => {
      const result = await page.evaluate(() => {
        let initAttrValue: null | string = null;
        let triggered = false;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override initAttributes(el: Element): void {
            initAttrValue = el.getAttribute('action-custom-config');
          }
          protected override onTrigger(): void {
            triggered = true;
          }
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        element.setAttribute('action-custom', 'm');
        element.setAttribute('action-custom-config', 'hello');
        action.observe(element);

        const oldKeyEvent = new KeyboardEvent('keydown', {key: 'k'});
        const newKeyEvent = new KeyboardEvent('keydown', {key: 'm'});
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('k', oldKeyEvent),
        );
        const didTriggerOld = triggered;

        triggered = false;
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('m', newKeyEvent),
        );
        const didTriggerNew = triggered;

        return {didTriggerNew, didTriggerOld, initAttrValue};
      });

      expect(result.initAttrValue).toBe('hello');
      expect(result.didTriggerOld).toBe(false);
      expect(result.didTriggerNew).toBe(true);
    });

    test('dynamically updates triggerKey when attribute changes', async ({
      page,
    }) => {
      const result = await page.evaluate(async () => {
        let triggerCount = 0;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override onTrigger(): void {
            triggerCount++;
          }
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        document.body.appendChild(element);
        action.observe(element);

        element.setAttribute('action-custom', 'p');
        await new Promise((resolve) => setTimeout(resolve, 0));

        const keyboardEvent = new KeyboardEvent('keydown', {key: 'p'});
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('p', keyboardEvent),
        );

        return {triggerCount};
      });

      expect(result.triggerCount).toBe(1);
    });

    test('strips attrName prefix when notifying onAttributeChanged', async ({
      page,
    }) => {
      const result = await page.evaluate(async () => {
        let observedSubName: string | undefined;
        let observedValue: null | string = null;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override onAttributeChanged(
            subName: string,
            el: Element,
          ): void {
            observedSubName = subName;
            observedValue = el.getAttribute(`action-custom-${subName}`);
          }
          protected override onTrigger(): void {}
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        document.body.appendChild(element);
        action.observe(element);

        element.setAttribute('action-custom-options', 'value123');
        await new Promise((resolve) => setTimeout(resolve, 0));

        return {observedSubName, observedValue};
      });

      expect(result.observedSubName).toBe('options');
      expect(result.observedValue).toBe('value123');
    });
  });

  test.describe('unobserve', () => {
    test('stops listening to ActionEvent and attribute changes', async ({
      page,
    }) => {
      const result = await page.evaluate(async () => {
        let triggerCount = 0;
        let attributeChangedCount = 0;
        class CustomAction extends window.Protoboard.BaseAction {
          readonly attrName = 'action-custom';
          readonly label = 'Custom';

          protected override onAttributeChanged(): void {
            attributeChangedCount++;
          }
          protected override onTrigger(): void {
            triggerCount++;
          }
        }
        const action = new CustomAction(window.Protoboard.parseTriggerKey('k'));
        const element = document.createElement('div');
        document.body.appendChild(element);
        action.observe(element);
        action.unobserve(element);

        const keyboardEvent = new KeyboardEvent('keydown', {key: 'k'});
        element.dispatchEvent(
          new window.Protoboard.ActionEvent('k', keyboardEvent),
        );

        element.setAttribute('action-custom-options', 'newValue');
        await new Promise((resolve) => setTimeout(resolve, 0));

        return {attributeChangedCount, triggerCount};
      });

      expect(result.triggerCount).toBe(0);
      expect(result.attributeChangedCount).toBe(0);
    });
  });

  test.describe('getActionDescriptor', () => {
    test('generates descriptor for FlipAction and handler executes action', async ({
      page,
    }) => {
      const result = await page.evaluate(() => {
        const activeFace = window.Protoboard.signal(0);
        const action = new window.Protoboard.FlipAction(activeFace, 2);
        const el = document.createElement('div');
        action.observe(el);

        const descriptor = action.getActionDescriptor(el);
        descriptor.handler();

        return {
          faceAfter: activeFace.get(),
          isFlipAction: descriptor.id === window.Protoboard.FlipAction,
          key: descriptor.shortcut.key,
          label: descriptor.label,
        };
      });

      expect(result.isFlipAction).toBe(true);
      expect(result.label).toBe('Flip');
      expect(result.key).toBe('f');
      expect(result.faceAfter).toBe(1);
    });
  });
});
