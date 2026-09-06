import {html, TemplateResult} from 'lit';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';

import cardClubSvg from './svg/card-club.svg';
import cardDiamondSvg from './svg/card-diamond.svg';
import cardHeartSvg from './svg/card-heart.svg';
import cardJokerSvg from './svg/card-joker.svg';
import cardSpadeSvg from './svg/card-spade.svg';
import circleBlueSvg from './svg/circle-blue.svg';
import circleGreenSvg from './svg/circle-green.svg';
import circleRedSvg from './svg/circle-red.svg';
import circleYellowSvg from './svg/circle-yellow.svg';
import meepleSvg from './svg/meeple.svg';
import pip1Svg from './svg/pip-1.svg';
import pip2Svg from './svg/pip-2.svg';
import pip3Svg from './svg/pip-3.svg';
import pip4Svg from './svg/pip-4.svg';
import pip5Svg from './svg/pip-5.svg';
import pip6Svg from './svg/pip-6.svg';
import symbolArrowSvg from './svg/symbol-arrow.svg';
import symbolShieldSvg from './svg/symbol-shield.svg';
import symbolStarSvg from './svg/symbol-star.svg';
import symbolSwordSvg from './svg/symbol-sword.svg';

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
  {category: 'dice', id: 'pip-1', name: 'Pip 1', svg: pip1Svg},
  {category: 'dice', id: 'pip-2', name: 'Pip 2', svg: pip2Svg},
  {category: 'dice', id: 'pip-3', name: 'Pip 3', svg: pip3Svg},
  {category: 'dice', id: 'pip-4', name: 'Pip 4', svg: pip4Svg},
  {category: 'dice', id: 'pip-5', name: 'Pip 5', svg: pip5Svg},
  {category: 'dice', id: 'pip-6', name: 'Pip 6', svg: pip6Svg},

  // 2. Cards
  {category: 'cards', id: 'card-spade', name: 'Spade', svg: cardSpadeSvg},
  {category: 'cards', id: 'card-heart', name: 'Heart', svg: cardHeartSvg},
  {category: 'cards', id: 'card-diamond', name: 'Diamond', svg: cardDiamondSvg},
  {category: 'cards', id: 'card-club', name: 'Club', svg: cardClubSvg},
  {category: 'cards', id: 'card-joker', name: 'Joker', svg: cardJokerSvg},

  // 3. Tokens & Shapes
  {category: 'tokens', id: 'meeple', name: 'Meeple', svg: meepleSvg},
  {category: 'tokens', id: 'circle-red', name: 'Red Token', svg: circleRedSvg},
  {
    category: 'tokens',
    id: 'circle-yellow',
    name: 'Yellow Token',
    svg: circleYellowSvg,
  },
  {
    category: 'tokens',
    id: 'circle-green',
    name: 'Green Token',
    svg: circleGreenSvg,
  },
  {
    category: 'tokens',
    id: 'circle-blue',
    name: 'Blue Token',
    svg: circleBlueSvg,
  },

  // 4. Game Symbols
  {category: 'symbols', id: 'symbol-arrow', name: 'Arrow', svg: symbolArrowSvg},
  {
    category: 'symbols',
    id: 'symbol-sword',
    name: 'Crossed Swords',
    svg: symbolSwordSvg,
  },
  {
    category: 'symbols',
    id: 'symbol-shield',
    name: 'Shield',
    svg: symbolShieldSvg,
  },
  {
    category: 'symbols',
    id: 'symbol-star',
    name: 'Gold Star',
    svg: symbolStarSvg,
  },
];

/**
 * Standard library of 20 built-in 64x64px visual face presets.
 */
export const PRESETS: readonly FacePreset[] = RAW_PRESETS.map((p) => ({
  ...p,
  render: () => html`<span class="preset-svg">${unsafeSVG(p.svg)}</span>`,
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
