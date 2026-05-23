export const WEAPON_IDS = ['sword', 'blade', 'spear'];

export const WEAPONS = {
  sword: {
    id: 'sword',
    name: '剑',
    trait: '灵活剑气',
    attack: {
      style: 'sword-wave',
      cooldown: 15,
      range: 92,
      arc: Math.PI * 0.82,
      damage: 32,
      knockback: 10,
      wave: true
    },
    visual: { color: '#54C6B2', swingWidth: 9 }
  },
  blade: {
    id: 'blade',
    name: '刀',
    trait: '横扫重击',
    attack: {
      style: 'broad-slash',
      cooldown: 28,
      range: 118,
      arc: Math.PI * 1.35,
      damage: 48,
      knockback: 24,
      wave: false
    },
    visual: { color: '#D7A84B', swingWidth: 15 }
  },
  spear: {
    id: 'spear',
    name: '枪',
    trait: '突进穿刺',
    attack: {
      style: 'thrust-dash',
      cooldown: 22,
      range: 150,
      arc: Math.PI * 0.34,
      damage: 38,
      knockback: 16,
      dash: 28,
      wave: false
    },
    visual: { color: '#f4efe0', swingWidth: 7 }
  }
};

export const WEAPON_UPGRADES = {
  sword: [
    { id: 'sword-flow', title: '流云剑步', desc: '移动速度提升 12%，挥剑冷却更短。', apply: (player) => { player.speed *= 1.12; player.attackCooldownBonus += 2; } },
    { id: 'sword-wave', title: '青锋剑气', desc: '剑气半径与伤害提升。', apply: (player) => { player.swordWaveBoost += 0.35; } },
    { id: 'sword-focus', title: '听风破影', desc: '伤害提升 20%，能量获取更快。', apply: (player) => { player.damageMult *= 1.2; player.energyGainMult *= 1.2; } }
  ],
  blade: [
    { id: 'blade-cleave', title: '横街断影', desc: '刀势范围提升 20%。', apply: (player) => { player.rangeMult *= 1.2; } },
    { id: 'blade-impact', title: '重门开山', desc: '刀击伤害和击退提升。', apply: (player) => { player.damageMult *= 1.25; player.knockbackMult *= 1.25; } },
    { id: 'blade-blood', title: '赤灯回息', desc: '击杀时有机会回复生命。', apply: (player) => { player.vampRate += 0.25; } }
  ],
  spear: [
    { id: 'spear-dash', title: '游龙入阵', desc: '突进距离提升，穿刺更利落。', apply: (player) => { player.spearDashBoost += 0.45; } },
    { id: 'spear-pierce', title: '寒星贯雾', desc: '穿刺伤害提升 22%。', apply: (player) => { player.damageMult *= 1.22; } },
    { id: 'spear-guard', title: '回马护身', desc: '最大生命提升并回复一截气血。', apply: (player) => { player.maxHp += 35; player.hp = Math.min(player.maxHp, player.hp + 45); } }
  ]
};

export function getWeaponDefinition(weaponId) {
  return WEAPONS[weaponId] ?? WEAPONS.sword;
}

export function getWeaponUpgrades(weaponId) {
  return WEAPON_UPGRADES[getWeaponDefinition(weaponId).id];
}
