export interface TriggerKey {
  readonly alt: boolean | null;
  readonly ctrl: boolean | null;
  readonly key: string;
  readonly meta: boolean | null;
  readonly shift: boolean | null;
}

export function parseTriggerKey(shortcut: string): TriggerKey {
  const raw = shortcut.trim().toLowerCase();
  const tokens = raw.split('+').map((t) => t.trim());

  if (raw.endsWith('++') || raw === '+') {
    const idx = tokens.indexOf('');
    if (idx !== -1) {
      tokens.splice(idx, 1);
      tokens.push('+');
    }
  }

  let alt = false;
  let ctrl = false;
  let meta = false;
  let shift: boolean | null = false;
  let key = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) {
      continue;
    }
    if (i < tokens.length - 1) {
      if (token === 'alt') {
        alt = true;
        continue;
      }
      if (token === 'ctrl') {
        ctrl = true;
        continue;
      }
      if (token === 'meta') {
        meta = true;
        continue;
      }
      if (token === 'shift') {
        shift = true;
        continue;
      }
    }
    key = token;
  }

  if (shift === false && (key === '?' || key === ':')) {
    shift = null;
  }

  return {
    alt,
    ctrl,
    key,
    meta,
    shift,
  };
}

export function matchesKey(
  triggerKey: TriggerKey,
  event: KeyboardEvent,
): boolean {
  const expectedKey = triggerKey.key.trim().toLowerCase();
  const pressedKey = event.key.toLowerCase();

  let keyMatches = pressedKey === expectedKey;
  if (!keyMatches && (expectedKey === 'space' || expectedKey === ' ')) {
    keyMatches =
      pressedKey === ' ' || pressedKey === 'space' || event.code === 'Space';
  }

  if (!keyMatches) {
    return false;
  }

  if (triggerKey.alt !== null && Boolean(event.altKey) !== triggerKey.alt) {
    return false;
  }

  if (triggerKey.ctrl !== null && Boolean(event.ctrlKey) !== triggerKey.ctrl) {
    return false;
  }

  if (triggerKey.meta !== null && Boolean(event.metaKey) !== triggerKey.meta) {
    return false;
  }

  if (
    triggerKey.shift !== null &&
    Boolean(event.shiftKey) !== triggerKey.shift
  ) {
    return false;
  }

  return true;
}

export function formatTriggerKey(triggerKey: TriggerKey): string {
  if (!triggerKey.key) {
    return '';
  }

  const parts: string[] = [];
  if (triggerKey.ctrl) {
    parts.push('Ctrl');
  }
  if (triggerKey.alt) {
    parts.push('Alt');
  }
  if (triggerKey.meta) {
    parts.push('Cmd');
  }
  if (triggerKey.shift) {
    parts.push('Shift');
  }

  let displayKey = triggerKey.key;
  if (displayKey.toLowerCase() === 'space' || displayKey === ' ') {
    displayKey = 'Space';
  } else if (
    displayKey.length === 1 &&
    displayKey >= 'a' &&
    displayKey <= 'z'
  ) {
    displayKey = displayKey.toUpperCase();
  }

  parts.push(displayKey);
  return parts.join('+');
}
