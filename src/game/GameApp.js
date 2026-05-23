import { distance, spawnParticles, spawnText } from './effects.js';
import { createBoss, createBossEnemy, getBossSnapshot, isBossEnemy, syncBossFromEnemy, updateBoss } from './boss.js';
import { createEnemy } from './enemies.js';
import { applySavedState, createEchoFragments, createInitialGameState, createLamps, createTalismans, serializeGameState } from './gameState.js';
import {
  clampToCityBounds,
  getPassableSpawnPoint,
  isBlockedCircle,
  isSegmentBlocked,
  moveCircleWithCollisions,
  resolveBlockedCircle
} from './cityMap.js';
import { createInputController } from './input.js';
import { onEnemySpritesReady, onPlayerSpriteReady, render } from './rendering.js';
import { createRunSummary } from './runSummary.js';
import { STAGES, createStageProgress, getStageDefinition, getStageSnapshot } from './stages.js';
import { getWeaponDefinition, getWeaponUpgrades } from './weapons.js';
import { createSoundController } from './audio.js';

export function mountGame(container, options = {}) {
  if (!container) {
    throw new Error('mountGame requires a container');
  }

  container.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const emit = options.emit ?? (() => {});
  const state = createInitialGameState({ selectedWeapon: options.selectedWeapon });
  const sound = options.sound ?? createSoundController();
  let animationFrame = 0;
  let running = false;
  let paused = false;
  let input;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width || window.innerWidth || 1024));
    canvas.height = Math.max(1, Math.floor(rect.height || window.innerHeight || 720));
  }

  function centerCameraOnPlayer() {
    state.camera.x = state.player.x - canvas.width / 2;
    state.camera.y = state.player.y - canvas.height / 2;
  }

  function getSnapshot() {
    return {
      status: state.gameState,
      paused,
      player: {
        hp: Math.max(0, Math.floor(state.player.hp)),
        maxHp: state.player.maxHp,
        level: state.player.level,
        exp: state.player.exp,
        maxExp: state.player.maxExp,
        energy: state.player.energy,
        maxEnergy: state.player.maxEnergy,
        hasWeapon: state.player.hasWeapon
      },
      selectedWeapon: state.selectedWeapon,
      weapon: {
        id: state.weapon.id,
        name: state.weapon.name,
        trait: state.weapon.trait,
        attack: state.weapon.attack
      },
      pendingUpgrades: state.pendingUpgrades.map(toUpgradeViewModel),
      runStats: {
        selectedWeapon: state.runStats.selectedWeapon,
        selectedUpgrades: state.runStats.selectedUpgrades,
        damageTaken: state.runStats.damageTaken,
        stages: state.runStats.stages,
        echoFragments: state.runStats.echoFragments,
        bossPhaseReached: state.runStats.bossPhaseReached
      },
      stage: getStageSnapshot(state.currentStageIndex, state.objectives.progress),
      objectives: {
        ...state.objectives.progress
      },
      boss: getBossSnapshot(state.boss),
      runSummary: state.runSummary,
      kills: state.kills,
      gameTime: state.gameTime
    };
  }

  function updateUI() {
    emit('game:snapshot', getSnapshot());
  }

  function reset() {
    paused = false;
    Object.assign(state, createInitialGameState({ selectedWeapon: state.selectedWeapon }));
    resizeCanvas();
    centerCameraOnPlayer();
    updateUI();
    render(ctx, canvas, state, input);
  }

  function setPaused(value) {
    const next = Boolean(value);
    if (paused === next) return paused;
    paused = next;
    emit('game:paused', { paused });
    updateUI();
    render(ctx, canvas, state, input);
    return paused;
  }

  function togglePause() {
    return setPaused(!paused);
  }

  function saveSnapshot() {
    return serializeGameState(state);
  }

  function loadSnapshot(save) {
    const ok = applySavedState(state, save);
    if (!ok) return false;
    paused = false;
    resizeCanvas();
    centerCameraOnPlayer();
    updateUI();
    render(ctx, canvas, state, input);
    return true;
  }

  function setWeapon(weaponId) {
    if (state.gameState !== 'playing') return;
    const weapon = getWeaponDefinition(weaponId);
    state.selectedWeapon = weapon.id;
    state.weapon = weapon;
    state.runStats.selectedWeapon = weapon.id;
    sound.play('weaponSelect');
    updateUI();
    render(ctx, canvas, state, input);
  }

  function triggerUltimate() {
    const { player, enemies, projectiles } = state;
    const { mouse } = input;
    if (player.energy < player.maxEnergy || state.gameState !== 'playing') return;
    sound.play('ultimate');
    player.energy = 0;
    state.screenShake = 25;

    const startX = player.x;
    const startY = player.y;
    player.x = mouse.worldX;
    player.y = mouse.worldY;

    projectiles.push({ type: 'ult_line', x1: startX, y1: startY, x2: player.x, y2: player.y, duration: 20 });
    spawnParticles(state, startX, startY, '#54C6B2', 30, 8, 0.01);
    spawnParticles(state, player.x, player.y, '#D7A84B', 40, 10, 0.01);
    spawnText(state, player.x, player.y - 40, '瞬狱影杀阵！', '#54C6B2', 24);

    const ultRadius = 250;
    enemies.slice().forEach((enemy) => {
      if (distance(player.x, player.y, enemy.x, enemy.y) < ultRadius + enemy.radius) {
        damageEnemy(enemy, 500 * player.damageMult, true, '#54C6B2');
        projectiles.push({ type: 'ult_chain', x1: player.x, y1: player.y, x2: enemy.x, y2: enemy.y, duration: 10 });
      }
    });
    updateUI();
  }

  function throwWeapon() {
    const { player, droppedWeapons } = state;
    const { mouse } = input;
    if (!player.hasWeapon || state.gameState !== 'playing') return;
    sound.play('throw');

    const angle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);
    droppedWeapons.push({
      weaponId: state.selectedWeapon,
      x: player.x,
      y: player.y,
      angle,
      vx: Math.cos(angle) * 16,
      vy: Math.sin(angle) * 16,
      radius: 18,
      isFlying: true,
      baseDamage: 60 * player.damageMult,
      hitEnemies: new Set(),
      friction: 0.96
    });
    player.hasWeapon = false;
    state.screenShake = 6;
    updateUI();
  }

  function spawnEnemy() {
    const { player } = state;
    const stage = getStageDefinition(state.currentStageId);
    const { x, y } = getPassableSpawnPoint(player, Math.max(canvas.width, canvas.height) / 2);
    const enemyType = stage.enemies[Math.floor(Math.random() * stage.enemies.length)];
    state.enemies.push(createEnemy(enemyType, { x, y }, state.gameTime));
  }

  function performAttack() {
    const { player, enemies, projectiles } = state;
    const { mouse } = input;
    const weapon = player.hasWeapon ? state.weapon : {
      attack: { cooldown: 24, range: 45, arc: Math.PI * 0.7, damage: 10, knockback: 6, style: 'unarmed' },
      visual: { color: '#f4efe0' }
    };
    const attack = weapon.attack;
    player.attackTimer = Math.max(8, attack.cooldown - player.attackCooldownBonus);
    player.isSwingAnimating = true;
    player.swingTimer = 10;

    const aimAngle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);
    player.swingStart = aimAngle - attack.arc / 2;
    player.swingEnd = aimAngle + attack.arc / 2;
    player.swingWidth = weapon.visual?.swingWidth ?? 8;
    player.swingColor = weapon.visual?.color ?? `hsl(${player.colorHue}, 100%, 60%)`;
    sound.play('attack');

    const realDamage = attack.damage * player.damageMult;
    const realRange = attack.range * player.rangeMult;
    const swingColor = player.swingColor;
    const dashDistance = attack.style === 'thrust-dash' ? attack.dash * (1 + player.spearDashBoost) : 0;

    if (dashDistance > 0) {
      moveCircleWithCollisions(player, Math.cos(aimAngle) * dashDistance, Math.sin(aimAngle) * dashDistance, player.radius);
      clampToCityBounds(player, player.radius);
      spawnParticles(state, player.x, player.y, '#54C6B2', 10, 5, 0.04);
    }

    enemies.slice().forEach((enemy) => {
      if (distance(player.x, player.y, enemy.x, enemy.y) <= realRange + enemy.radius) {
        let angleDiff = Math.atan2(enemy.y - player.y, enemy.x - player.x) - aimAngle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        if (Math.abs(angleDiff) <= attack.arc / 2) {
          damageEnemy(enemy, realDamage, false, swingColor);
          const knockback = attack.knockback * player.knockbackMult;
          moveCircleWithCollisions(enemy, Math.cos(aimAngle) * knockback, Math.sin(aimAngle) * knockback, enemy.radius);
        }
      }
    });

    state.objectives.talismans.forEach((talisman) => {
      if (talisman.broken) return;
      if (distance(player.x, player.y, talisman.x, talisman.y) <= realRange + 22) {
        let angleDiff = Math.atan2(talisman.y - player.y, talisman.x - player.x) - aimAngle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        if (Math.abs(angleDiff) <= attack.arc / 2) {
          talisman.hp -= realDamage;
          spawnParticles(state, talisman.x, talisman.y, '#D7A84B', 6, 3, 0.05);
          if (talisman.hp <= 0) {
            talisman.broken = true;
            spawnText(state, talisman.x, talisman.y - 28, '护符破', '#D7A84B', 18);
            sound.play('enemyDeath');
          }
          updateObjectiveProgress();
        }
      }
    });

    if (player.hasWeapon && (attack.wave || player.hasSwordWave)) {
      projectiles.push({
        type: 'wave',
        x: player.x,
        y: player.y,
        vx: Math.cos(aimAngle) * 11,
        vy: Math.sin(aimAngle) * 11,
        radius: (30 + player.swordWaveBoost * 18) * player.rangeMult,
        damage: realDamage * (0.55 + player.swordWaveBoost),
        duration: 50,
        hitEnemies: new Set(),
        color: swingColor
      });
    }
  }

  function damageEnemy(enemy, dmg, isCrit = false, vfxColor = '#fff') {
    const { player } = state;
    enemy.hp -= dmg;
    sound.play('hit');
    spawnText(state, enemy.x, enemy.y - enemy.radius, Math.floor(dmg), isCrit ? '#54C6B2' : '#D7A84B', isCrit ? 22 : 16);
    spawnParticles(state, enemy.x, enemy.y, vfxColor, 6, 4);

    if (enemy.hp <= 0) {
      if (isBossEnemy(enemy)) {
        defeatBoss(enemy);
        return;
      }

      state.kills += 1;
      sound.play('enemyDeath');
      player.exp += enemy.expValue;
      player.energy = Math.min(player.maxEnergy, player.energy + 6 * player.energyGainMult);
      spawnParticles(state, enemy.x, enemy.y, '#C9493D', 15, 6);

      if (player.vampRate > 0 && Math.random() < player.vampRate) {
        player.hp = Math.min(player.maxHp, player.hp + 5);
        spawnText(state, player.x, player.y - 20, '+5', '#54C6B2');
      }

      state.enemies = state.enemies.filter((item) => item !== enemy);
      updateObjectiveProgress();
      checkLevelUp();
      updateUI();
    }
  }

  function checkLevelUp() {
    const { player } = state;
    if (player.exp >= player.maxExp) {
      player.exp -= player.maxExp;
      player.level += 1;
      player.maxExp = Math.floor(player.maxExp * 1.4 + 50);
      state.gameState = 'upgrade';
      sound.play('upgrade');
      showUpgradeScreen();
    }
  }

  function showUpgradeScreen() {
    state.pendingUpgrades = getWeaponUpgrades(state.selectedWeapon, state.player.level);
    emit('game:upgrade-available', {
      weaponId: state.selectedWeapon,
      level: state.player.level,
      upgrades: state.pendingUpgrades.map(toUpgradeViewModel)
    });
    updateUI();
  }

  function toUpgradeViewModel({ id, title, school, tier, desc, effects, tactic, focus }) {
    return { id, title, school, tier, desc, effects, tactic, focus };
  }

  function selectUpgrade(upgradeId) {
    if (state.gameState !== 'upgrade') return;
    const upgrade = state.pendingUpgrades.find((item) => item.id === upgradeId);
    if (!upgrade) return;
    upgrade.apply(state.player);
    state.runStats.selectedUpgrades.push({ id: upgrade.id, title: upgrade.title });
    spawnText(state, state.player.x, state.player.y - 55, `功法：${upgrade.title}`, '#D7A84B', 20);
    state.pendingUpgrades = [];
    state.gameState = 'playing';
    sound.play('upgrade');
    emit('game:upgrade-selected', { upgradeId: upgrade.id, title: upgrade.title });
    updateUI();
  }

  function hurtPlayer(dmg) {
    const { player } = state;
    player.hp -= dmg;
    sound.play('hit');
    state.runStats.damageTaken += dmg;
    state.screenShake = 15;
    spawnText(state, player.x, player.y - 20, `-${Math.floor(dmg)}`, '#C9493D', 20);
    updateUI();

    if (player.hp <= 0) {
      state.gameState = 'gameover';
      sound.play('playerDeath');
      updateUI();
    }
  }

  function update() {
    if (paused) return;
    if (state.gameState !== 'playing' && state.gameState !== 'boss') return;

    const { player, camera } = state;
    const { keys, mouse } = input;
    state.gameTime += 1 / 60;
    player.colorHue = (player.colorHue + 5) % 360;
    if (state.screenShake > 0) state.screenShake *= 0.85;

    mouse.worldX = mouse.x + camera.x;
    mouse.worldY = mouse.y + camera.y;

    let mx = 0;
    let my = 0;
    if (keys.w || keys.arrowup) my -= 1;
    if (keys.s || keys.arrowdown) my += 1;
    if (keys.a || keys.arrowleft) mx -= 1;
    if (keys.d || keys.arrowright) mx += 1;

    if (mx !== 0 || my !== 0) {
      const len = Math.sqrt(mx * mx + my * my);
      moveCircleWithCollisions(player, (mx / len) * player.speed, (my / len) * player.speed, player.radius);
    }

    clampToCityBounds(player, player.radius);

    if (player.attackTimer > 0) player.attackTimer -= 1;
    if (mouse.isLeftDown && player.attackTimer === 0) performAttack();
    if (player.isSwingAnimating) {
      player.swingTimer -= 1;
      if (player.swingTimer <= 0) player.isSwingAnimating = false;
    }

    if (state.gameState === 'playing') {
      state.spawnTimer += 1;
      const maxInterval = Math.max(15, 80 - Math.floor(state.gameTime / 5));
      if (state.spawnTimer >= maxInterval) {
        state.spawnTimer = 0;
        spawnEnemy();
      }
    }

    if (state.gameState === 'boss') {
      updateBossEncounter();
    }

    updateDroppedWeapons();
    updateObjectives();
    updateProjectiles();
    updateEnemies();
    updateParticles();

    camera.x += (player.x - canvas.width / 2 - camera.x) * 0.1;
    camera.y += (player.y - canvas.height / 2 - camera.y) * 0.1;
  }

  function updateObjectives() {
    const progress = state.objectives.progress;
    if (progress.type === 'lamps') {
      if (state.objectives.lamps.length === 0) {
        state.objectives.lamps = createLamps(progress.pointsKey);
      }
      state.objectives.lamps.forEach((lamp) => {
        if (!lamp.lit && state.kills >= 2 && distance(state.player.x, state.player.y, lamp.x, lamp.y) < 70) {
          lamp.lit = true;
          sound.play('stage');
          spawnText(state, lamp.x, lamp.y - 34, '灯明', '#D7A84B', 18);
          spawnParticles(state, lamp.x, lamp.y, '#D7A84B', 16, 5, 0.04);
          updateObjectiveProgress();
        }
      });
    }

    if (progress.type === 'echo-fragments') {
      if (state.objectives.echoFragments.length === 0) {
        state.objectives.echoFragments = createEchoFragments(progress.pointsKey);
      }

      state.objectives.echoFragments.forEach((fragment) => {
        if (!fragment.collected && distance(state.player.x, state.player.y, fragment.x, fragment.y) < 42) {
          fragment.collected = true;
          sound.play('pickup');
          state.runStats.echoFragments += 1;
          spawnText(state, fragment.x, fragment.y - 26, '回声+1', '#54C6B2', 16);
          spawnParticles(state, fragment.x, fragment.y, '#54C6B2', 14, 4, 0.05);
          updateObjectiveProgress();
        }
      });

      if (Math.floor(state.gameTime * 60) % 130 === 0) {
        state.objectives.echoWaves.push({
          x: state.player.x + (Math.random() - 0.5) * 360,
          y: state.player.y + (Math.random() - 0.5) * 280,
          radius: 12,
          maxRadius: 160,
          duration: 90,
          hit: false
        });
      }
    }

    if (progress.type === 'talismans' && state.objectives.talismans.length === 0) {
      state.objectives.talismans = createTalismans(progress.pointsKey);
      updateObjectiveProgress();
    }
  }

  function updateObjectiveProgress() {
    if (state.gameState !== 'playing') return;
    const progress = state.objectives.progress;
    if (progress.type === 'lamps') {
      progress.current = state.objectives.lamps.filter((lamp) => lamp.lit).length;
    } else if (progress.type === 'echo-fragments') {
      progress.current = state.objectives.echoFragments.filter((fragment) => fragment.collected).length;
    } else if (progress.type === 'talismans') {
      progress.current = state.objectives.talismans.filter((talisman) => talisman.broken).length;
    }
    progress.complete = progress.current >= progress.target;
    emit('game:objective-updated', getSnapshot());
    if (progress.complete) {
      advanceStage();
    }
  }

  function advanceStage() {
    const completedStage = state.currentStageId;
    state.stageStatus[state.currentStageIndex].complete = true;
    if (!state.runStats.stages.some((stage) => stage.id === completedStage)) {
      state.runStats.stages.push({
        id: completedStage,
        title: getStageDefinition(completedStage).title,
        complete: true
      });
    }

    if (state.currentStageIndex >= STAGES.length - 1) {
      state.objectives.progress.complete = true;
      startBoss();
      emit('game:stage-changed', getSnapshot());
      updateUI();
      return;
    }

    state.currentStageIndex += 1;
    state.currentStageId = STAGES[state.currentStageIndex].id;
    state.objectives.progress = createStageProgress(state.currentStageId);
    state.enemies = [];
    setupStageObjectives();
    spawnText(state, state.player.x, state.player.y - 70, getStageDefinition(state.currentStageId).title, '#D7A84B', 22);
    sound.play('stage');
    emit('game:stage-changed', getSnapshot());
    updateUI();
  }

  function setupStageObjectives() {
    const progress = state.objectives.progress;
    state.objectives.lamps = [];
    state.objectives.echoFragments = [];
    state.objectives.echoWaves = [];
    state.objectives.talismans = [];
    if (progress.type === 'lamps') {
      state.objectives.lamps = createLamps(progress.pointsKey);
    } else if (progress.type === 'echo-fragments') {
      state.objectives.echoFragments = createEchoFragments(progress.pointsKey);
    } else if (progress.type === 'talismans') {
      state.objectives.talismans = createTalismans(progress.pointsKey);
    }
  }

  function startBoss() {
    state.gameState = 'boss';
    sound.play('stage');
    state.boss = createBoss({ x: state.player.x, y: state.player.y - 280 });
    const bossEnemy = createBossEnemy(state.boss, { x: state.player.x, y: state.player.y - 280 });
    state.boss.enemyRef = bossEnemy;
    state.enemies = [bossEnemy];
    state.objectives.echoWaves = [];
    state.spawnTimer = 0;
    state.runStats.bossPhaseReached = 1;
    spawnText(state, bossEnemy.x, bossEnemy.y - 80, '雾甲守将', '#C9493D', 24);
    emit('game:boss-started', getSnapshot());
  }

  function updateBossEncounter() {
    const bossEnemy = state.enemies.find((enemy) => isBossEnemy(enemy));
    if (!state.boss || !bossEnemy) return;
    updateBoss(state.boss, bossEnemy, state, {
      hurtPlayer,
      spawnText: (x, y, text, color, size) => spawnText(state, x, y, text, color, size),
      spawnParticles: (x, y, color, count, speed) => spawnParticles(state, x, y, color, count, speed),
      summonPaperDolls: (x, y) => {
        for (let i = 0; i < 2; i += 1) {
          const angle = Math.PI * i + Math.random() * 0.5;
          state.enemies.push(createEnemy('paper-doll', {
            x: x + Math.cos(angle) * 110,
            y: y + Math.sin(angle) * 110
          }, state.gameTime));
        }
      }
    });
    syncBossFromEnemy(state.boss, bossEnemy);
    if (state.boss.hp <= 0) {
      defeatBoss(bossEnemy);
    }
  }

  function defeatBoss(enemy) {
    state.enemies = state.enemies.filter((item) => item !== enemy);
    if (state.boss) {
      state.boss.active = false;
      state.boss.defeated = true;
      state.boss.hp = 0;
      state.runStats.bossPhaseReached = Math.max(state.runStats.bossPhaseReached, state.boss.phase);
    }
    state.gameState = 'victory';
    state.runSummary = createRunSummary(state);
    sound.play('victory');
    spawnParticles(state, state.player.x, state.player.y, '#D7A84B', 36, 10, 0.03);
    emit('game:completed', state.runSummary);
    updateUI();
  }

  function updateDroppedWeapons() {
    const { player } = state;
    state.droppedWeapons.slice().forEach((weapon) => {
      if (weapon.isFlying) {
        if (isBlockedCircle(weapon.x + weapon.vx, weapon.y + weapon.vy, weapon.radius)) {
          weapon.isFlying = false;
          weapon.vx = 0;
          weapon.vy = 0;
        } else {
          weapon.x += weapon.vx;
          weapon.y += weapon.vy;
        }
        weapon.vx *= weapon.friction;
        weapon.vy *= weapon.friction;
        spawnParticles(state, weapon.x, weapon.y, '#54C6B2', 1, 1, 0.05);

        state.enemies.slice().forEach((enemy) => {
          if (!weapon.hitEnemies.has(enemy) && distance(weapon.x, weapon.y, enemy.x, enemy.y) < weapon.radius + enemy.radius) {
            damageEnemy(enemy, weapon.baseDamage * 1.5, true, '#54C6B2');
            weapon.hitEnemies.add(enemy);
            enemy.x += weapon.vx * 0.5;
            enemy.y += weapon.vy * 0.5;
          }
        });

        if (Math.sqrt(weapon.vx ** 2 + weapon.vy ** 2) < 1) {
          weapon.isFlying = false;
          if (player.explosiveThrow) {
            state.projectiles.push({
              type: 'explosion',
              x: weapon.x,
              y: weapon.y,
              radius: 10,
              maxRadius: 150,
              damage: 80 * player.damageMult,
              duration: 20
            });
            state.screenShake = 12;
          }
        }
      } else if (!player.hasWeapon && distance(player.x, player.y, weapon.x, weapon.y) < player.radius + weapon.radius) {
        player.hasWeapon = true;
        sound.play('pickup');
        spawnText(state, player.x, player.y - 30, '获得武器！', '#54C6B2');
        state.droppedWeapons = state.droppedWeapons.filter((item) => item !== weapon);
      }
    });
  }

  function updateProjectiles() {
    state.projectiles.slice().forEach((projectile) => {
      if (projectile.type === 'explosion') {
        projectile.radius += (projectile.maxRadius - projectile.radius) * 0.2;
        state.enemies.slice().forEach((enemy) => {
          if (distance(projectile.x, projectile.y, enemy.x, enemy.y) < projectile.radius && !projectile.hitEnemies) {
            damageEnemy(enemy, projectile.damage);
          }
        });
        projectile.hitEnemies = true;
        projectile.duration -= 1;
      } else if (projectile.type === 'wave') {
        const nextX = projectile.x + projectile.vx;
        const nextY = projectile.y + projectile.vy;
        if (isSegmentBlocked(projectile.x, projectile.y, nextX, nextY, Math.max(6, projectile.radius * 0.18))) {
          projectile.duration = 0;
          spawnParticles(state, projectile.x, projectile.y, projectile.color, 8, 2, 0.08);
          return;
        }
        projectile.x = nextX;
        projectile.y = nextY;
        spawnParticles(state, projectile.x, projectile.y, projectile.color, 2, 2, 0.1);
        state.enemies.slice().forEach((enemy) => {
          if (!projectile.hitEnemies.has(enemy) && distance(projectile.x, projectile.y, enemy.x, enemy.y) < projectile.radius + enemy.radius) {
            damageEnemy(enemy, projectile.damage, false, projectile.color);
            projectile.hitEnemies.add(enemy);
          }
        });
        projectile.duration -= 1;
      } else if (projectile.type === 'ult_line' || projectile.type === 'ult_chain') {
        projectile.duration -= 1;
      }
    });
    state.objectives.echoWaves.forEach((wave) => {
      wave.radius += 2.4;
      wave.duration -= 1;
      if (!wave.hit && distance(wave.x, wave.y, state.player.x, state.player.y) < wave.radius + state.player.radius && wave.radius > 36) {
        wave.hit = true;
        hurtPlayer(8);
      }
    });
    state.objectives.echoWaves = state.objectives.echoWaves.filter((wave) => wave.duration > 0 && wave.radius < wave.maxRadius);
    state.projectiles = state.projectiles.filter((projectile) => projectile.duration > 0);
  }

  function updateEnemies() {
    const { player } = state;
    state.enemies.forEach((enemy) => {
      resolveBlockedCircle(enemy, enemy.radius);
      if (enemy.hitCooldown > 0) enemy.hitCooldown -= 1;

      if (enemy.behavior === 'fast-chase') {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        moveEnemy(enemy, Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);

        if (distance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius && enemy.hitCooldown === 0) {
          hurtPlayer(enemy.damage);
          enemy.hitCooldown = 45;
        }
      } else if (enemy.behavior === 'surround') {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x) + Math.sin(state.gameTime + enemy.seed * 6) * 0.45;
        moveEnemy(enemy, Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);
        if (distance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius && enemy.hitCooldown === 0) {
          hurtPlayer(enemy.damage);
          enemy.hitCooldown = 50;
        }
      } else if (enemy.behavior === 'ripple-ranged') {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const d = distance(enemy.x, enemy.y, player.x, player.y);
        if (d > 260) {
          moveEnemy(enemy, Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);
        } else {
          moveEnemy(enemy, -Math.cos(angle) * enemy.speed * 0.45, -Math.sin(angle) * enemy.speed * 0.45);
        }
        enemy.actionTimer -= 1;
        if (enemy.actionTimer <= 0) {
          enemy.actionTimer = 95;
          state.objectives.echoWaves.push({
            x: enemy.x,
            y: enemy.y,
            radius: 12,
            maxRadius: 145,
            duration: 80,
            hit: false
          });
        }
      }
    });
  }

  function moveEnemy(enemy, dx, dy) {
    if (tryMoveEnemy(enemy, dx, dy)) return;

    const speed = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);
    const offsets = [Math.PI / 4, -Math.PI / 4, Math.PI / 2, -Math.PI / 2, Math.PI * 0.75, -Math.PI * 0.75];
    for (const offset of offsets) {
      if (tryMoveEnemy(enemy, Math.cos(baseAngle + offset) * speed, Math.sin(baseAngle + offset) * speed)) return;
    }

    resolveBlockedCircle(enemy, enemy.radius);
  }

  function tryMoveEnemy(enemy, dx, dy) {
    const beforeX = enemy.x;
    const beforeY = enemy.y;
    const nextX = beforeX + dx;
    const nextY = beforeY + dy;
    if (isSegmentBlocked(beforeX, beforeY, nextX, nextY, enemy.radius)) return false;
    moveCircleWithCollisions(enemy, dx, dy, enemy.radius);
    return enemy.x !== beforeX || enemy.y !== beforeY;
  }

  function updateParticles() {
    state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= particle.decay;
    });
    state.particles = state.particles.filter((particle) => particle.alpha > 0);

    state.damageTexts.forEach((text) => {
      text.y += text.vy;
      text.age += 1;
      text.alpha = Math.max(0, 1 - text.age / 40);
    });
    state.damageTexts = state.damageTexts.filter((text) => text.alpha > 0);
  }

  function loop() {
    if (!running) return;
    update();
    render(ctx, canvas, state, input);
    animationFrame = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    emit('game:started', getSnapshot());
    loop();
  }

  function stop() {
    running = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  resizeCanvas();
  input = createInputController(canvas, { triggerUltimate, throwWeapon });
  centerCameraOnPlayer();
  render(ctx, canvas, state, input);
  updateUI();
  const cleanupSpriteReady = onPlayerSpriteReady(() => {
    render(ctx, canvas, state, input);
  });
  const cleanupEnemySpritesReady = onEnemySpritesReady(() => {
    render(ctx, canvas, state, input);
  });

  const onResize = () => {
    resizeCanvas();
    centerCameraOnPlayer();
    render(ctx, canvas, state, input);
  };
  window.addEventListener('resize', onResize);

  return {
    start,
    stop() {
      stop();
      window.removeEventListener('resize', onResize);
      cleanupSpriteReady();
      cleanupEnemySpritesReady();
      input.destroy();
    },
    reset,
    setWeapon,
    selectUpgrade,
    getSnapshot,
    setPaused,
    togglePause,
    isPaused: () => paused,
    saveSnapshot,
    loadSnapshot,
    _debug: { state, canvas }
  };
}
