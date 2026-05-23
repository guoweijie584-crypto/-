export const PLAYER_ACTIONS = ['idle', 'run', 'attack-sword', 'attack-blade', 'attack-spear', 'hit', 'death'];

export const ENEMY_ACTIONS = ['idle', 'move', 'attack', 'hit', 'death'];

export const VISUAL_ASSET_MANIFEST = {
  player: {
    id: 'night-patrol-hero',
    label: '漫画巡夜少侠',
    style: 'anime comic wuxia hero, cel-shaded H5 sprite',
    actions: PLAYER_ACTIONS,
    sprite: {
      src: '/assets/characters/warrior-isometric-idle.png',
      frameWidth: 128,
      frameHeight: 160,
      directions: 4,
      actions: {
        idle: { row: 0, frames: 4, fps: 6 },
        run: { row: 0, frames: 4, fps: 8 },
        'attack-sword': { row: 0, frames: 4, fps: 10 },
        'attack-blade': { row: 0, frames: 4, fps: 10 },
        'attack-spear': { row: 0, frames: 4, fps: 10 },
        hit: { row: 0, frames: 4, fps: 8 },
        death: { row: 0, frames: 4, fps: 6 }
      }
    },
    fallback: {
      mode: 'anime-comic-canvas',
      palette: {
        ink: '#151318',
        hair: '#24202C',
        hairHighlight: '#6A4C93',
        coat: '#2E6F95',
        coatShadow: '#153243',
        scarf: '#E85D75',
        trim: '#F6C85F',
        skin: '#F1C6A8',
        blush: '#F58AA7',
        eye: '#58D5F6',
        highlight: '#FFF7E8'
      }
    }
  },
  enemies: {
    'lamp-shadow': {
      id: 'lamp-shadow',
      label: '灯影妖',
      silhouette: 'lantern-wraith',
      actions: ENEMY_ACTIONS,
      sprite: {
        src: '/assets/enemies/horror-fantasy-spritesheet.png',
        frameWidth: 32,
        frameHeight: 32,
        sx: 0,
        sy: 0,
        frames: 1
      },
      fallback: {
        palette: { body: '#2b2113', accent: '#D7A84B', glow: '#f4c15b', shadow: '#101613' },
        scale: 1
      }
    },
    'paper-doll': {
      id: 'paper-doll',
      label: '纸人怪',
      silhouette: 'paper-puppet',
      actions: ENEMY_ACTIONS,
      sprite: {
        src: '/assets/enemies/horror-fantasy-spritesheet.png',
        frameWidth: 32,
        frameHeight: 32,
        sx: 32,
        sy: 0,
        frames: 1
      },
      fallback: {
        palette: { body: '#f4efe0', accent: '#C9493D', glow: '#f2d3c6', shadow: '#30231f' },
        scale: 0.95
      }
    },
    'well-shadow': {
      id: 'well-shadow',
      label: '井影',
      silhouette: 'water-spirit',
      actions: ENEMY_ACTIONS,
      sprite: {
        src: '/assets/enemies/ghost-monster.png',
        frameWidth: 32,
        frameHeight: 32,
        frames: 6
      },
      fallback: {
        palette: { body: '#203836', accent: '#54C6B2', glow: '#91e5d6', shadow: '#101613' },
        scale: 1.1
      }
    },
    'mist-armor-general': {
      id: 'mist-armor-general',
      label: '雾甲守将',
      silhouette: 'armored-boss',
      actions: ENEMY_ACTIONS,
      sprite: null,
      fallback: {
        palette: { body: '#25342C', accent: '#C9493D', glow: '#D7A84B', shadow: '#101613' },
        scale: 1.45
      }
    }
  },
  weapons: {
    sword: {
      id: 'sword',
      label: '青锋剑',
      silhouette: 'straight-sword',
      material: 'polished steel, brass guard, dark leather grip',
      actions: ['slash', 'wave', 'throw'],
      fallback: { palette: { metal: '#f7f1d2', edge: '#b8c7c2', guard: '#D7A84B', grip: '#342018', glow: '#54C6B2' } }
    },
    blade: {
      id: 'blade',
      label: '雁翎刀',
      silhouette: 'curved-blade',
      material: 'curved steel, brass spine, red tassel',
      actions: ['cleave', 'throw'],
      fallback: { palette: { metal: '#f1f5eb', edge: '#9aa7a2', guard: '#D7A84B', grip: '#342018', glow: '#D7A84B' } }
    },
    spear: {
      id: 'spear',
      label: '寒星枪',
      silhouette: 'long-spear',
      material: 'lacquered wood shaft, steel spearhead, red tassel',
      actions: ['thrust', 'dash', 'throw'],
      fallback: { palette: { metal: '#f4efe0', edge: '#9ca9a4', shaft: '#6f4424', tassel: '#C9493D', glow: '#f4efe0' } }
    },
    daggers: {
      id: 'daggers',
      label: '双月匕',
      silhouette: 'twin-daggers',
      material: 'short crescent steel, wrapped black grips, cyan charm cords',
      actions: ['orbit', 'flash'],
      fallback: { palette: { metal: '#EAF7FF', edge: '#8DD7F7', guard: '#54C6B2', grip: '#1A2630', glow: '#58D5F6' } }
    },
    ring: {
      id: 'ring',
      label: '月轮刃',
      silhouette: 'ring-blade',
      material: 'gold-edged circular blade with inner jade glow',
      actions: ['orbit', 'slice'],
      fallback: { palette: { metal: '#F9E7B0', edge: '#FFF7D1', guard: '#D7A84B', grip: '#36534C', glow: '#F6C85F' } }
    },
    fan: {
      id: 'fan',
      label: '符箓折扇',
      silhouette: 'talisman-fan',
      material: 'painted paper fan ribs, red talisman seal, brass pivot',
      actions: ['orbit', 'seal'],
      fallback: { palette: { paper: '#FFF7E8', ink: '#25342C', seal: '#C9493D', guard: '#D7A84B', glow: '#E85D75' } }
    }
  },
  sceneProps: {
    residence: { label: '白墙黑瓦民居', fallback: { palette: { wall: '#e7dec8', roof: '#222823', edge: '#101613' } } },
    wall: { label: '古城墙段', fallback: { palette: { stone: '#4b493d', top: '#272b25', trim: '#D7A84B' } } },
    bridge: { label: '石拱桥', fallback: { palette: { stone: '#8b7a58', edge: '#D7A84B', shadow: '#2b302a' } } },
    lantern: { label: '街巷灯笼', fallback: { palette: { pole: '#101613', light: '#D7A84B', silk: '#C9493D' } } },
    boat: { label: '河埠小舟', fallback: { palette: { hull: '#6f4424', trim: '#D7A84B', cloth: '#f4efe0' } } },
    willow: { label: '水巷垂柳', fallback: { palette: { trunk: '#4d3324', leaf: '#54C6B2', dark: '#2f5b3a' } } }
  },
  effects: {
    swordWave: { label: '半写实剑气', fallback: { palette: { core: '#f4efe0', glow: '#54C6B2' } } },
    slashArc: { label: '建模感挥砍轨迹', fallback: { palette: { core: '#f4efe0', glow: '#D7A84B' } } },
    ultimateLine: { label: '瞬狱影杀阵残影', fallback: { palette: { core: '#54C6B2', secondary: '#D7A84B' } } }
  }
};

