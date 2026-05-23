import { getWeaponDefinition } from './weapons.js';
import {
  getEffectVisual,
  getEnemyVisual,
  getPlayerAction,
  getPlayerVisual,
  getScenePropVisual,
  getWeaponVisual
} from './visualAssets.js';

const PLAYER_SPRITE = createSpriteState(getPlayerVisual().sprite);

const ENEMY_SPRITES = Object.fromEntries(
  Object.entries({
    'lamp-shadow': getEnemyVisual('lamp-shadow').sprite,
    'paper-doll': getEnemyVisual('paper-doll').sprite,
    'well-shadow': getEnemyVisual('well-shadow').sprite
  }).map(([enemyType, sprite]) => [enemyType, createSpriteState(sprite)])
);

function createSpriteState(sprite) {
  if (!sprite?.src) return null;
  return {
    ...sprite,
    image: null,
    loaded: false,
    failed: false,
    listeners: new Set()
  };
}

function getSprite(sprite) {
  if (!sprite) return null;
  if (typeof Image === 'undefined') return null;
  if (!sprite.image && !sprite.failed) {
    sprite.image = new Image();
    sprite.image.onload = () => {
      sprite.loaded = true;
      sprite.listeners?.forEach((listener) => listener());
    };
    sprite.image.onerror = () => {
      sprite.failed = true;
    };
    sprite.image.src = sprite.src;
  }
  return sprite.loaded ? sprite.image : null;
}

function getPlayerSprite() {
  return getSprite(PLAYER_SPRITE);
}

function getEnemySprite(enemyType) {
  const sprite = ENEMY_SPRITES[enemyType];
  if (!sprite) return null;
  return getSprite(sprite);
}

export function onPlayerSpriteReady(listener) {
  if (PLAYER_SPRITE.loaded) {
    listener();
    return () => {};
  }
  PLAYER_SPRITE.listeners.add(listener);
  return () => PLAYER_SPRITE.listeners.delete(listener);
}

export function onEnemySpritesReady(listener) {
  Object.values(ENEMY_SPRITES).forEach((sprite) => {
    if (!sprite.listeners) sprite.listeners = new Set();
    if (!sprite.loaded) sprite.listeners.add(listener);
  });
  return () => {
    Object.values(ENEMY_SPRITES).forEach((sprite) => {
      sprite.listeners?.delete(listener);
    });
  };
}

export function render(ctx, canvas, state, input) {
  const { camera, terrain, droppedWeapons, projectiles, enemies, particles, damageTexts } = state;

  ctx.fillStyle = '#101613';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (state.screenShake > 0) {
    ctx.translate((Math.random() - 0.5) * state.screenShake, (Math.random() - 0.5) * state.screenShake);
  }
  ctx.translate(-camera.x, -camera.y);

  drawWorld(ctx, canvas, camera, terrain);
  drawObjectives(ctx, state);
  drawDroppedWeapons(ctx, state, droppedWeapons);
  drawProjectiles(ctx, projectiles);
  enemies.forEach((enemy) => drawEnemy(ctx, state, enemy));
  drawBoss(ctx, state);
  drawPlayer(ctx, state, input);
  drawParticles(ctx, particles);
  drawDamageTexts(ctx, damageTexts);

  ctx.restore();
}

