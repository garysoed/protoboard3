import {html, TemplateResult} from 'lit';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';

/**
 * Category grouping for visual face presets.
 */
export type PresetCategory = 'cards' | 'dice' | 'symbols' | 'tokens';

/**
 * Metadata descriptor and generator for a visual face preset.
 */
export interface FacePreset {
  readonly category: PresetCategory;
  readonly id: string;
  readonly name: string;
  readonly render: () => TemplateResult;
  readonly svg: string;
}

const RAW_PRESETS: ReadonlyArray<Omit<FacePreset, 'render'>> = [
  // 1. Dice Pips
  {
    category: 'dice',
    id: 'pip-1',
    name: 'Pip 1',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="8" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="32" cy="32" r="5" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'dice',
    id: 'pip-2',
    name: 'Pip 2',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="8" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="18" cy="18" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="46" r="5" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'dice',
    id: 'pip-3',
    name: 'Pip 3',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="8" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="18" cy="18" r="5" fill="#161616"/>',
      '  <circle cx="32" cy="32" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="46" r="5" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'dice',
    id: 'pip-4',
    name: 'Pip 4',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="8" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="18" cy="18" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="18" r="5" fill="#161616"/>',
      '  <circle cx="18" cy="46" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="46" r="5" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'dice',
    id: 'pip-5',
    name: 'Pip 5',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="8" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="18" cy="18" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="18" r="5" fill="#161616"/>',
      '  <circle cx="32" cy="32" r="5" fill="#161616"/>',
      '  <circle cx="18" cy="46" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="46" r="5" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'dice',
    id: 'pip-6',
    name: 'Pip 6',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="8" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="18" cy="16" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="16" r="5" fill="#161616"/>',
      '  <circle cx="18" cy="32" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="32" r="5" fill="#161616"/>',
      '  <circle cx="18" cy="48" r="5" fill="#161616"/>',
      '  <circle cx="46" cy="48" r="5" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },

  // 2. Cards
  {
    category: 'cards',
    id: 'card-spade',
    name: 'Spade',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="6" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <path d="M32 14 C28 22, 18 28, 18 36 C18 42, 23 46, 28 46 C30 46, 31 45, ',
      '    32 44 C33 45, 34 46, 36 46 C41 46, 46 42, 46 36 C46 28, 36 22, 32 14 Z ',
      '    M30 44 L28 50 L36 50 L34 44 Z" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'cards',
    id: 'card-heart',
    name: 'Heart',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="6" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <path d="M32 48 C32 48, 16 36, 16 26 C16 20, 21 16, 26 16 C29 16, 31 18, ',
      '    32 20 C33 18, 35 16, 38 16 C43 16, 48 20, 48 26 C48 36, 32 48, 32 48 Z" ',
      '    fill="#da1e28"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'cards',
    id: 'card-diamond',
    name: 'Diamond',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="6" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <polygon points="32,14 48,32 32,50 16,32" fill="#da1e28"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'cards',
    id: 'card-club',
    name: 'Club',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="6" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <circle cx="32" cy="24" r="8" fill="#161616"/>',
      '  <circle cx="23" cy="35" r="8" fill="#161616"/>',
      '  <circle cx="41" cy="35" r="8" fill="#161616"/>',
      '  <path d="M30 35 L28 50 L36 50 L34 35 Z" fill="#161616"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'cards',
    id: 'card-joker',
    name: 'Joker',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="6" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <path d="M32 15 L35 25 L45 22 L39 30 L47 37 L37 38 L38 48 L32 41 L26 48 ',
      '    L27 38 L17 37 L25 30 L19 22 L29 25 Z" fill="#8a3ffc"/>',
      '  <circle cx="32" cy="33" r="4" fill="#f1c21b"/>',
      '</svg>',
    ].join('\n'),
  },

  // 3. Tokens & Shapes
  {
    category: 'tokens',
    id: 'meeple',
    name: 'Meeple',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="17" r="7" fill="#d48806"/>',
      '  <path d="M22 28 C26 27, 38 27, 42 28 C45 29, 49 35, 51 40 C49 42, ',
      '    44 41, 41 37 C40 43, 42 53, 44 55 L34 55 C33 50, 33 46, 32 46 C31 46, ',
      '    31 50, 30 55 L20 55 C22 53, 24 43, 23 37 C20 41, 15 42, 13 40 C15 35, ',
      '    19 29, 22 28 Z" fill="#d48806"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'tokens',
    id: 'circle-red',
    name: 'Red Token',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="32" r="28" fill="#da1e28" stroke="#a2191f" stroke-width="3"/>',
      '  <circle cx="32" cy="32" r="20" fill="none" stroke="#ff8389" stroke-width="1.5" ',
      '    opacity="0.6"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'tokens',
    id: 'circle-yellow',
    name: 'Yellow Token',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="32" r="28" fill="#f1c21b" stroke="#b28600" stroke-width="3"/>',
      '  <circle cx="32" cy="32" r="20" fill="none" stroke="#ffffff" stroke-width="1.5" ',
      '    opacity="0.6"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'tokens',
    id: 'circle-green',
    name: 'Green Token',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="32" r="28" fill="#198038" stroke="#0e6027" stroke-width="3"/>',
      '  <circle cx="32" cy="32" r="20" fill="none" stroke="#6fdc8c" stroke-width="1.5" ',
      '    opacity="0.6"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'tokens',
    id: 'circle-blue',
    name: 'Blue Token',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="32" r="28" fill="#0f62fe" stroke="#0043ce" stroke-width="3"/>',
      '  <circle cx="32" cy="32" r="20" fill="none" stroke="#78a9ff" stroke-width="1.5" ',
      '    opacity="0.6"/>',
      '</svg>',
    ].join('\n'),
  },

  // 4. Game Symbols
  {
    category: 'symbols',
    id: 'symbol-arrow',
    name: 'Arrow',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="32" r="28" fill="#ffffff" stroke="#d0d0d0" stroke-width="2"/>',
      '  <polygon points="32,12 48,32 37,32 37,50 27,50 27,32 16,32" fill="#007a3d"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'symbols',
    id: 'symbol-sword',
    name: 'Crossed Swords',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <rect x="2" y="2" width="60" height="60" rx="6" fill="#ffffff" ',
      '    stroke="#d0d0d0" stroke-width="2"/>',
      '  <path d="M18 16 L22 14 L33 25 L44 14 L48 16 L35 29 L48 42 L45 45 L32 32 ',
      '    L19 45 L16 42 L29 29 Z" fill="#525252"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'symbols',
    id: 'symbol-shield',
    name: 'Shield',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <circle cx="32" cy="32" r="28" fill="#ffffff" stroke="#d0d0d0" stroke-width="2"/>',
      '  <path d="M20 18 L44 18 C44 32, 38 44, 32 48 C26 44, 20 32, 20 18 Z" ',
      '    fill="#007a3d" stroke="#0e6027" stroke-width="2"/>',
      '</svg>',
    ].join('\n'),
  },
  {
    category: 'symbols',
    id: 'symbol-star',
    name: 'Gold Star',
    svg: [
      '<svg viewBox="0 0 64 64" width="64" height="64">',
      '  <polygon points="32,10 38,24 53,24 41,34 45,49 32,39 19,49 23,34 11,24 26,24" ',
      '    fill="#f1c21b" stroke="#b28600" stroke-width="2"/>',
      '</svg>',
    ].join('\n'),
  },
];

/**
 * Standard library of 20 built-in 64x64px visual face presets.
 */
export const PRESETS: readonly FacePreset[] = RAW_PRESETS.map((p) => ({
  ...p,
  render: () => html`<span class="pbd-preset-svg">${unsafeSVG(p.svg)}</span>`,
}));

/**
 * Fast lookup map from preset ID to FacePreset.
 */
export const PRESETS_BY_ID: ReadonlyMap<string, FacePreset> = new Map(
  PRESETS.map((p) => [p.id, p]),
);

/**
 * Retrieves a preset by its unique ID.
 */
export function getPreset(id: string): FacePreset | undefined {
  return PRESETS_BY_ID.get(id);
}

/**
 * Retrieves all presets belonging to a specific category.
 */
export function getPresetsByCategory(
  category: PresetCategory,
): readonly FacePreset[] {
  return PRESETS.filter((p) => p.category === category);
}