export function getPlayerVisual() {
  return VISUAL_ASSET_MANIFEST.player;
}

export function getEnemyVisual(enemyType) {
  return VISUAL_ASSET_MANIFEST.enemies[enemyType] ?? VISUAL_ASSET_MANIFEST.enemies['lamp-shadow'];
}

export function getWeaponVisual(weaponId) {
  return VISUAL_ASSET_MANIFEST.weapons[weaponId] ?? VISUAL_ASSET_MANIFEST.weapons.sword;
}

export function getScenePropVisual(propId) {
  return VISUAL_ASSET_MANIFEST.sceneProps[propId] ?? VISUAL_ASSET_MANIFEST.sceneProps.residence;
}

export function getEffectVisual(effectId) {
  return VISUAL_ASSET_MANIFEST.effects[effectId] ?? VISUAL_ASSET_MANIFEST.effects.slashArc;
}

export function getPlayerAction(player, selectedWeapon = 'sword', inputVector = { x: 0, y: 0 }) {
  if (player.hp <= 0) return 'death';
  if (player.hitFlash > 0) return 'hit';
  if (player.isSwingAnimating) return `attack-${selectedWeapon}`;
  if (Math.abs(inputVector.x) + Math.abs(inputVector.y) > 0) return 'run';
  return 'idle';
}

export function validateVisualAssetManifest(manifest = VISUAL_ASSET_MANIFEST) {
  const issues = [];
  const requiredPlayerActions = PLAYER_ACTIONS;
  const requiredEnemyActions = ENEMY_ACTIONS;

  requiredPlayerActions.forEach((action) => {
    if (!manifest.player.actions.includes(action)) {
      issues.push(`player missing action: ${action}`);
    }
  });

  Object.entries(manifest.enemies).forEach(([enemyId, visual]) => {
    requiredEnemyActions.forEach((action) => {
      if (!visual.actions.includes(action)) {
        issues.push(`${enemyId} missing action: ${action}`);
      }
    });
    if (!visual.sprite && !visual.fallback) {
      issues.push(`${enemyId} missing sprite or fallback`);
    }
  });

  ['sword', 'blade', 'spear', 'daggers', 'ring', 'fan'].forEach((weaponId) => {
    if (!manifest.weapons[weaponId]?.fallback) {
      issues.push(`${weaponId} missing modeled weapon fallback`);
    }
  });

  return issues;
}
