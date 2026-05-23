export const WEAPON_IDS = ['sword', 'blade', 'spear', 'daggers', 'ring', 'fan'];

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
  },
  daggers: {
    id: 'daggers',
    name: '双月匕',
    trait: '近身连闪',
    attack: {
      style: 'twin-dagger-flurry',
      cooldown: 12,
      range: 78,
      arc: Math.PI * 0.68,
      damage: 25,
      knockback: 8,
      wave: false
    },
    visual: { color: '#58D5F6', swingWidth: 6 }
  },
  ring: {
    id: 'ring',
    name: '月轮刃',
    trait: '环刃回旋',
    attack: {
      style: 'ring-cleave',
      cooldown: 20,
      range: 108,
      arc: Math.PI * 1.05,
      damage: 36,
      knockback: 14,
      wave: true
    },
    visual: { color: '#F6C85F', swingWidth: 11 }
  },
  fan: {
    id: 'fan',
    name: '符箓折扇',
    trait: '符风封阵',
    attack: {
      style: 'talisman-fan-seal',
      cooldown: 24,
      range: 125,
      arc: Math.PI * 0.95,
      damage: 30,
      knockback: 18,
      wave: true
    },
    visual: { color: '#E85D75', swingWidth: 10 }
  }
};

export const WEAPON_UPGRADES = {
  sword: [
    {
      id: 'sword-flow',
      title: '流云剑步',
      school: '身法',
      tier: '轻灵',
      desc: '移动速度提升 12%，挥剑冷却更短。',
      effects: ['移动速度 +12%', '攻击冷却 -2 帧'],
      tactic: '适合边走位边清理灯影妖，容错更高。',
      focus: { label: '机动', value: 86 },
      apply: (player) => { player.speed *= 1.12; player.attackCooldownBonus += 2; }
    },
    {
      id: 'sword-wave',
      title: '青锋剑气',
      school: '剑气',
      tier: '破阵',
      desc: '剑气半径与伤害提升。',
      effects: ['剑气半径 +35%', '剑气伤害系数提高'],
      tactic: '适合隔雾消耗敌群，打断围攻节奏。',
      focus: { label: '远压', value: 78 },
      apply: (player) => { player.swordWaveBoost += 0.35; }
    },
    {
      id: 'sword-focus',
      title: '听风破影',
      school: '心法',
      tier: '爆发',
      desc: '伤害提升 20%，能量获取更快。',
      effects: ['全部伤害 +20%', '能量获取 +20%'],
      tactic: '适合快速攒满绝招，专门处理精英和守将。',
      focus: { label: '爆发', value: 84 },
      apply: (player) => { player.damageMult *= 1.2; player.energyGainMult *= 1.2; }
    }
  ],
  blade: [
    {
      id: 'blade-cleave',
      title: '横街断影',
      school: '刀势',
      tier: '横扫',
      desc: '刀势范围提升 20%。',
      effects: ['攻击范围 +20%', '更容易扫中侧翼敌人'],
      tactic: '适合纸人怪成群时开路，守灯点更稳。',
      focus: { label: '范围', value: 88 },
      apply: (player) => { player.rangeMult *= 1.2; }
    },
    {
      id: 'blade-impact',
      title: '重门开山',
      school: '重击',
      tier: '压制',
      desc: '刀击伤害和击退提升。',
      effects: ['全部伤害 +25%', '击退距离 +25%'],
      tactic: '适合把敌人推出身前，给自己争取站位。',
      focus: { label: '压制', value: 92 },
      apply: (player) => { player.damageMult *= 1.25; player.knockbackMult *= 1.25; }
    },
    {
      id: 'blade-blood',
      title: '赤灯回息',
      school: '续战',
      tier: '回气',
      desc: '击杀时有机会回复生命。',
      effects: ['击杀回血概率 +25%', '低血量时收益更明显'],
      tactic: '适合长时间清怪，减少被消耗到残血的风险。',
      focus: { label: '续航', value: 82 },
      apply: (player) => { player.vampRate += 0.25; }
    }
  ],
  spear: [
    {
      id: 'spear-dash',
      title: '游龙入阵',
      school: '枪步',
      tier: '突进',
      desc: '突进距离提升，穿刺更利落。',
      effects: ['突进距离 +45%', '更容易穿过阵线缺口'],
      tactic: '适合直取远处目标，也能从包围里脱身。',
      focus: { label: '位移', value: 90 },
      apply: (player) => { player.spearDashBoost += 0.45; }
    },
    {
      id: 'spear-pierce',
      title: '寒星贯雾',
      school: '枪锋',
      tier: '穿刺',
      desc: '穿刺伤害提升 22%。',
      effects: ['全部伤害 +22%', '单线目标处理更快'],
      tactic: '适合瞄准精英、护符和守将打高伤。',
      focus: { label: '穿透', value: 85 },
      apply: (player) => { player.damageMult *= 1.22; }
    },
    {
      id: 'spear-guard',
      title: '回马护身',
      school: '守势',
      tier: '护体',
      desc: '最大生命提升并回复一截气血。',
      effects: ['最大生命 +35', '立即回复最多 45 点生命'],
      tactic: '适合进入后两关前补强容错。',
      focus: { label: '生存', value: 80 },
      apply: (player) => { player.maxHp += 35; player.hp = Math.min(player.maxHp, player.hp + 45); }
    }
  ],
  daggers: [
    {
      id: 'daggers-shadow-step',
      title: '月影贴身',
      school: '身法',
      tier: '连闪',
      desc: '移动更快，短兵贴身更顺。',
      effects: ['移动速度 +14%', '攻击冷却 -2 帧'],
      tactic: '适合绕到妖影侧面，用短间隔连续压制。',
      focus: { label: '机动', value: 92 },
      apply: (player) => { player.speed *= 1.14; player.attackCooldownBonus += 2; }
    },
    {
      id: 'daggers-cut-line',
      title: '双月割雾',
      school: '匕势',
      tier: '破绽',
      desc: '匕首伤害提升，能量回复更快。',
      effects: ['全部伤害 +18%', '能量获取 +18%'],
      tactic: '适合快速攒绝招，处理落单精英。',
      focus: { label: '爆发', value: 86 },
      apply: (player) => { player.damageMult *= 1.18; player.energyGainMult *= 1.18; }
    },
    {
      id: 'daggers-blood-thread',
      title: '回锋续息',
      school: '续战',
      tier: '回气',
      desc: '击杀后更容易回血。',
      effects: ['击杀回血概率 +22%', '最大生命 +12'],
      tactic: '适合贴身风险高时保持血线。',
      focus: { label: '续航', value: 78 },
      apply: (player) => { player.vampRate += 0.22; player.maxHp += 12; player.hp = Math.min(player.maxHp, player.hp + 12); }
    }
  ],
  ring: [
    {
      id: 'ring-wide-moon',
      title: '满月回旋',
      school: '轮刃',
      tier: '回旋',
      desc: '月轮范围扩大，更容易扫到侧翼。',
      effects: ['攻击范围 +18%', '剑气强化 +20%'],
      tactic: '适合在灯阵附近清理围上来的妖影。',
      focus: { label: '范围', value: 90 },
      apply: (player) => { player.rangeMult *= 1.18; player.swordWaveBoost += 0.2; }
    },
    {
      id: 'ring-jade-edge',
      title: '玉魄开锋',
      school: '锋芒',
      tier: '破甲',
      desc: '月轮伤害和击退同步提升。',
      effects: ['全部伤害 +20%', '击退距离 +15%'],
      tactic: '适合把敌人推离自己，保持环刃距离。',
      focus: { label: '压制', value: 84 },
      apply: (player) => { player.damageMult *= 1.2; player.knockbackMult *= 1.15; }
    },
    {
      id: 'ring-lunar-flow',
      title: '环月流光',
      school: '心法',
      tier: '蓄势',
      desc: '能量获取提升，冷却略短。',
      effects: ['能量获取 +28%', '攻击冷却 -1 帧'],
      tactic: '适合频繁释放绝招打断终局压力。',
      focus: { label: '蓄能', value: 88 },
      apply: (player) => { player.energyGainMult *= 1.28; player.attackCooldownBonus += 1; }
    }
  ],
  fan: [
    {
      id: 'fan-seal-wind',
      title: '符风定影',
      school: '符法',
      tier: '封阵',
      desc: '符风范围扩大，击退更明显。',
      effects: ['攻击范围 +16%', '击退距离 +20%'],
      tactic: '适合拉开距离，守住古井和城楼入口。',
      focus: { label: '控制', value: 89 },
      apply: (player) => { player.rangeMult *= 1.16; player.knockbackMult *= 1.2; }
    },
    {
      id: 'fan-red-seal',
      title: '赤符照夜',
      school: '咒印',
      tier: '破邪',
      desc: '符箓伤害和剑气强度提升。',
      effects: ['全部伤害 +16%', '剑气强化 +25%'],
      tactic: '适合隔着妖雾用符风清线。',
      focus: { label: '远压', value: 86 },
      apply: (player) => { player.damageMult *= 1.16; player.swordWaveBoost += 0.25; }
    },
    {
      id: 'fan-paper-guard',
      title: '纸阵护身',
      school: '守势',
      tier: '护体',
      desc: '提升生命上限并立即回复。',
      effects: ['最大生命 +30', '立即回复最多 35 点生命'],
      tactic: '适合稳健打法，减少远程站位失误成本。',
      focus: { label: '生存', value: 82 },
      apply: (player) => { player.maxHp += 30; player.hp = Math.min(player.maxHp, player.hp + 35); }
    }
  ]
};

