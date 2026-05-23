import { getWeaponDefinition } from './weapons.js';
import { SUZHOU_CITY_MAP, getStageObjectivePoints } from './cityMap.js';
import { STAGE_IDS, createStageProgress } from './stages.js';
import { createBossEnemy } from './boss.js';

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

export function createLamps(pointsKey = 'lamps') {
  return getStageObjectivePoints(pointsKey).map((lamp) => ({ ...lamp, lit: false }));
}

export function createEchoFragments(pointsKey = 'echo-fragments') {
  return getStageObjectivePoints(pointsKey).map((fragment) => ({ ...fragment, collected: false }));
}

export function createTalismans(pointsKey = 'talismans') {
  return getStageObjectivePoints(pointsKey).map((talisman) => ({ ...talisman, hp: 60, maxHp: 60, broken: false }));
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
  return [];
}

export const SAVE_VERSION = 1;

export function serializeGameState(state) {
  return {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    gameState: state.gameState,
    selectedWeapon: state.selectedWeapon,
    currentStageIndex: state.currentStageIndex,
    currentStageId: state.currentStageId,
    stageStatus: state.stageStatus.map((entry) => ({ ...entry })),
    objectives: {
      progress: { ...state.objectives.progress },
      lamps: state.objectives.lamps.map((lamp) => ({ ...lamp })),
      echoFragments: state.objectives.echoFragments.map((fragment) => ({ ...fragment })),
      talismans: state.objectives.talismans.map((talisman) => ({ ...talisman }))
    },
    kills: state.kills,
    gameTime: state.gameTime,
    camera: { ...state.camera },
    player: { ...state.player },
    boss: state.boss
      ? {
          active: state.boss.active,
          defeated: state.boss.defeated,
          phase: state.boss.phase,
          hp: state.boss.hp,
          maxHp: state.boss.maxHp
        }
      : null,
    runStats: {
      ...state.runStats,
      selectedUpgrades: state.runStats.selectedUpgrades.map((upgrade) => ({ ...upgrade })),
      stages: state.runStats.stages.map((stage) => ({ ...stage }))
    }
  };
}

export function applySavedState(state, save) {
  if (!save || save.version !== SAVE_VERSION) return false;

  const fresh = createInitialGameState({ selectedWeapon: save.selectedWeapon });
  Object.assign(state, fresh);

  state.gameState = save.gameState === 'gameover' ? 'playing' : save.gameState ?? 'playing';
  state.selectedWeapon = save.selectedWeapon;
  state.weapon = getWeaponDefinition(save.selectedWeapon);
  state.currentStageIndex = save.currentStageIndex ?? 0;
  state.currentStageId = save.currentStageId ?? STAGE_IDS[0];
  state.stageStatus = save.stageStatus ?? state.stageStatus;
  state.objectives.progress = { ...state.objectives.progress, ...save.objectives.progress };
  if (save.objectives.lamps?.length) state.objectives.lamps = save.objectives.lamps.map((lamp) => ({ ...lamp }));
  if (save.objectives.echoFragments?.length) state.objectives.echoFragments = save.objectives.echoFragments.map((fragment) => ({ ...fragment }));
  if (save.objectives.talismans?.length) state.objectives.talismans = save.objectives.talismans.map((talisman) => ({ ...talisman }));
  state.objectives.echoWaves = [];
  state.kills = save.kills ?? 0;
  state.gameTime = save.gameTime ?? 0;
  state.camera = { ...save.camera };
  state.player = { ...state.player, ...save.player };
  state.runStats = {
    ...state.runStats,
    ...save.runStats,
    selectedUpgrades: save.runStats?.selectedUpgrades?.map((upgrade) => ({ ...upgrade })) ?? [],
    stages: save.runStats?.stages?.map((stage) => ({ ...stage })) ?? []
  };

  if (save.boss?.active && !save.boss.defeated) {
    state.boss = {
      active: true,
      defeated: false,
      id: 'mist-armor-general',
      title: '雾甲守将',
      phase: save.boss.phase ?? 1,
      hp: save.boss.hp,
      maxHp: save.boss.maxHp,
      enemyRef: null,
      telegraph: null,
      attackTimer: 90,
      summonTimer: 220
    };
    const bossEnemy = createBossEnemy(state.boss, { x: state.player.x, y: state.player.y - 240 });
    bossEnemy.hp = save.boss.hp;
    bossEnemy.maxHp = save.boss.maxHp;
    state.boss.enemyRef = bossEnemy;
    state.enemies = [bossEnemy];
    state.gameState = 'boss';
  } else {
    state.boss = null;
    state.enemies = [];
  }

  state.pendingUpgrades = [];
  state.droppedWeapons = [];
  state.projectiles = [];
  state.particles = [];
  state.damageTexts = [];
  state.spawnTimer = 0;
  state.screenShake = 0;
  state.runSummary = null;
  return true;
}
