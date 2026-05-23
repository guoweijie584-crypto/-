import { distance, spawnParticles, spawnText } from './effects.js';
import { MAP_SIZE, createInitialGameState, createTerrain } from './gameState.js';
import { createInputController } from './input.js';
import { render } from './rendering.js';
import { getWeaponDefinition, getWeaponUpgrades } from './weapons.js';

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
  let animationFrame = 0;
  let running = false;
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
      pendingUpgrades: state.pendingUpgrades.map(({ id, title, desc }) => ({ id, title, desc })),
      runStats: {
        selectedWeapon: state.runStats.selectedWeapon,
        selectedUpgrades: state.runStats.selectedUpgrades,
        damageTaken: state.runStats.damageTaken
      },
      kills: state.kills,
      gameTime: state.gameTime
    };
  }

  function updateUI() {
    emit('game:snapshot', getSnapshot());
  }

  function reset() {
    Object.assign(state, createInitialGameState({ selectedWeapon: state.selectedWeapon }));
    resizeCanvas();
    centerCameraOnPlayer();
    updateUI();
    render(ctx, canvas, state, input);
  }

  function setWeapon(weaponId) {
    if (state.gameTime > 0 || state.gameState !== 'playing') return;
    const weapon = getWeaponDefinition(weaponId);
    state.selectedWeapon = weapon.id;
    state.weapon = weapon;
    state.runStats.selectedWeapon = weapon.id;
    updateUI();
  }

  function triggerUltimate() {
    const { player, enemies, projectiles } = state;
    const { mouse } = input;
    if (player.energy < player.maxEnergy || state.gameState !== 'playing') return;
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

    const angle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);
    droppedWeapons.push({
      x: player.x,
      y: player.y,
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
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.max(canvas.width, canvas.height) / 2 + 150;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;
    const rand = Math.random();
    let enemyType;
    let hp;
    let speed;
    let expValue;
    let behavior;

    if (rand < 0.35) {
      enemyType = 'neutral_animal';
      hp = 20;
      speed = 2.8;
      expValue = 5;
      behavior = 'flee';
    } else if (rand < 0.7) {
      enemyType = 'silly_dog';
      hp = 30 + state.gameTime * 0.5;
      speed = 3.2;
      expValue = 15;
      behavior = 'chase';
    } else {
      enemyType = 'fierce_monster';
      hp = 150 + state.gameTime * 3;
      speed = 1.3;
      expValue = 40;
      behavior = 'chase';
    }

    const radius = Math.min(60, 15 + Math.sqrt(hp) * 1.5);
    state.enemies.push({
      x,
      y,
      type: enemyType,
      hp,
      maxHp: hp,
      speed,
      radius,
      expValue,
      hitCooldown: 0,
      behavior,
      targetAngle: Math.random() * Math.PI * 2,
      seed: Math.random()
    });
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

    const realDamage = attack.damage * player.damageMult;
    const realRange = attack.range * player.rangeMult;
    const swingColor = player.swingColor;
    const dashDistance = attack.style === 'thrust-dash' ? attack.dash * (1 + player.spearDashBoost) : 0;

    if (dashDistance > 0) {
      player.x += Math.cos(aimAngle) * dashDistance;
      player.y += Math.sin(aimAngle) * dashDistance;
      player.x = Math.max(-MAP_SIZE / 2, Math.min(MAP_SIZE / 2, player.x));
      player.y = Math.max(-MAP_SIZE / 2, Math.min(MAP_SIZE / 2, player.y));
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
          enemy.x += Math.cos(aimAngle) * knockback;
          enemy.y += Math.sin(aimAngle) * knockback;
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
    spawnText(state, enemy.x, enemy.y - enemy.radius, Math.floor(dmg), isCrit ? '#54C6B2' : '#D7A84B', isCrit ? 22 : 16);
    spawnParticles(state, enemy.x, enemy.y, vfxColor, 6, 4);

    if (enemy.hp <= 0) {
      state.kills += 1;
      player.exp += enemy.expValue;
      player.energy = Math.min(player.maxEnergy, player.energy + (enemy.type === 'neutral_animal' ? 2 : 5) * player.energyGainMult);
      spawnParticles(state, enemy.x, enemy.y, '#C9493D', 15, 6);

      if (player.vampRate > 0 && Math.random() < player.vampRate) {
        player.hp = Math.min(player.maxHp, player.hp + 5);
        spawnText(state, player.x, player.y - 20, '+5', '#54C6B2');
      }

      state.enemies = state.enemies.filter((item) => item !== enemy);
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
      showUpgradeScreen();
    }
  }

  function showUpgradeScreen() {
    state.pendingUpgrades = getWeaponUpgrades(state.selectedWeapon);
    emit('game:upgrade-available', {
      weaponId: state.selectedWeapon,
      upgrades: state.pendingUpgrades.map(({ id, title, desc }) => ({ id, title, desc }))
    });
    updateUI();
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
    emit('game:upgrade-selected', { upgradeId: upgrade.id, title: upgrade.title });
    updateUI();
  }

  function hurtPlayer(dmg) {
    const { player } = state;
    player.hp -= dmg;
    state.runStats.damageTaken += dmg;
    state.screenShake = 15;
    spawnText(state, player.x, player.y - 20, `-${Math.floor(dmg)}`, '#C9493D', 20);
    updateUI();

    if (player.hp <= 0) {
      state.gameState = 'gameover';
      updateUI();
    }
  }

  function update() {
    if (state.gameState !== 'playing') return;

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
      player.x += (mx / len) * player.speed;
      player.y += (my / len) * player.speed;
    }

    player.x = Math.max(-MAP_SIZE / 2, Math.min(MAP_SIZE / 2, player.x));
    player.y = Math.max(-MAP_SIZE / 2, Math.min(MAP_SIZE / 2, player.y));

    if (player.attackTimer > 0) player.attackTimer -= 1;
    if (mouse.isLeftDown && player.attackTimer === 0) performAttack();
    if (player.isSwingAnimating) {
      player.swingTimer -= 1;
      if (player.swingTimer <= 0) player.isSwingAnimating = false;
    }

    state.spawnTimer += 1;
    const maxInterval = Math.max(15, 80 - Math.floor(state.gameTime / 5));
    if (state.spawnTimer >= maxInterval) {
      state.spawnTimer = 0;
      spawnEnemy();
    }

    updateDroppedWeapons();
    updateProjectiles();
    updateEnemies();
    updateParticles();

    camera.x += (player.x - canvas.width / 2 - camera.x) * 0.1;
    camera.y += (player.y - canvas.height / 2 - camera.y) * 0.1;
  }

  function updateDroppedWeapons() {
    const { player } = state;
    state.droppedWeapons.slice().forEach((weapon) => {
      if (weapon.isFlying) {
        weapon.x += weapon.vx;
        weapon.y += weapon.vy;
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
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
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
    state.projectiles = state.projectiles.filter((projectile) => projectile.duration > 0);
  }

  function updateEnemies() {
    const { player } = state;
    state.enemies.forEach((enemy) => {
      if (enemy.hitCooldown > 0) enemy.hitCooldown -= 1;

      if (enemy.behavior === 'chase') {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;

        if (distance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius && enemy.hitCooldown === 0) {
          hurtPlayer(enemy.type === 'fierce_monster' ? 25 : 12);
          enemy.hitCooldown = 45;
        }
      } else if (enemy.behavior === 'flee') {
        const d = distance(enemy.x, enemy.y, player.x, player.y);
        if (d < 300) {
          enemy.targetAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
        } else if (Math.random() < 0.03) {
          enemy.targetAngle = Math.random() * Math.PI * 2;
        }
        enemy.x += Math.cos(enemy.targetAngle) * enemy.speed;
        enemy.y += Math.sin(enemy.targetAngle) * enemy.speed;
      }
    });
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
      input.destroy();
    },
    reset,
    setWeapon,
    selectUpgrade,
    getSnapshot,
    _debug: { state, canvas }
  };
}
