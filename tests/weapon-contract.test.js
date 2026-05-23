import { describe, expect, it } from 'vitest';

import { WEAPON_IDS, WEAPON_UPGRADES, WEAPONS, getWeaponDefinition, getWeaponUpgrades } from '../src/game/weapons.js';

describe('weapon contract', () => {
  it('defines exactly three selectable weapons with distinct attack styles', () => {
    expect(WEAPON_IDS).toEqual(['sword', 'blade', 'spear']);
    expect(Object.keys(WEAPONS).sort()).toEqual([...WEAPON_IDS].sort());

    const styles = WEAPON_IDS.map((id) => getWeaponDefinition(id).attack.style);
    expect(new Set(styles).size).toBe(3);
    expect(styles).toEqual(['sword-wave', 'broad-slash', 'thrust-dash']);
  });

  it('defines exactly three upgrades per weapon', () => {
    WEAPON_IDS.forEach((weaponId) => {
      expect(WEAPON_UPGRADES[weaponId]).toHaveLength(3);
      expect(getWeaponUpgrades(weaponId)).toHaveLength(3);
    });
  });
});
