import { describe, expect, it } from 'vitest';

import {
  ENEMY_ACTIONS,
  PLAYER_ACTIONS,
  VISUAL_ASSET_MANIFEST,
  getEffectVisual,
  getEnemyVisual,
  getPlayerAction,
  getPlayerVisual,
  getScenePropVisual,
  getWeaponVisual,
  validateVisualAssetManifest
} from '../src/game/visualAssets.js';

describe('visual asset manifest', () => {
  it('defines modeled player actions and future spritesheet metadata', () => {
    const player = getPlayerVisual();

    expect(player.style).toContain('2.5D');
    expect(player.actions).toEqual(PLAYER_ACTIONS);
    expect(player.sprite).toMatchObject({
      src: '/assets/characters/warrior-isometric-idle.png',
      frameWidth: 128,
      frameHeight: 160,
      directions: 4
    });
    PLAYER_ACTIONS.forEach((action) => {
      expect(player.sprite.actions[action]).toBeTruthy();
    });
  });

  it('defines modeled enemy visuals for all battle enemy types and boss', () => {
    ['lamp-shadow', 'paper-doll', 'well-shadow', 'mist-armor-general'].forEach((enemyType) => {
      const visual = getEnemyVisual(enemyType);
      expect(visual.actions).toEqual(ENEMY_ACTIONS);
      expect(visual.fallback.palette).toBeTruthy();
      expect(visual.silhouette).toBeTruthy();
    });
  });

  it('defines three modeled weapon skins and combat effect fallbacks', () => {
    ['sword', 'blade', 'spear'].forEach((weaponId) => {
      const visual = getWeaponVisual(weaponId);
      expect(visual.material).toBeTruthy();
      expect(visual.fallback.palette.glow).toBeTruthy();
    });

    expect(getEffectVisual('swordWave').label).toContain('剑气');
    expect(getEffectVisual('slashArc').label).toContain('挥砍');
    expect(getScenePropVisual('bridge').label).toContain('桥');
  });

  it('reports a complete visual contract with no missing modeled fallbacks', () => {
    expect(validateVisualAssetManifest(VISUAL_ASSET_MANIFEST)).toEqual([]);
  });

  it('derives player animation action from state without changing gameplay data', () => {
    const player = { hp: 100, hitFlash: 0, isSwingAnimating: false };

    expect(getPlayerAction(player, 'sword', { x: 0, y: 0 })).toBe('idle');
    expect(getPlayerAction(player, 'sword', { x: 1, y: 0 })).toBe('run');
    expect(getPlayerAction({ ...player, isSwingAnimating: true }, 'blade', { x: 0, y: 0 })).toBe('attack-blade');
    expect(getPlayerAction({ ...player, hp: 0 }, 'spear', { x: 0, y: 0 })).toBe('death');
  });
});
