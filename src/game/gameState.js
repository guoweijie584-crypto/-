import { getWeaponDefinition } from './weapons.js';
import { SUZHOU_CITY_MAP, getStageObjectivePoints } from './cityMap.js';
import { STAGE_IDS, createStageProgress } from './stages.js';

export const MAP_SIZE = 4000;

export const UPGRADES = [
  { title: '无锋之刃', desc: '全伤害提升 30%', apply: (player) => { player.damageMult *= 1.3; } },
  { title: '极意斩击', desc: '攻击范围增加 25%', apply: (player) => { player.rangeMult *= 1.25; } },
  { title: '雷霆步伐', desc: '移动速度提升 15%', apply: (player) => { player.speed *= 1.15; } },
  { title: '气血充盈', desc: '最大生命值 +50，并回满血', apply: (player) => { player.maxHp += 50; player.hp = player.maxHp; } },
  { title: '炫彩剑波', desc: '挥砍附加一道穿透的彩色剑气', apply: (player) => { player.hasSwordWave = true; } },
  { title: '嗜血本能', desc: '击杀敌人时有 20% 几率回血', apply: (player) => { player.vampRate += 0.2; } },
  { title: '爆裂投掷', desc: '投掷武器落地时引发大范围爆炸', apply: (player) => { player.explosiveThrow = true; } }
];

export function createInitialGameState(initial = {}) {
  const selectedWeapon = getWeaponDefinition(initial.selectedWeapon).id;
  return {
    gameState: 'playing',
    selectedWeapon,
    weapon: getWeaponDefinition(selectedWeapon),
    currentStageIndex: 0,
    currentStageId: STAGE_IDS[0],
    stageStatus: STAGE_IDS.map((id) => ({ id, complete: false })),
    objectives: {
      progress: createStageProgress(STAGE_IDS[0]),
      lamps: createLamps(),
      echoFragments: [],
      echoWaves: [],
      talismans: []
    },
    kills: 0,
    gameTime: 0,
    spawnTimer: 0,
    screenShake: 0,
    camera: { x: 0, y: 0 },
    terrain: { cityMap: SUZHOU_CITY_MAP, decorations: createTerrain() },
    player: createPlayer(),
    boss: null,
    runSummary: null,
    pendingUpgrades: [],
    runStats: {
      selectedWeapon,
      selectedUpgrades: [],
      damageTaken: 0,
      stages: [],
      echoFragments: 0,
      bossPhaseReached: 0
    },
    enemies: [],
    droppedWeapons: [],
    projectiles: [],
    particles: [],
    damageTexts: []
  };
}

export function createLamps() {
  return getStageObjectivePoints('lamps').map((lamp) => ({ ...lamp, lit: false }));
}

export function createEchoFragments() {
  return getStageObjectivePoints('echo-fragments').map((fragment) => ({ ...fragment, collected: false }));
}

export function createTalismans() {
  return getStageObjectivePoints('talismans').map((talisman) => ({ ...talisman, hp: 60, maxHp: 60, broken: false }));
}

export function createPlayer() {
  return {
    x: 835,
    y: -1110,
    radius: 22,
    speed: 4.5,
    hp: 100,
    maxHp: 100,
    level: 1,
    exp: 0,
    maxExp: 100,
    energy: 0,
    maxEnergy: 100,
    hasWeapon: true,
    weaponLevel: 1,
    damageMult: 1,
    rangeMult: 1,
    attackTimer: 0,
    attackCooldown: 20,
    attackCooldownBonus: 0,
    isSwingAnimating: false,
    swingStart: 0,
    swingEnd: 0,
    swingTimer: 0,
    colorHue: 0,
    hasSwordWave: false,
    swordWaveBoost: 0,
    spearDashBoost: 0,
    knockbackMult: 1,
    energyGainMult: 1,
    explosiveThrow: false,
    vampRate: 0
  };
}

export function createTerrain() {
  const decorations = [];

  for (let i = 0; i < 120; i += 1) {
    decorations.push({
      x: (Math.random() - 0.5) * MAP_SIZE,
      y: (Math.random() - 0.5) * MAP_SIZE,
      type: Math.random() > 0.3 ? 'grass' : 'flower',
      color: Math.random() > 0.5 ? '#C9493D' : '#D7A84B'
    });
  }

  return decorations;
}