function createDerivedUpgradePool(weaponId, level, label) {
  return WEAPON_UPGRADES[weaponId].map((upgrade) => ({
    ...upgrade,
    id: `${upgrade.id}-l${level}`,
    title: `${upgrade.title}${label}`,
    tier: label
  }));
}

export const WEAPON_LEVEL_UPGRADES = {
  sword: {
    2: WEAPON_UPGRADES.sword,
    3: [
      {
        id: 'sword-moon-step',
        title: '月影连步',
        school: '身法',
        tier: '进阶',
        desc: '进一步缩短挥剑间隔，移动时更容易保持输出。',
        effects: ['攻击冷却 -3 帧', '移动速度 +8%'],
        tactic: '适合在古井回声阵里绕开波纹，同时持续削血。',
        focus: { label: '连击', value: 88 },
        apply: (player) => { player.attackCooldownBonus += 3; player.speed *= 1.08; }
      },
      {
        id: 'sword-river-wave',
        title: '长河剑澜',
        school: '剑气',
        tier: '进阶',
        desc: '剑气变得更厚，命中敌群时伤害更稳定。',
        effects: ['剑气强化 +45%', '攻击范围 +10%'],
        tactic: '适合用剑气清掉直线追击的妖雾。',
        focus: { label: '清场', value: 86 },
        apply: (player) => { player.swordWaveBoost += 0.45; player.rangeMult *= 1.1; }
      },
      {
        id: 'sword-heart-spark',
        title: '照夜心灯',
        school: '心法',
        tier: '进阶',
        desc: '伤害与能量获取同步提升，更快进入绝招节奏。',
        effects: ['全部伤害 +18%', '能量获取 +30%'],
        tactic: '适合准备挑战守将前提前攒满能量。',
        focus: { label: '蓄势', value: 90 },
        apply: (player) => { player.damageMult *= 1.18; player.energyGainMult *= 1.3; }
      }
    ],
    4: [
      {
        id: 'sword-sky-cleave',
        title: '天门开剑',
        school: '终式',
        tier: '绝学',
        desc: '剑招全面升华，伤害、剑气与范围同时提升。',
        effects: ['全部伤害 +25%', '剑气强化 +30%', '攻击范围 +12%'],
        tactic: '适合最终城楼战，兼顾清怪和打守将。',
        focus: { label: '终局', value: 96 },
        apply: (player) => { player.damageMult *= 1.25; player.swordWaveBoost += 0.3; player.rangeMult *= 1.12; }
      },
      {
        id: 'sword-starfall',
        title: '星落破影',
        school: '爆发',
        tier: '绝学',
        desc: '牺牲部分稳健性，换取更强的斩杀效率。',
        effects: ['全部伤害 +35%', '攻击冷却 -1 帧'],
        tactic: '适合熟练玩家快速处理精英和 Boss。',
        focus: { label: '斩杀', value: 98 },
        apply: (player) => { player.damageMult *= 1.35; player.attackCooldownBonus += 1; }
      },
      {
        id: 'sword-wind-wall',
        title: '风墙护身',
        school: '守势',
        tier: '绝学',
        desc: '用剑势护体，提升生命并强化续战能力。',
        effects: ['最大生命 +25', '击杀回血概率 +12%'],
        tactic: '适合低血量进入终局时补容错。',
        focus: { label: '容错', value: 84 },
        apply: (player) => { player.maxHp += 25; player.hp = Math.min(player.maxHp, player.hp + 25); player.vampRate += 0.12; }
      }
    ]
  },
  blade: {
    2: WEAPON_UPGRADES.blade,
    3: [
      {
        id: 'blade-market-storm',
        title: '市声卷刃',
        school: '刀势',
        tier: '进阶',
        desc: '刀势扩大，贴身敌人更难越过你的正面。',
        effects: ['攻击范围 +18%', '击退距离 +10%'],
        tactic: '适合在狭窄街巷守住灯位。',
        focus: { label: '控场', value: 88 },
        apply: (player) => { player.rangeMult *= 1.18; player.knockbackMult *= 1.1; }
      },
      {
        id: 'blade-gate-breaker',
        title: '重楼裂门',
        school: '重击',
        tier: '进阶',
        desc: '重刀更狠，击中后把敌人推得更远。',
        effects: ['全部伤害 +20%', '击退距离 +35%'],
        tactic: '适合把精英怪打离自己，避免被贴脸围住。',
        focus: { label: '压退', value: 94 },
        apply: (player) => { player.damageMult *= 1.2; player.knockbackMult *= 1.35; }
      },
      {
        id: 'blade-lantern-breath',
        title: '赤灯长息',
        school: '续战',
        tier: '进阶',
        desc: '击杀回血更可靠，生命上限也提高。',
        effects: ['击杀回血概率 +18%', '最大生命 +20'],
        tactic: '适合连续清怪，不频繁退出战线。',
        focus: { label: '续航', value: 90 },
        apply: (player) => { player.vampRate += 0.18; player.maxHp += 20; player.hp = Math.min(player.maxHp, player.hp + 20); }
      }
    ],
    4: [
      {
        id: 'blade-mountain-split',
        title: '开山断雾',
        school: '终式',
        tier: '绝学',
        desc: '刀势、伤害和击退同时达到终局强度。',
        effects: ['全部伤害 +28%', '攻击范围 +15%', '击退距离 +20%'],
        tactic: '适合最终阶段硬压 Boss 身边的小怪。',
        focus: { label: '破阵', value: 97 },
        apply: (player) => { player.damageMult *= 1.28; player.rangeMult *= 1.15; player.knockbackMult *= 1.2; }
      },
      {
        id: 'blade-blood-river',
        title: '赤河回锋',
        school: '续战',
        tier: '绝学',
        desc: '击杀恢复大幅强化，越打越稳。',
        effects: ['击杀回血概率 +35%', '最大生命 +30'],
        tactic: '适合血线压力大的终局混战。',
        focus: { label: '不倒', value: 95 },
        apply: (player) => { player.vampRate += 0.35; player.maxHp += 30; player.hp = Math.min(player.maxHp, player.hp + 35); }
      },
      {
        id: 'blade-thunder-cut',
        title: '惊雷快斩',
        school: '快刀',
        tier: '绝学',
        desc: '重刀变快，降低大开大合后的空窗。',
        effects: ['攻击冷却 -5 帧', '移动速度 +8%'],
        tactic: '适合想用刀打出更高操作频率的玩家。',
        focus: { label: '节奏', value: 89 },
        apply: (player) => { player.attackCooldownBonus += 5; player.speed *= 1.08; }
      }
    ]
  },
  spear: {
    2: WEAPON_UPGRADES.spear,
    3: [
      {
        id: 'spear-dragon-turn',
        title: '游龙折阵',
        school: '枪步',
        tier: '进阶',
        desc: '突进更远，出枪后更容易重新拉开距离。',
        effects: ['突进距离 +35%', '移动速度 +10%'],
        tactic: '适合古井和城楼间频繁调整站位。',
        focus: { label: '游击', value: 92 },
        apply: (player) => { player.spearDashBoost += 0.35; player.speed *= 1.1; }
      },
      {
        id: 'spear-frost-line',
        title: '霜线贯影',
        school: '枪锋',
        tier: '进阶',
        desc: '穿刺伤害提升，并略微扩大判定距离。',
        effects: ['全部伤害 +18%', '攻击范围 +12%'],
        tactic: '适合沿直线点杀护符和精英。',
        focus: { label: '点杀', value: 87 },
        apply: (player) => { player.damageMult *= 1.18; player.rangeMult *= 1.12; }
      },
      {
        id: 'spear-back-guard',
        title: '回马定魂',
        school: '守势',
        tier: '进阶',
        desc: '生命提高，同时补充一截气血。',
        effects: ['最大生命 +45', '立即回复最多 55 点生命'],
        tactic: '适合突进失误较多时补足容错。',
        focus: { label: '护体', value: 86 },
        apply: (player) => { player.maxHp += 45; player.hp = Math.min(player.maxHp, player.hp + 55); }
      }
    ],
    4: [
      {
        id: 'spear-sky-dragon',
        title: '天龙破阵',
        school: '终式',
        tier: '绝学',
        desc: '突进、伤害和范围全面提升，适合终局冲阵。',
        effects: ['突进距离 +50%', '全部伤害 +20%', '攻击范围 +10%'],
        tactic: '适合直穿妖雾阵型，快速触达守将。',
        focus: { label: '冲阵', value: 98 },
        apply: (player) => { player.spearDashBoost += 0.5; player.damageMult *= 1.2; player.rangeMult *= 1.1; }
      },
      {
        id: 'spear-cold-star',
        title: '寒星一线',
        school: '爆发',
        tier: '绝学',
        desc: '把枪锋集中到一点，单体处理能力大幅提升。',
        effects: ['全部伤害 +32%', '能量获取 +15%'],
        tactic: '适合最终 Boss 和厚血精英。',
        focus: { label: '单挑', value: 96 },
        apply: (player) => { player.damageMult *= 1.32; player.energyGainMult *= 1.15; }
      },
      {
        id: 'spear-cloud-guard',
        title: '云门护枪',
        school: '守势',
        tier: '绝学',
        desc: '终局护体法，生命、回血和走位容错同步提高。',
        effects: ['最大生命 +30', '击杀回血概率 +15%', '移动速度 +6%'],
        tactic: '适合稳扎稳打完成城楼终战。',
        focus: { label: '稳守', value: 88 },
        apply: (player) => { player.maxHp += 30; player.hp = Math.min(player.maxHp, player.hp + 30); player.vampRate += 0.15; player.speed *= 1.06; }
      }
    ]
  },
  daggers: {
    2: WEAPON_UPGRADES.daggers,
    3: createDerivedUpgradePool('daggers', 3, '进阶'),
    4: createDerivedUpgradePool('daggers', 4, '绝学')
  },
  ring: {
    2: WEAPON_UPGRADES.ring,
    3: createDerivedUpgradePool('ring', 3, '进阶'),
    4: createDerivedUpgradePool('ring', 4, '绝学')
  },
  fan: {
    2: WEAPON_UPGRADES.fan,
    3: createDerivedUpgradePool('fan', 3, '进阶'),
    4: createDerivedUpgradePool('fan', 4, '绝学')
  }
};

export function getWeaponDefinition(weaponId) {
  return WEAPONS[weaponId] ?? WEAPONS.sword;
}

export function getWeaponUpgrades(weaponId, level = 2) {
  const weapon = getWeaponDefinition(weaponId).id;
  const levelMap = WEAPON_LEVEL_UPGRADES[weapon];
  const availableLevels = Object.keys(levelMap).map(Number).sort((a, b) => a - b);
  const selectedLevel = availableLevels.reduce((best, candidate) => (
    candidate <= level ? candidate : best
  ), availableLevels[0]);
  return levelMap[selectedLevel];
}