function drawBoss(ctx, state) {
  if (!state.boss?.active) return;
  const bossEnemy = state.enemies.find((enemy) => enemy.type === 'mist-armor-general');
  if (!bossEnemy) return;
  const visual = getEnemyVisual('mist-armor-general').fallback.palette;

  if (state.boss.telegraph) {
    ctx.save();
    ctx.translate(bossEnemy.x, bossEnemy.y);
    ctx.rotate(state.boss.telegraph.angle ?? 0);
    ctx.strokeStyle = '#C9493D';
    ctx.fillStyle = 'rgba(201, 73, 61, 0.18)';
    ctx.lineWidth = 4;
    if (state.boss.telegraph.type === 'charge') {
      ctx.fillRect(0, -18, state.boss.telegraph.range, 36);
      ctx.strokeRect(0, -18, state.boss.telegraph.range, 36);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, state.boss.telegraph.radius, -Math.PI * 0.55, Math.PI * 0.55);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.translate(bossEnemy.x, bossEnemy.y);
  if (state.boss.phase === 2) {
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#54C6B2';
    ctx.strokeStyle = '#54C6B2';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, bossEnemy.radius + 12 + Math.sin(state.gameTime * 8) * 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.shadowBlur = 24;
  ctx.shadowColor = visual.accent;
  const body = createRadialGradient(ctx, -22, -20, 8, 0, 0, bossEnemy.radius * 1.7, visual.body);
  body.addColorStop(0, '#6a6d5d');
  body.addColorStop(0.38, visual.body);
  body.addColorStop(1, visual.shadow);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, bossEnemy.radius * 0.94, bossEnemy.radius * 1.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = visual.glow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-bossEnemy.radius * 0.58, -bossEnemy.radius * 0.38);
  ctx.lineTo(bossEnemy.radius * 0.52, bossEnemy.radius * 0.45);
  ctx.moveTo(-bossEnemy.radius * 0.5, bossEnemy.radius * 0.42);
  ctx.lineTo(bossEnemy.radius * 0.56, -bossEnemy.radius * 0.34);
  ctx.stroke();
  ctx.fillStyle = visual.accent;
  ctx.beginPath();
  ctx.arc(18, -10, 5, 0, Math.PI * 2);
  ctx.arc(18, 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const barW = 220;
  const hpRatio = Math.max(0, state.boss.hp / state.boss.maxHp);
  ctx.fillStyle = 'rgba(16,22,19,0.86)';
  ctx.fillRect(bossEnemy.x - barW / 2, bossEnemy.y - bossEnemy.radius - 34, barW, 12);
  ctx.fillStyle = state.boss.phase === 2 ? '#54C6B2' : '#C9493D';
  ctx.fillRect(bossEnemy.x - barW / 2, bossEnemy.y - bossEnemy.radius - 34, barW * hpRatio, 12);
}

function drawObjectives(ctx, state) {
  state.objectives.lamps.forEach((lamp) => drawLamp(ctx, lamp));
  state.objectives.echoFragments.forEach((fragment) => drawEcho(ctx, fragment));
  state.objectives.echoWaves.forEach((wave) => drawEchoWave(ctx, wave));
  state.objectives.talismans.forEach((talisman) => drawTalisman(ctx, talisman));
}

function drawLamp(ctx, lamp) {
  ctx.save();
  ctx.translate(lamp.x, lamp.y);
  ctx.shadowBlur = lamp.lit ? 20 : 0;
  ctx.shadowColor = '#D7A84B';
  ctx.fillStyle = lamp.lit ? '#D7A84B' : '#25342C';
  ctx.strokeStyle = '#D7A84B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#101613';
  ctx.fillRect(-3, 12, 6, 28);
  ctx.restore();
}

function drawEcho(ctx, fragment) {
  if (fragment.collected) return;
  ctx.save();
  ctx.translate(fragment.x, fragment.y);
  ctx.shadowBlur = 16;
  ctx.shadowColor = '#54C6B2';
  ctx.fillStyle = '#54C6B2';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(14, 0);
  ctx.lineTo(0, 18);
  ctx.lineTo(-14, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEchoWave(ctx, wave) {
  ctx.save();
  ctx.strokeStyle = `rgba(84, 198, 178, ${Math.max(0.16, wave.duration / 100)})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawTalisman(ctx, talisman) {
  if (talisman.broken) return;
  ctx.save();
  ctx.translate(talisman.x, talisman.y);
  ctx.fillStyle = '#f4efe0';
  ctx.strokeStyle = '#D7A84B';
  ctx.lineWidth = 3;
  ctx.fillRect(-14, -24, 28, 48);
  ctx.strokeRect(-14, -24, 28, 48);
  ctx.strokeStyle = '#C9493D';
  ctx.beginPath();
  ctx.moveTo(-7, -8);
  ctx.lineTo(7, 8);
  ctx.moveTo(7, -8);
  ctx.lineTo(-7, 8);
  ctx.stroke();
  ctx.restore();
}

function drawWorld(ctx, canvas, camera, terrain) {
  const cityMap = terrain.cityMap;
  if (!cityMap) {
    drawFallbackWorld(ctx, canvas, camera, terrain);
    return;
  }

  ctx.fillStyle = '#111815';
  ctx.fillRect(camera.x - 80, camera.y - 80, canvas.width + 160, canvas.height + 160);

  drawCityBounds(ctx, cityMap);
  drawCanals(ctx, cityMap.canals);
  drawRoads(ctx, cityMap.roads);
  drawBridges(ctx, cityMap.bridges);
  drawBuildings(ctx, cityMap.buildings);
  drawCityDecorations(ctx, cityMap.decorations);
  drawLandmarkLabels(ctx, cityMap.landmarks);
  drawTerrainDecorations(ctx, canvas, camera, terrain.decorations);
}

function drawFallbackWorld(ctx, canvas, camera, terrain) {
  ctx.fillStyle = '#162119';
  ctx.fillRect(camera.x - 80, camera.y - 80, canvas.width + 160, canvas.height + 160);

  drawTerrainDecorations(ctx, canvas, camera, terrain.decorations);
}

function drawCityBounds(ctx, cityMap) {
  const bounds = cityMap.cityBounds;
  ctx.fillStyle = '#17201b';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.strokeStyle = 'rgba(215, 168, 75, 0.24)';
  ctx.lineWidth = 10;
  strokeRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height);
}

function drawCanals(ctx, canals) {
  canals.forEach((canal) => {
    const water = createLinearGradient(ctx, canal.x, canal.y, canal.x + canal.width, canal.y + canal.height, '#193b3d');
    water.addColorStop(0, '#102729');
    water.addColorStop(0.45, '#1e5556');
    water.addColorStop(1, '#0f2427');
    ctx.fillStyle = water;
    ctx.fillRect(canal.x, canal.y, canal.width, canal.height);
    ctx.strokeStyle = 'rgba(84, 198, 178, 0.45)';
    ctx.lineWidth = 3;
    strokeRect(ctx, canal.x + 2, canal.y + 2, canal.width - 4, canal.height - 4);
    ctx.strokeStyle = 'rgba(244, 239, 224, 0.08)';
    ctx.lineWidth = 1;
    for (let offset = 18; offset < Math.max(canal.width, canal.height); offset += 42) {
      ctx.beginPath();
      if (canal.height > canal.width) {
        ctx.moveTo(canal.x + 12, canal.y + offset);
        ctx.lineTo(canal.x + canal.width - 12, canal.y + offset + 16);
      } else {
        ctx.moveTo(canal.x + offset, canal.y + 18);
        ctx.lineTo(canal.x + offset + 24, canal.y + canal.height - 18);
      }
      ctx.stroke();
    }
  });
}

function drawRoads(ctx, roads) {
  roads.forEach((road) => {
    ctx.fillStyle = road.kind === 'square' ? '#30332a' : '#292d27';
    ctx.fillRect(road.x, road.y, road.width, road.height);
    ctx.strokeStyle = 'rgba(244, 239, 224, 0.08)';
    ctx.lineWidth = 1;
    const step = 34;
    for (let x = road.x + step; x < road.x + road.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, road.y);
      ctx.lineTo(x, road.y + road.height);
      ctx.stroke();
    }
    for (let y = road.y + step; y < road.y + road.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(road.x, y);
      ctx.lineTo(road.x + road.width, y);
      ctx.stroke();
    }
  });
}

function drawBridges(ctx, bridges) {
  bridges.forEach((bridge) => {
    const visual = getScenePropVisual('bridge').fallback.palette;
    const bridgeGradient = createLinearGradient(ctx, bridge.x, bridge.y, bridge.x, bridge.y + bridge.height, visual.stone);
    bridgeGradient.addColorStop(0, '#a79265');
    bridgeGradient.addColorStop(0.5, visual.stone);
    bridgeGradient.addColorStop(1, visual.shadow);
    ctx.fillStyle = bridgeGradient;
    ctx.fillRect(bridge.x, bridge.y, bridge.width, bridge.height);
    ctx.strokeStyle = visual.edge;
    ctx.lineWidth = 3;
    strokeRect(ctx, bridge.x, bridge.y, bridge.width, bridge.height);
    ctx.strokeStyle = 'rgba(16, 22, 19, 0.36)';
    ctx.lineWidth = 2;
    const vertical = bridge.height > bridge.width;
    for (let i = vertical ? bridge.y + 18 : bridge.x + 18; i < (vertical ? bridge.y + bridge.height : bridge.x + bridge.width); i += 24) {
      ctx.beginPath();
      if (vertical) {
        ctx.moveTo(bridge.x + 8, i);
        ctx.lineTo(bridge.x + bridge.width - 8, i);
      } else {
        ctx.moveTo(i, bridge.y + 8);
        ctx.lineTo(i, bridge.y + bridge.height - 8);
      }
      ctx.stroke();
    }
  });
}

function drawBuildings(ctx, buildings) {
  buildings.forEach((building) => {
    const isWall = building.kind === 'wall' || building.kind === 'tower';
    const visual = getScenePropVisual(isWall ? 'wall' : 'residence').fallback.palette;
    const wallGradient = createLinearGradient(ctx, building.x, building.y, building.x, building.y + building.height, isWall ? visual.stone : visual.wall);
    wallGradient.addColorStop(0, isWall ? '#696451' : '#f7efd9');
    wallGradient.addColorStop(0.62, isWall ? visual.stone : visual.wall);
    wallGradient.addColorStop(1, isWall ? '#34362d' : '#b9ad94');
    ctx.fillStyle = wallGradient;
    ctx.fillRect(building.x, building.y, building.width, building.height);
    ctx.fillStyle = isWall ? visual.top : visual.roof;
    const roofPad = isWall ? 10 : 8;
    ctx.beginPath();
    ctx.moveTo(building.x + roofPad, building.y + roofPad + 6);
    ctx.lineTo(building.x + building.width - roofPad, building.y + roofPad);
    ctx.lineTo(building.x + building.width - roofPad - 8, building.y + building.height - roofPad);
    ctx.lineTo(building.x + roofPad + 8, building.y + building.height - roofPad + 4);
    closeWeaponPath(ctx, building.x + roofPad, building.y + roofPad + 6);
    ctx.fill();
    ctx.strokeStyle = isWall ? 'rgba(215, 168, 75, 0.5)' : 'rgba(16, 22, 19, 0.56)';
    ctx.lineWidth = isWall ? 4 : 2;
    strokeRect(ctx, building.x, building.y, building.width, building.height);

    if (!isWall && building.width > 90 && building.height > 64) {
      ctx.strokeStyle = 'rgba(215, 168, 75, 0.22)';
      ctx.lineWidth = 1;
      for (let x = building.x + 28; x < building.x + building.width - 12; x += 38) {
        ctx.beginPath();
        ctx.moveTo(x, building.y + 14);
        ctx.lineTo(x + 8, building.y + building.height - 16);
        ctx.stroke();
      }
    }
  });
}

function drawCityDecorations(ctx, decorations) {
  decorations.forEach((decoration) => {
    if (decoration.type === 'lantern') {
      drawLampPostDecoration(ctx, decoration.x, decoration.y);
    } else if (decoration.type === 'boat') {
      drawBoat(ctx, decoration.x, decoration.y);
    } else if (decoration.type === 'willow' || decoration.type === 'tree') {
      drawTree(ctx, decoration.x, decoration.y);
    } else {
      drawFlower(ctx, decoration.x, decoration.y, '#D7A84B');
    }
  });
}

function drawLandmarkLabels(ctx, landmarks) {
  ['old-street', 'ancient-well', 'city-tower'].forEach((id) => {
    const landmark = landmarks[id];
    ctx.fillStyle = 'rgba(16, 22, 19, 0.78)';
    ctx.fillRect(landmark.x - 72, landmark.y - 58, 144, 28);
    ctx.strokeStyle = 'rgba(215, 168, 75, 0.6)';
    strokeRect(ctx, landmark.x - 72, landmark.y - 58, 144, 28);
    ctx.fillStyle = '#D7A84B';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(landmark.title, landmark.x, landmark.y - 39);
    ctx.beginPath();
    ctx.arc(landmark.x, landmark.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.textAlign = 'start';
}

function drawTerrainDecorations(ctx, canvas, camera, decorations = []) {
  const viewBuffer = 100;
  decorations.forEach((decoration) => {
    if (
      decoration.x > camera.x - viewBuffer &&
      decoration.x < camera.x + canvas.width + viewBuffer &&
      decoration.y > camera.y - viewBuffer &&
      decoration.y < camera.y + canvas.height + viewBuffer
    ) {
      if (decoration.type === 'grass') {
        drawGrass(ctx, decoration.x, decoration.y);
      } else {
        drawFlower(ctx, decoration.x, decoration.y, decoration.color);
      }
    }
  });
}

function drawLampPostDecoration(ctx, x, y) {
  const visual = getScenePropVisual('lantern').fallback.palette;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = visual.pole;
  ctx.fillRect(-3, 0, 6, 32);
  ctx.shadowBlur = 18;
  ctx.shadowColor = visual.light;
  ctx.fillStyle = visual.silk;
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = visual.light;
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBoat(ctx, x, y) {
  const visual = getScenePropVisual('boat').fallback.palette;
  ctx.save();
  ctx.translate(x, y);
  const hull = createLinearGradient(ctx, -26, -10, 30, 9, visual.hull);
  hull.addColorStop(0, '#2f1d13');
  hull.addColorStop(0.5, visual.hull);
  hull.addColorStop(1, '#9a6236');
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(-26, 0);
  ctx.lineTo(-16, -10);
  ctx.lineTo(20, -8);
  ctx.lineTo(30, 0);
  ctx.lineTo(18, 9);
  ctx.lineTo(-16, 10);
  closeWeaponPath(ctx, -26, 0);
  ctx.fill();
  ctx.strokeStyle = visual.trim;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function drawTree(ctx, x, y) {
  const visual = getScenePropVisual('willow').fallback.palette;
  ctx.fillStyle = visual.dark;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = visual.leaf;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 10);
  ctx.lineTo(x - 22, y + 28);
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x - 4, y + 32);
  ctx.moveTo(x + 10, y + 10);
  ctx.lineTo(x + 18, y + 26);
  ctx.stroke();
}

function drawGrass(ctx, x, y) {
  ctx.strokeStyle = '#54C6B2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 3, y - 8);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 2, y - 10);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y - 6);
  ctx.stroke();
}

function drawFlower(ctx, x, y, color) {
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(x + Math.cos(i * Math.PI / 2) * 3, y + Math.sin(i * Math.PI / 2) * 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPlayer(ctx, state, input) {
  const { player, gameTime } = state;
  const { mouse } = input;
  const aimAngle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);
  const inputVector = {
    x: Number(Boolean(input.keys?.d || input.keys?.arrowright)) - Number(Boolean(input.keys?.a || input.keys?.arrowleft)),
    y: Number(Boolean(input.keys?.s || input.keys?.arrowdown)) - Number(Boolean(input.keys?.w || input.keys?.arrowup))
  };
  const action = getPlayerAction(player, state.selectedWeapon, inputVector);

  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.energy >= player.maxEnergy) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#54C6B2';
    ctx.strokeStyle = '#54C6B2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + Math.sin(gameTime * 10) * 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawPlayerBody(ctx, aimAngle, action, gameTime);
  ctx.rotate(aimAngle);

  if (player.hasWeapon) {
    drawWeaponSkin(ctx, state.weapon.id, { scale: Math.min(1.25, player.rangeMult), glow: true });
  }

  ctx.restore();

  if (player.isSwingAnimating) {
    ctx.save();
    ctx.translate(player.x, player.y);
    drawModeledSlashArc(ctx, player);
    ctx.restore();
  }
}

function drawPlayerBody(ctx, aimAngle, action, gameTime) {
  const sprite = getPlayerSprite();
  if (!sprite) {
    drawModeledHeroFallback(ctx, aimAngle, action, gameTime);
    return;
  }

  const directionFrame = getPlayerDirectionFrame(aimAngle);
  const bob = action === 'run' ? Math.sin(gameTime * 12) * 3 : Math.sin(gameTime * 4) * 1.2;
  ctx.save();
  ctx.shadowBlur = 16;
  ctx.shadowColor = action.startsWith('attack') ? 'rgba(215, 168, 75, 0.45)' : 'rgba(16, 22, 19, 0.68)';
  ctx.drawImage(
    sprite,
    directionFrame * PLAYER_SPRITE.frameWidth,
    0,
    PLAYER_SPRITE.frameWidth,
    PLAYER_SPRITE.frameHeight,
    -28,
    -60 + bob,
    56,
    70
  );
  drawHeroArmorOverlay(ctx, aimAngle, action, gameTime);
  ctx.restore();
}

function drawModeledHeroFallback(ctx, aimAngle, action, gameTime) {
  const palette = getPlayerVisual().fallback.palette;
  const bob = action === 'run' ? Math.sin(gameTime * 12) * 2.5 : Math.sin(gameTime * 4) * 1.2;

  ctx.save();
  ctx.translate(0, bob);
  ctx.rotate(aimAngle);

  const bodyGradient = createRadialGradient(ctx, -8, -10, 4, 0, 0, 35, palette.coat);
  bodyGradient.addColorStop(0, palette.highlight);
  bodyGradient.addColorStop(0.28, palette.armor);
  bodyGradient.addColorStop(0.52, palette.coat);
  bodyGradient.addColorStop(1, palette.coatShadow);

  ctx.shadowBlur = action.startsWith('attack') ? 18 : 10;
  ctx.shadowColor = action.startsWith('attack') ? palette.armor : 'rgba(0,0,0,0.55)';
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.cloth;
  ctx.beginPath();
  ctx.moveTo(-12, 8);
  ctx.lineTo(0, 32);
  ctx.lineTo(14, 8);
  closeWeaponPath(ctx, -12, 8);
  ctx.fill();

  ctx.fillStyle = palette.skin;
  ctx.beginPath();
  ctx.arc(6, -22, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.coatShadow;
  ctx.beginPath();
  ctx.arc(10, -24, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.armor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-12, -10);
  ctx.lineTo(13, 9);
  ctx.moveTo(-10, 9);
  ctx.lineTo(12, -8);
  ctx.stroke();

  ctx.restore();
}

function drawHeroArmorOverlay(ctx, aimAngle, action, gameTime) {
  const palette = getPlayerVisual().fallback.palette;
  ctx.save();
  ctx.rotate(aimAngle);
  ctx.globalAlpha = action.startsWith('attack') ? 0.86 : 0.62;
  ctx.strokeStyle = palette.armor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-13, -18 + Math.sin(gameTime * 8) * 1.5);
  ctx.lineTo(12, 8);
  ctx.moveTo(-10, 7);
  ctx.lineTo(12, -16);
  ctx.stroke();
  ctx.restore();
}

function drawModeledSlashArc(ctx, player) {
  const visual = getEffectVisual('slashArc').fallback.palette;
  const color = player.swingColor ?? visual.glow;
  const radius = (player.hasWeapon ? 65 : 40) * player.rangeMult;

  ctx.save();
  ctx.shadowBlur = 24;
  ctx.shadowColor = color;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.lineWidth = player.hasWeapon ? player.swingWidth ?? 12 : 5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, player.swingStart, player.swingEnd);
  ctx.stroke();

  ctx.globalAlpha = 0.62;
  ctx.strokeStyle = visual.core;
  ctx.lineWidth = Math.max(2, (player.swingWidth ?? 8) * 0.42);
  ctx.beginPath();
  ctx.arc(0, 0, radius + 7, player.swingStart + 0.04, player.swingEnd - 0.04);
  ctx.stroke();
  ctx.restore();
}

function getPlayerDirectionFrame(angle) {
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  if (normalized >= Math.PI * 0.25 && normalized < Math.PI * 0.75) return 1;
  if (normalized >= Math.PI * 0.75 && normalized < Math.PI * 1.25) return 2;
  if (normalized >= Math.PI * 1.25 && normalized < Math.PI * 1.75) return 3;
  return 0;
}

export function drawEnemy(ctx, state, enemy) {
  const { player } = state;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  const lookAngle = enemy.behavior === 'fast-chase' || enemy.behavior === 'surround' || enemy.behavior === 'ripple-ranged'
    ? Math.atan2(player.y - enemy.y, player.x - enemy.x)
    : enemy.targetAngle || 0;
  ctx.rotate(lookAngle);

  if (enemy.type === 'mist-armor-general') {
    ctx.restore();
    return;
  }

  if (drawEnemySprite(ctx, state, enemy)) {
    ctx.restore();
    drawEnemyHealthBar(ctx, enemy);
    return;
  }

  drawModeledEnemyFallback(ctx, state, enemy);

  ctx.restore();

  drawEnemyHealthBar(ctx, enemy);
}

function drawModeledEnemyFallback(ctx, state, enemy) {
  const visual = getEnemyVisual(enemy.type);
  const palette = visual.fallback.palette;
  const pulse = 1 + Math.sin(state.gameTime * 5 + enemy.seed * 6) * 0.06;
  ctx.scale(pulse, pulse);
  ctx.shadowBlur = 18;
  ctx.shadowColor = palette.glow;

  if (visual.silhouette === 'lantern-wraith') {
    const body = createRadialGradient(ctx, -8, -8, 2, 0, 0, enemy.radius * 1.7, palette.body);
    body.addColorStop(0, palette.glow);
    body.addColorStop(0.35, palette.body);
    body.addColorStop(1, palette.shadow);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, enemy.radius * 0.82, enemy.radius * 1.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.ellipse(enemy.radius * 0.58, -5, 5, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(enemy.radius * 0.58, 7, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (visual.silhouette === 'paper-puppet') {
    ctx.fillStyle = palette.body;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-enemy.radius * 0.7, -enemy.radius);
    ctx.lineTo(enemy.radius * 0.55, -enemy.radius * 0.82);
    ctx.lineTo(enemy.radius * 0.78, enemy.radius * 0.92);
    ctx.lineTo(-enemy.radius * 0.58, enemy.radius);
    closeWeaponPath(ctx, -enemy.radius * 0.7, -enemy.radius);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(201, 73, 61, 0.58)';
    ctx.beginPath();
    ctx.moveTo(-enemy.radius * 0.35, -enemy.radius * 0.35);
    ctx.lineTo(enemy.radius * 0.42, enemy.radius * 0.34);
    ctx.moveTo(enemy.radius * 0.4, -enemy.radius * 0.4);
    ctx.lineTo(-enemy.radius * 0.22, enemy.radius * 0.35);
    ctx.stroke();
  } else {
    const body = createRadialGradient(ctx, -10, -9, 4, 0, 0, enemy.radius * 1.8, palette.body);
    body.addColorStop(0, palette.glow);
    body.addColorStop(0.42, palette.body);
    body.addColorStop(1, palette.shadow);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, enemy.radius * 0.92, enemy.radius * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius * 0.72, -0.8, 0.8);
    ctx.stroke();
    ctx.fillStyle = enemy.type === 'mist-armor-general' ? palette.accent : '#C9493D';
    ctx.beginPath();
    ctx.arc(enemy.radius * 0.56, -8, 4, 0, Math.PI * 2);
    ctx.arc(enemy.radius * 0.56, 8, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEnemySprite(ctx, state, enemy) {
  const sprite = getEnemySprite(enemy.type);
  const meta = ENEMY_SPRITES[enemy.type];
  if (!sprite || !meta) return false;

  const frame = meta.frames
    ? Math.floor((state.gameTime * 10 + enemy.seed * meta.frames) % meta.frames)
    : 0;
  const sx = meta.sx ?? frame * meta.frameWidth;
  const sy = meta.sy ?? 0;
  const drawSizeByType = {
    'lamp-shadow': 46,
    'paper-doll': 42,
    'well-shadow': 50
  };
  const drawSize = drawSizeByType[enemy.type] ?? enemy.radius * 2.2;

  ctx.save();
  ctx.rotate(-Math.PI / 2);
  const visual = getEnemyVisual(enemy.type);
  ctx.shadowBlur = enemy.type === 'lamp-shadow' ? 18 : 14;
  ctx.shadowColor = visual.fallback.palette.glow;
  ctx.drawImage(
    sprite,
    sx,
    sy,
    meta.frameWidth,
    meta.frameHeight,
    -drawSize / 2,
    -drawSize / 2,
    drawSize,
    drawSize
  );
  drawEnemyModeledOverlay(ctx, enemy, visual);
  ctx.restore();
  return true;
}

function drawEnemyModeledOverlay(ctx, enemy, visual) {
  const palette = visual.fallback.palette;
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, enemy.radius * 0.9, enemy.radius * 1.12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawEnemyHealthBar(ctx, enemy) {
  if (enemy.hp < enemy.maxHp) {
    const barW = enemy.radius * 2;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 12, barW, 6);
    ctx.fillStyle = '#C9493D';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 12, barW * (enemy.hp / enemy.maxHp), 6);
  }
}

function drawDroppedWeapons(ctx, state, droppedWeapons) {
  droppedWeapons.forEach((weapon) => {
    ctx.save();
    ctx.translate(weapon.x, weapon.y);
    if (weapon.isFlying) {
      ctx.rotate((state.gameTime * 30) % (Math.PI * 2));
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#54C6B2';
    } else {
      ctx.rotate(weapon.angle ?? -Math.PI * 0.18);
    }
    drawWeaponSkin(ctx, weapon.weaponId ?? state.selectedWeapon, { originX: -22, scale: 0.9, glow: weapon.isFlying });
    ctx.restore();
  });
}

function drawWeaponSkin(ctx, weaponId, options = {}) {
  const weapon = getWeaponDefinition(weaponId);
  const visual = getWeaponVisual(weapon.id);
  const { originX = 11, scale = 1, glow = false } = options;

  ctx.save();
  ctx.translate(originX, 0);
  if (typeof ctx.scale === 'function') {
    ctx.scale(scale, scale);
  }

  if (glow) {
    ctx.shadowBlur = 12;
    ctx.shadowColor = visual.fallback.palette.glow ?? weapon.visual?.color ?? '#f7f1d2';
  }

  if (weapon.id === 'blade') {
    drawBladeSkin(ctx, visual);
  } else if (weapon.id === 'spear') {
    drawSpearSkin(ctx, visual);
  } else {
    drawSwordSkin(ctx, visual);
  }

  ctx.restore();
}

function drawSwordSkin(ctx, visual) {
  const palette = visual.fallback.palette;
  drawGrip(ctx, -4, 14, palette);

  ctx.strokeStyle = palette.guard;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(12, -8);
  ctx.lineTo(12, 8);
  ctx.stroke();

  const blade = createWeaponGradient(ctx, 14, 0, 64, 0, palette.metal);
  blade.addColorStop(0, palette.edge);
  blade.addColorStop(0.5, palette.metal);
  blade.addColorStop(1, '#d9e5df');
  ctx.fillStyle = blade;
  ctx.strokeStyle = '#f8f1dc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(14, -5);
  ctx.lineTo(56, -3);
  ctx.lineTo(66, 0);
  ctx.lineTo(56, 3);
  ctx.lineTo(14, 5);
  closeWeaponPath(ctx, 14, -5);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(37, 52, 44, 0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(17, 0);
  ctx.lineTo(57, 0);
  ctx.stroke();
}

function drawBladeSkin(ctx, visual) {
  const palette = visual.fallback.palette;
  drawGrip(ctx, -6, 15, palette);

  ctx.strokeStyle = palette.guard;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(11, -7);
  ctx.lineTo(12, 8);
  ctx.stroke();

  const blade = createWeaponGradient(ctx, 15, -7, 64, 8, palette.metal);
  blade.addColorStop(0, palette.edge);
  blade.addColorStop(0.38, palette.metal);
  blade.addColorStop(1, '#fff6d6');
  ctx.fillStyle = blade;
  ctx.strokeStyle = '#f7f1d2';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(14, -6);
  drawCurve(ctx, 39, -12, 62, -4);
  drawCurve(ctx, 66, 2, 57, 9);
  drawCurve(ctx, 35, 7, 15, 6);
  closeWeaponPath(ctx, 14, -6);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(37, 52, 44, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(17, -4);
  drawCurve(ctx, 38, -8, 56, -3);
  ctx.stroke();
}

function drawSpearSkin(ctx, visual) {
  const palette = visual.fallback.palette;
  ctx.strokeStyle = palette.shaft;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(67, 0);
  ctx.stroke();

  ctx.strokeStyle = '#D7A84B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(13, 0);
  ctx.lineTo(58, 0);
  ctx.stroke();

  ctx.fillStyle = palette.tassel;
  ctx.beginPath();
  ctx.moveTo(60, 0);
  ctx.lineTo(49, -8);
  ctx.lineTo(52, 0);
  ctx.lineTo(49, 8);
  closeWeaponPath(ctx, 60, 0);
  ctx.fill();

  const head = createWeaponGradient(ctx, 62, 0, 88, 0, palette.metal);
  head.addColorStop(0, palette.edge);
  head.addColorStop(0.55, palette.metal);
  head.addColorStop(1, '#d5ded9');
  ctx.fillStyle = head;
  ctx.strokeStyle = '#f7f1d2';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(62, -8);
  ctx.lineTo(88, 0);
  ctx.lineTo(62, 8);
  ctx.lineTo(67, 0);
  closeWeaponPath(ctx, 62, -8);
  ctx.fill();
  ctx.stroke();
}

function drawGrip(ctx, x, length, palette = {}) {
  ctx.strokeStyle = palette.grip ?? '#6f4424';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x + length, 0);
  ctx.stroke();

  ctx.strokeStyle = '#D7A84B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 2, -3);
  ctx.lineTo(x + length - 2, 3);
  ctx.moveTo(x + 2, 3);
  ctx.lineTo(x + length - 2, -3);
  ctx.stroke();
}

function createWeaponGradient(ctx, x0, y0, x1, y1, fallbackColor) {
  return createLinearGradient(ctx, x0, y0, x1, y1, fallbackColor);
}

function createLinearGradient(ctx, x0, y0, x1, y1, fallbackColor) {
  if (typeof ctx.createLinearGradient === 'function') {
    return ctx.createLinearGradient(x0, y0, x1, y1);
  }
  return {
    addColorStop() {},
    toString() {
      return fallbackColor;
    }
  };
}

function createRadialGradient(ctx, x0, y0, r0, x1, y1, r1, fallbackColor) {
  if (typeof ctx.createRadialGradient === 'function') {
    return ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }
  return {
    addColorStop() {},
    toString() {
      return fallbackColor;
    }
  };
}

function drawCurve(ctx, cpx, cpy, x, y) {
  if (typeof ctx.quadraticCurveTo === 'function') {
    ctx.quadraticCurveTo(cpx, cpy, x, y);
  } else {
    ctx.lineTo(x, y);
  }
}

function closeWeaponPath(ctx, startX, startY) {
  if (typeof ctx.closePath === 'function') {
    ctx.closePath();
  } else {
    ctx.lineTo(startX, startY);
  }
}

function strokeRect(ctx, x, y, width, height) {
  if (typeof ctx.strokeRect === 'function') {
    ctx.strokeRect(x, y, width, height);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function drawProjectiles(ctx, projectiles) {
  projectiles.forEach((projectile) => {
    ctx.save();
    if (projectile.type === 'explosion') {
      ctx.fillStyle = `rgba(215, 168, 75, ${projectile.duration / 20})`;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (projectile.type === 'wave') {
      drawModeledSwordWave(ctx, projectile);
    } else if (projectile.type === 'ult_line' || projectile.type === 'ult_chain') {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#54C6B2';
      ctx.strokeStyle = projectile.type === 'ult_line' ? '#54C6B2' : '#D7A84B';
      ctx.lineWidth = projectile.type === 'ult_line' ? 10 * (projectile.duration / 20) : 3;
      ctx.beginPath();
      ctx.moveTo(projectile.x1, projectile.y1);
      ctx.lineTo(projectile.x2, projectile.y2);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawModeledSwordWave(ctx, projectile) {
  const visual = getEffectVisual('swordWave').fallback.palette;
  const angle = Math.atan2(projectile.vy, projectile.vx);
  ctx.translate(projectile.x, projectile.y);
  ctx.rotate(angle);
  ctx.shadowBlur = 24;
  ctx.shadowColor = projectile.color ?? visual.glow;
  const wave = createLinearGradient(ctx, -projectile.radius, 0, projectile.radius, 0, projectile.color ?? visual.glow);
  wave.addColorStop(0, 'rgba(244, 239, 224, 0)');
  wave.addColorStop(0.42, projectile.color ?? visual.glow);
  wave.addColorStop(0.58, visual.core);
  wave.addColorStop(1, 'rgba(244, 239, 224, 0)');
  ctx.fillStyle = wave;
  ctx.beginPath();
  ctx.ellipse(0, 0, projectile.radius * 1.05, Math.max(8, projectile.radius * 0.32), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = visual.core;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-projectile.radius * 0.72, 0);
  ctx.lineTo(projectile.radius * 0.88, 0);
  ctx.stroke();
}

function drawParticles(ctx, particles) {
  particles.forEach((particle) => {
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawDamageTexts(ctx, damageTexts) {
  damageTexts.forEach((text) => {
    ctx.globalAlpha = text.alpha;
    ctx.fillStyle = text.color;
    ctx.font = `bold ${text.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text.text, text.x, text.y);
  });
  ctx.globalAlpha = 1;
}
