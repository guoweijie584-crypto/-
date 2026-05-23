import { distance } from './effects.js';

export const BOSS_ID = 'mist-armor-general';
export const BOSS_TITLE = '雾甲守将';

export function createBoss(position = { x: 0, y: -260 }) {
  const hp = 620;
  return {
    active: true,
    defeated: false,
    id: BOSS_ID,
    title: BOSS_TITLE,
    phase: 1,
    hp,
    maxHp: hp,
    enemyRef: null,
    telegraph: null,
    attackTimer: 90,
    summonTimer: 220
  };
}

export function createBossEnemy(boss, position = { x: 0, y: -260 }) {
  return {
    x: position.x,
    y: position.y,
    type: BOSS_ID,
    name: BOSS_TITLE,
    hp: boss.hp,
    maxHp: boss.maxHp,
    speed: 2.2,
    radius: 46,
    expValue: 0,
    hitCooldown: 0,
    behavior: 'boss',
    damage: 18,
    targetAngle: 0,
    seed: Math.random()
  };
}

export function isBossEnemy(enemy) {
  return enemy?.type === BOSS_ID;
}

export function syncBossFromEnemy(boss, enemy) {
  if (!boss || !enemy) return;
  boss.hp = Math.max(0, enemy.hp);
  boss.phase = boss.hp <= boss.maxHp / 2 ? 2 : 1;
}

export function getBossSnapshot(boss) {
  if (!boss) {
    return { active: false, phase: 0, hp: 0, maxHp: 0, title: BOSS_TITLE };
  }
  return {
    active: boss.active,
    phase: boss.phase,
    hp: Math.max(0, Math.ceil(boss.hp)),
    maxHp: boss.maxHp,
    title: boss.title
  };
}

export function updateBoss(boss, enemy, state, helpers) {
  if (!boss?.active || !enemy) return;
  const { player } = state;
  syncBossFromEnemy(boss, enemy);
  state.runStats.bossPhaseReached = Math.max(state.runStats.bossPhaseReached, boss.phase);

  if (boss.phase === 2 && !boss.phaseAnnounced) {
    boss.phaseAnnounced = true;
    helpers.spawnText(enemy.x, enemy.y - 70, '雾甲觉醒', '#C9493D', 22);
  }

  boss.attackTimer -= 1;
  boss.summonTimer -= 1;

  if (boss.telegraph) {
    boss.telegraph.timer -= 1;
    if (boss.telegraph.timer <= 0) {
      resolveTelegraph(boss.telegraph, enemy, state, helpers);
      boss.telegraph = null;
    }
    return;
  }

  const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
  const idealDistance = boss.phase === 1 ? 180 : 140;
  const d = distance(enemy.x, enemy.y, player.x, player.y);
  if (d > idealDistance) {
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;
  }

  if (boss.attackTimer <= 0) {
    boss.attackTimer = boss.phase === 1 ? 105 : 82;
    boss.telegraph = Math.random() < 0.52
      ? { type: 'charge', angle, timer: 32, range: 280 }
      : { type: 'slash', angle, timer: 28, radius: boss.phase === 1 ? 145 : 185 };
  }

  if (boss.phase === 2 && boss.summonTimer <= 0) {
    boss.summonTimer = 260;
    helpers.summonPaperDolls(enemy.x, enemy.y);
  }
}

function resolveTelegraph(telegraph, enemy, state, helpers) {
  const { player } = state;
  if (telegraph.type === 'charge') {
    enemy.x += Math.cos(telegraph.angle) * telegraph.range;
    enemy.y += Math.sin(telegraph.angle) * telegraph.range;
    if (distance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius + 28) {
      helpers.hurtPlayer(telegraph.range > 260 ? 18 : 14);
    }
    helpers.spawnParticles(enemy.x, enemy.y, '#C9493D', 20, 8);
  }

  if (telegraph.type === 'slash') {
    if (distance(enemy.x, enemy.y, player.x, player.y) < telegraph.radius + player.radius) {
      helpers.hurtPlayer(telegraph.radius > 160 ? 20 : 15);
    }
    helpers.spawnParticles(enemy.x, enemy.y, '#D7A84B', 24, 8);
  }
}
