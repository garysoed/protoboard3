import {expect, test} from '@playwright/test';

test.describe('matchesKey', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('matches exact key without modifiers', async ({page}) => {
    const matched = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const trigger = {
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
      };
      const event = new KeyboardEvent('keydown', {key: 'c'});
      return matchesKey(trigger, event);
    });

    expect(matched).toBe(true);
  });

  test('rejects when shift is pressed but not expected', async ({page}) => {
    const matched = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const trigger = {
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
      };
      const event = new KeyboardEvent('keydown', {key: 'c', shiftKey: true});
      return matchesKey(trigger, event);
    });

    expect(matched).toBe(false);
  });

  test('rejects when alt is pressed but not expected', async ({page}) => {
    const matched = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const trigger = {
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
      };
      const event = new KeyboardEvent('keydown', {altKey: true, key: 'c'});
      return matchesKey(trigger, event);
    });

    expect(matched).toBe(false);
  });

  test('rejects when ctrl is pressed but not expected', async ({page}) => {
    const matched = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const trigger = {
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
      };
      const event = new KeyboardEvent('keydown', {ctrlKey: true, key: 'c'});
      return matchesKey(trigger, event);
    });

    expect(matched).toBe(false);
  });

  test('rejects when meta is pressed but not expected', async ({page}) => {
    const matched = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const trigger = {
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
      };
      const event = new KeyboardEvent('keydown', {key: 'c', metaKey: true});
      return matchesKey(trigger, event);
    });

    expect(matched).toBe(false);
  });

  test('rejects when key does not match', async ({page}) => {
    const matched = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const trigger = {
        alt: false,
        ctrl: false,
        key: 'c',
        meta: false,
        shift: false,
      };
      const event = new KeyboardEvent('keydown', {key: 'x'});
      return matchesKey(trigger, event);
    });

    expect(matched).toBe(false);
  });

  test('matches wildcard modifier when modifier is null', async ({page}) => {
    const results = await page.evaluate(() => {
      const {matchesKey} = window.Protoboard;
      const wildcardTrigger = {
        alt: null,
        ctrl: false,
        key: '?',
        meta: false,
        shift: null,
      };

      const plainEvent = new KeyboardEvent('keydown', {key: '?'});
      const shiftEvent = new KeyboardEvent('keydown', {
        key: '?',
        shiftKey: true,
      });
      const altEvent = new KeyboardEvent('keydown', {altKey: true, key: '?'});
      const ctrlEvent = new KeyboardEvent('keydown', {ctrlKey: true, key: '?'});

      return {
        alt: matchesKey(wildcardTrigger, altEvent),
        ctrl: matchesKey(wildcardTrigger, ctrlEvent),
        plain: matchesKey(wildcardTrigger, plainEvent),
        shift: matchesKey(wildcardTrigger, shiftEvent),
      };
    });

    expect(results.plain).toBe(true);
    expect(results.shift).toBe(true);
    expect(results.alt).toBe(true);
    expect(results.ctrl).toBe(false);
  });
});

test.describe('parseTriggerKey', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('parses plain key without modifiers', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('c');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: false,
      key: 'c',
      meta: false,
      shift: false,
    });
  });

  test('parses shift modifier', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('shift+x');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: false,
      key: 'x',
      meta: false,
      shift: true,
    });
  });

  test('parses ctrl modifier', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('ctrl+c');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: true,
      key: 'c',
      meta: false,
      shift: false,
    });
  });

  test('parses alt modifier', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('alt+a');
    });

    expect(result).toEqual({
      alt: true,
      ctrl: false,
      key: 'a',
      meta: false,
      shift: false,
    });
  });

  test('parses meta modifier', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('meta+z');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: false,
      key: 'z',
      meta: true,
      shift: false,
    });
  });

  test('parses multiple modifiers combined', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('ctrl+alt+shift+k');
    });

    expect(result).toEqual({
      alt: true,
      ctrl: true,
      key: 'k',
      meta: false,
      shift: true,
    });
  });

  test('parses question mark with wildcard shift', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('?');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: false,
      key: '?',
      meta: false,
      shift: null,
    });
  });

  test('parses colon with wildcard shift', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey(':');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: false,
      key: ':',
      meta: false,
      shift: null,
    });
  });

  test('returns key with empty string for empty input', async ({page}) => {
    const result = await page.evaluate(() => {
      return window.Protoboard.parseTriggerKey('');
    });

    expect(result).toEqual({
      alt: false,
      ctrl: false,
      key: '',
      meta: false,
      shift: false,
    });
  });
});

test.describe('getTriggerKeyParts', () => {
  test.beforeEach(async ({page}) => {
    await page.setContent('<!DOCTYPE html><html><body></body></html>');
    await page.addScriptTag({path: 'dist/testing.min.js'});
  });

  test('formats single letter key as uppercase array item', async ({page}) => {
    const parts = await page.evaluate(() => {
      return window.Protoboard.getTriggerKeyParts(
        window.Protoboard.parseTriggerKey('r'),
      );
    });
    expect(parts).toEqual(['R']);
  });

  test('formats modifier keys in order with uppercase key', async ({page}) => {
    const parts = await page.evaluate(() => {
      return window.Protoboard.getTriggerKeyParts(
        window.Protoboard.parseTriggerKey('ctrl+shift+alt+x'),
      );
    });
    expect(parts).toEqual(['Ctrl', 'Alt', 'Shift', 'X']);
  });

  test('formats space key as Space', async ({page}) => {
    const parts = await page.evaluate(() => {
      return window.Protoboard.getTriggerKeyParts(
        window.Protoboard.parseTriggerKey('space'),
      );
    });
    expect(parts).toEqual(['Space']);
  });

  test('formats symbol key without altering symbol', async ({page}) => {
    const parts = await page.evaluate(() => {
      return window.Protoboard.getTriggerKeyParts(
        window.Protoboard.parseTriggerKey('?'),
      );
    });
    expect(parts).toEqual(['?']);
  });

  test('returns empty array for trigger key with empty key', async ({page}) => {
    const parts = await page.evaluate(() => {
      return window.Protoboard.getTriggerKeyParts(
        window.Protoboard.parseTriggerKey(''),
      );
    });
    expect(parts).toEqual([]);
  });
});
