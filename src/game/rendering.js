import { WEAPON_IDS, getWeaponDefinition } from './weapons.js';
import {
  getEffectVisual,
  getEnemyVisual,
  getPlayerAction,
  getPlayerVisual,
  getScenePropVisual,
  getWeaponVisual
} from './visualAssets.js';

const PLAYER_SPRITE = createSpriteState(getPlayerVisual().sprite);

const ORBITING_WEAPON_IDS = ['sword', 'blade', 'spear', 'daggers', 'ring', 'fan'];

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

  drawAncientCityWallpaper(ctx, canvas);

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

  drawWorldGround(ctx, canvas, camera, cityMap);
  drawCityBounds(ctx, cityMap);
  drawScenicRoutes(ctx, cityMap.landmarks);
  drawCanals(ctx, cityMap.canals);
  drawRoads(ctx, cityMap.roads);
  drawBridges(ctx, cityMap.bridges);
  drawBuildings(ctx, cityMap.buildings);
  drawCityDecorations(ctx, cityMap.decorations);
  drawTerrainDecorations(ctx, canvas, camera, terrain.decorations);
  drawLandmarkLabels(ctx, cityMap.landmarks);
}

function drawWorldGround(ctx, canvas, camera, cityMap) {
  const viewBuffer = 160;
  const viewX = camera.x - viewBuffer;
  const viewY = camera.y - viewBuffer;
  const viewWidth = canvas.width + viewBuffer * 2;
  const viewHeight = canvas.height + viewBuffer * 2;

  const ground = createLinearGradient(ctx, viewX, viewY, viewX, viewY + viewHeight, '#171d19');
  ground.addColorStop(0, '#20251f');
  ground.addColorStop(0.46, '#18231d');
  ground.addColorStop(1, '#111713');
  ctx.fillStyle = ground;
  ctx.fillRect(viewX, viewY, viewWidth, viewHeight);

  drawMovingStoneTexture(ctx, viewX, viewY, viewWidth, viewHeight);
  drawWorldMist(ctx, viewX, viewY, viewWidth, viewHeight);

  if (cityMap.cityBounds) {
    const bounds = cityMap.cityBounds;
    ctx.fillStyle = 'rgba(7, 10, 9, 0.42)';
    ctx.fillRect(viewX, viewY, viewWidth, Math.max(0, bounds.y - viewY));
    ctx.fillRect(viewX, bounds.y + bounds.height, viewWidth, Math.max(0, viewY + viewHeight - bounds.y - bounds.height));
    ctx.fillRect(viewX, viewY, Math.max(0, bounds.x - viewX), viewHeight);
    ctx.fillRect(bounds.x + bounds.width, viewY, Math.max(0, viewX + viewWidth - bounds.x - bounds.width), viewHeight);
  }
}

function drawMovingStoneTexture(ctx, viewX, viewY, viewWidth, viewHeight) {
  const tile = 96;
  const startX = Math.floor(viewX / tile) * tile;
  const startY = Math.floor(viewY / tile) * tile;
  const endX = viewX + viewWidth;
  const endY = viewY + viewHeight;

  ctx.strokeStyle = 'rgba(244, 239, 224, 0.055)';
  ctx.lineWidth = 1;
  for (let x = startX; x <= endX; x += tile) {
    ctx.beginPath();
    ctx.moveTo(x, viewY);
    ctx.lineTo(x + Math.sin(x * 0.003) * 24, endY);
    ctx.stroke();
  }
  for (let y = startY; y <= endY; y += tile) {
    ctx.beginPath();
    ctx.moveTo(viewX, y);
    ctx.lineTo(endX, y + Math.cos(y * 0.003) * 18);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(215, 168, 75, 0.1)';
  for (let x = startX; x <= endX; x += tile) {
    for (let y = startY; y <= endY; y += tile) {
      const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const rand = seed - Math.floor(seed);
      if (rand > 0.76) {
        ctx.fillRect(x + 18 + rand * 28, y + 18 + (1 - rand) * 34, 3, 3);
      }
    }
  }
}

function drawWorldMist(ctx, viewX, viewY, viewWidth, viewHeight) {
  ctx.strokeStyle = 'rgba(180, 200, 220, 0.09)';
  ctx.lineWidth = 28;
  for (let i = 0; i < 5; i += 1) {
    const y = viewY + ((i + 1) * viewHeight) / 6;
    ctx.beginPath();
    ctx.moveTo(viewX, y + Math.sin((viewX + i * 190) * 0.002) * 24);
    ctx.lineTo(viewX + viewWidth, y + Math.cos((viewX + i * 130) * 0.002) * 24);
    ctx.stroke();
  }
}

function drawScenicRoutes(ctx, landmarks) {
  const routeIds = landmarks.route ?? ['old-street', 'ancient-well', 'city-tower'];
  const route = routeIds.map((id) => landmarks[id]).filter(Boolean);
  if (route.length < 2) return;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(16, 22, 19, 0.65)';
  ctx.lineWidth = 64;
  strokeRoute(ctx, route);

  ctx.strokeStyle = 'rgba(215, 168, 75, 0.32)';
  ctx.lineWidth = 40;
  strokeRoute(ctx, route);

  ctx.strokeStyle = 'rgba(244, 239, 224, 0.14)';
  ctx.lineWidth = 2;
  strokeRoute(ctx, route);
  ctx.restore();
}

function strokeRoute(ctx, route) {
  ctx.beginPath();
  ctx.moveTo(route[0].x, route[0].y);
  for (let i = 1; i < route.length; i += 1) {
    const previous = route[i - 1];
    const point = route[i];
    const midX = (previous.x + point.x) / 2;
    const midY = (previous.y + point.y) / 2;
    drawCurve(ctx, midX, previous.y, midX, midY);
    drawCurve(ctx, midX, point.y, point.x, point.y);
  }
  ctx.stroke();
}

function drawAncientCityWallpaper(ctx, canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const horizonY = height * 0.62;

  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#0b1226');
  sky.addColorStop(0.55, '#1a2347');
  sky.addColorStop(1, '#3a3556');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizonY);

  drawMoon(ctx, width * 0.78, height * 0.18, Math.min(80, height * 0.11));
  drawStarfield(ctx, 0, 0, width, horizonY);
  drawDistantMountains(ctx, 0, horizonY, width);
  drawCitySilhouette(ctx, 0, horizonY, width);

  const ground = ctx.createLinearGradient(0, horizonY, 0, height);
  ground.addColorStop(0, '#241a1f');
  ground.addColorStop(0.4, '#181618');
  ground.addColorStop(1, '#0f0d11');
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizonY, width, height - horizonY);

  drawGroundTexture(ctx, 0, horizonY, width, height - horizonY);
  drawMistBands(ctx, 0, horizonY, width);
}

function drawMoon(ctx, cx, cy, radius) {
  const halo = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 3.4);
  halo.addColorStop(0, 'rgba(247, 232, 196, 0.45)');
  halo.addColorStop(0.4, 'rgba(247, 232, 196, 0.12)');
  halo.addColorStop(1, 'rgba(247, 232, 196, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 3.4, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.2, cx, cy, radius);
  body.addColorStop(0, '#fff7d8');
  body.addColorStop(0.7, '#f5e2a5');
  body.addColorStop(1, '#c9a96b');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawStarfield(ctx, x, y, width, height) {
  ctx.fillStyle = 'rgba(244, 239, 224, 0.85)';
  const cols = 22;
  const rows = 9;
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const seed = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      const rand = seed - Math.floor(seed);
      if (rand > 0.78) {
        const sx = x + (i + (rand * 7) % 1) * (width / cols);
        const sy = y + (j + ((rand * 13) % 1)) * (height / rows);
        const r = rand > 0.95 ? 1.8 : 0.9;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawDistantMountains(ctx, x, horizonY, width) {
  ctx.fillStyle = '#2a2a4a';
  ctx.beginPath();
  ctx.moveTo(x, horizonY);
  const peaks = 8;
  for (let i = 0; i <= peaks; i += 1) {
    const px = x + (width * i) / peaks;
    const py = horizonY - 120 - Math.sin(i * 1.3) * 60 - ((i % 2) ? 30 : 0);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(x + width, horizonY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#1d2238';
  ctx.beginPath();
  ctx.moveTo(x, horizonY);
  const front = 12;
  for (let i = 0; i <= front; i += 1) {
    const px = x + (width * i) / front;
    const py = horizonY - 70 - Math.sin(i * 1.7 + 0.5) * 40 - ((i % 3 === 0) ? 35 : 0);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(x + width, horizonY);
  ctx.closePath();
  ctx.fill();
}

function drawCitySilhouette(ctx, x, horizonY, width) {
  ctx.fillStyle = '#0d0e18';
  const buildings = [
    { w: 140, h: 90, type: 'wall' },
    { w: 180, h: 150, type: 'tower' },
    { w: 220, h: 70, type: 'wall' },
    { w: 110, h: 60, type: 'wall' },
    { w: 260, h: 130, type: 'gate' },
    { w: 150, h: 95, type: 'wall' },
    { w: 200, h: 165, type: 'pagoda' },
    { w: 180, h: 80, type: 'wall' },
    { w: 240, h: 110, type: 'tower' },
    { w: 160, h: 70, type: 'wall' },
    { w: 220, h: 100, type: 'wall' },
    { w: 170, h: 140, type: 'tower' },
    { w: 200, h: 70, type: 'wall' },
    { w: 240, h: 95, type: 'wall' }
  ];

  let cursor = x - 60;
  const baseY = horizonY;
  buildings.forEach((b) => {
    if (cursor > x + width) return;
    const top = baseY - b.h;
    ctx.fillRect(cursor, top, b.w, b.h);

    if (b.type === 'tower' || b.type === 'gate') {
      ctx.beginPath();
      ctx.moveTo(cursor - 8, top);
      ctx.lineTo(cursor + b.w / 2, top - 36);
      ctx.lineTo(cursor + b.w + 8, top);
      ctx.closePath();
      ctx.fill();
    }

    if (b.type === 'pagoda') {
      let py = top;
      let pw = b.w;
      for (let layer = 0; layer < 4; layer += 1) {
        ctx.beginPath();
        ctx.moveTo(cursor + (b.w - pw) / 2 - 10, py);
        ctx.lineTo(cursor + b.w / 2, py - 22);
        ctx.lineTo(cursor + b.w - (b.w - pw) / 2 + 10, py);
        ctx.closePath();
        ctx.fill();
        py -= 30;
        pw -= 30;
        if (pw < 30) break;
        ctx.fillRect(cursor + (b.w - pw) / 2, py, pw, 26);
        py -= 0;
      }
    }

    cursor += b.w + 6;
  });

  ctx.save();
  ctx.fillStyle = 'rgba(215, 168, 75, 0.55)';
  for (let i = 0; i < 28; i += 1) {
    const lx = x + (i / 28) * width + Math.sin(i) * 30;
    const ly = horizonY - 14 - ((i * 53) % 90);
    ctx.fillRect(lx, ly, 3, 3);
  }
  ctx.restore();
}

function drawGroundTexture(ctx, x, y, width, height) {
  ctx.strokeStyle = 'rgba(244, 239, 224, 0.05)';
  ctx.lineWidth = 1;
  for (let row = 0; row < 14; row += 1) {
    const ry = y + (height * row) / 14;
    ctx.beginPath();
    ctx.moveTo(x, ry);
    ctx.lineTo(x + width, ry + Math.sin(row) * 18);
    ctx.stroke();
  }
}

function drawMistBands(ctx, x, horizonY, width) {
  for (let i = 0; i < 4; i += 1) {
    const my = horizonY + 30 + i * 70;
    const mist = ctx.createLinearGradient(0, my - 30, 0, my + 50);
    mist.addColorStop(0, 'rgba(180, 200, 220, 0)');
    mist.addColorStop(0.5, `rgba(180, 200, 220, ${0.12 - i * 0.022})`);
    mist.addColorStop(1, 'rgba(180, 200, 220, 0)');
    ctx.fillStyle = mist;
    ctx.fillRect(x, my - 30, width, 80);
  }
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
  const routeIds = landmarks.route ?? ['old-street', 'ancient-well', 'city-tower'];
  routeIds.forEach((id) => {
    const landmark = landmarks[id];
    if (!landmark) return;
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

  if (player.hasWeapon) {
    drawOrbitingWeapons(ctx, state, aimAngle);
  }

  drawPlayerBody(ctx, action, gameTime);

  ctx.restore();

  if (player.isSwingAnimating) {
    ctx.save();
    ctx.translate(player.x, player.y);
    drawModeledSlashArc(ctx, player);
    ctx.restore();
  }
}

function drawOrbitingWeapons(ctx, state, aimAngle) {
  const { player, gameTime } = state;
  const scale = Math.min(1.25, player.rangeMult);
  const orbitRadius = (player.radius + 25) * scale;
  const attackProgress = player.isSwingAnimating
    ? 1 - Math.max(0, player.swingTimer) / 10
    : 0;
  const idleOrbit = gameTime * 2.4;
  const swingOrbit = lerpAngle(player.swingStart, player.swingEnd, easeOutCubic(attackProgress));
  const selectedIndex = Math.max(0, ORBITING_WEAPON_IDS.indexOf(state.weapon.id));
  const step = (Math.PI * 2) / ORBITING_WEAPON_IDS.length;
  const baseOrbitAngle = player.isSwingAnimating ? swingOrbit - selectedIndex * step : aimAngle + idleOrbit;

  ORBITING_WEAPON_IDS.forEach((weaponId, index) => {
    const orbitAngle = baseOrbitAngle + index * step;
    const active = player.isSwingAnimating && index === selectedIndex;
    drawOrbitingWeapon(ctx, weaponId, orbitRadius, orbitAngle, scale, active);
  });
}

function drawOrbitingWeapon(ctx, weaponId, orbitRadius, orbitAngle, scale, active) {
  const orbitX = Math.cos(orbitAngle) * orbitRadius;
  const orbitY = Math.sin(orbitAngle) * orbitRadius;

  drawWeaponOrbitTrail(ctx, weaponId, orbitRadius, orbitAngle, active);

  ctx.save();
  ctx.translate(orbitX, orbitY);
  ctx.rotate(orbitAngle + Math.PI / 2);
  drawWeaponSkin(ctx, weaponId, { originX: -10, scale, glow: true });
  ctx.restore();
}

function drawWeaponOrbitTrail(ctx, weaponId, orbitRadius, orbitAngle, active) {
  const visual = getWeaponVisual(weaponId).fallback.palette;
  ctx.save();
  ctx.globalAlpha = active ? 0.46 : 0.24;
  ctx.strokeStyle = visual.glow ?? '#54C6B2';
  ctx.lineWidth = active ? 5 : 2;
  ctx.beginPath();
  ctx.arc(0, 0, orbitRadius, orbitAngle - 0.75, orbitAngle + 0.18);
  ctx.stroke();
  ctx.restore();
}

function drawPlayerBody(ctx, action, gameTime) {
  const visual = getPlayerVisual();
  const sprite = visual.fallback.mode === 'anime-comic-canvas' ? null : getPlayerSprite();
  if (!sprite) {
    drawAnimeHeroFallback(ctx, action, gameTime);
    return;
  }

  const directionFrame = 0;
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
  drawHeroComicOverlay(ctx, action, gameTime);
  ctx.restore();
}

function drawAnimeHeroFallback(ctx, action, gameTime) {
  const palette = getPlayerVisual().fallback.palette;
  const bob = action === 'run' ? Math.sin(gameTime * 12) * 2.5 : Math.sin(gameTime * 4) * 1.2;
  const attackLean = action.startsWith('attack') ? 0.16 : 0;
  const runStep = action === 'run' ? Math.sin(gameTime * 14) : 0;

  ctx.save();
  ctx.translate(0, bob);

  ctx.shadowBlur = action.startsWith('attack') ? 20 : 10;
  ctx.shadowColor = action.startsWith('attack') ? palette.trim : 'rgba(0,0,0,0.48)';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(-2, 32, 19, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 4;
  ctx.fillStyle = palette.coatShadow;
  ctx.beginPath();
  ctx.moveTo(-18, -6);
  ctx.quadraticCurveTo(-30, 12 + runStep * 3, -21, 31);
  ctx.lineTo(-5, 24);
  ctx.lineTo(13, 31);
  ctx.quadraticCurveTo(25, 14 - runStep * 3, 16, -5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = palette.coat;
  ctx.beginPath();
  ctx.moveTo(-14, -9);
  ctx.quadraticCurveTo(1, -18, 17, -8);
  ctx.lineTo(14 + attackLean * 16, 19);
  ctx.quadraticCurveTo(1, 30, -13, 19);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = palette.trim;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-10, -3);
  ctx.lineTo(10, 17);
  ctx.moveTo(10, -3);
  ctx.lineTo(-8, 18);
  ctx.stroke();

  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 4;
  ctx.fillStyle = palette.scabbard ?? palette.hair;
  ctx.beginPath();
  ctx.moveTo(-22, 6);
  ctx.lineTo(-31, 20 + runStep * 4);
  ctx.moveTo(20, 6);
  ctx.lineTo(30, 18 - runStep * 4);
  ctx.stroke();

  ctx.fillStyle = palette.skin;
  ctx.beginPath();
  ctx.arc(25, 18 - runStep * 4, 4.5, 0, Math.PI * 2);
  ctx.arc(-26, 20 + runStep * 4, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-8, 26);
  ctx.lineTo(-15, 39 + Math.max(0, runStep) * 3);
  ctx.moveTo(8, 26);
  ctx.lineTo(15, 39 + Math.max(0, -runStep) * 3);
  ctx.stroke();

  ctx.fillStyle = palette.skin;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.ellipse(3, -25, 13, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = palette.hair;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-10, -33);
  ctx.quadraticCurveTo(2, -48, 18, -34);
  ctx.quadraticCurveTo(23, -24, 15, -14);
  ctx.lineTo(11, -28);
  ctx.lineTo(5, -15);
  ctx.lineTo(-1, -30);
  ctx.lineTo(-9, -15);
  ctx.quadraticCurveTo(-17, -26, -10, -33);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = palette.hairHighlight;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(3, -42);
  ctx.quadraticCurveTo(12, -39, 16, -30);
  ctx.stroke();

  ctx.fillStyle = palette.eye;
  ctx.beginPath();
  ctx.ellipse(8, -25, 2.8, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.highlight;
  ctx.beginPath();
  ctx.arc(9, -27, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(3, -26);
  ctx.lineTo(12, -29);
  ctx.stroke();

  ctx.fillStyle = palette.blush;
  ctx.globalAlpha = 0.42;
  ctx.beginPath();
  ctx.ellipse(13, -20, 3.5, 1.8, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = palette.scarf;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-8, -12);
  ctx.lineTo(13, -13);
  ctx.lineTo(24, -4 + Math.sin(gameTime * 7) * 2);
  ctx.lineTo(7, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawHeroComicOverlay(ctx, action, gameTime) {
  const palette = getPlayerVisual().fallback.palette;
  ctx.save();
  ctx.globalAlpha = action.startsWith('attack') ? 0.9 : 0.7;
  ctx.strokeStyle = palette.trim;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-15, -18 + Math.sin(gameTime * 8) * 1.5);
  ctx.quadraticCurveTo(-1, -7, 13, 8);
  ctx.moveTo(-12, 8);
  ctx.quadraticCurveTo(0, -2, 12, -17);
  ctx.stroke();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = palette.eye;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(4, -25, 18, -0.2, 0.45);
  ctx.stroke();
  ctx.restore();
}

function easeOutCubic(value) {
  const t = Math.max(0, Math.min(1, value));
  return 1 - (1 - t) ** 3;
}

function lerpAngle(start, end, progress) {
  return start + (end - start) * progress;
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
  const visual = getWeaponVisual(weaponId);
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

  if (weaponId === 'blade') {
    drawBladeSkin(ctx, visual);
  } else if (weaponId === 'spear') {
    drawSpearSkin(ctx, visual);
  } else if (weaponId === 'daggers') {
    drawDaggersSkin(ctx, visual);
  } else if (weaponId === 'ring') {
    drawRingBladeSkin(ctx, visual);
  } else if (weaponId === 'fan') {
    drawFanSkin(ctx, visual);
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

function drawDaggersSkin(ctx, visual) {
  const palette = visual.fallback.palette;

  drawSingleDagger(ctx, palette, -8, -8, -0.35);
  drawSingleDagger(ctx, palette, -8, 8, 0.35);

  ctx.strokeStyle = palette.glow;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.moveTo(8, -8);
  ctx.lineTo(27, -14);
  ctx.moveTo(8, 8);
  ctx.lineTo(27, 14);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawSingleDagger(ctx, palette, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  drawGrip(ctx, -4, 12, palette);
  const blade = createWeaponGradient(ctx, 9, 0, 42, 0, palette.metal);
  blade.addColorStop(0, palette.edge);
  blade.addColorStop(0.52, palette.metal);
  blade.addColorStop(1, '#ffffff');
  ctx.fillStyle = blade;
  ctx.strokeStyle = palette.edge;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(9, -4);
  ctx.lineTo(36, -2);
  ctx.lineTo(46, 0);
  ctx.lineTo(36, 2);
  ctx.lineTo(9, 4);
  closeWeaponPath(ctx, 9, -4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRingBladeSkin(ctx, visual) {
  const palette = visual.fallback.palette;
  const ring = createWeaponGradient(ctx, -26, 0, 34, 0, palette.metal);
  ring.addColorStop(0, palette.edge);
  ring.addColorStop(0.5, palette.metal);
  ring.addColorStop(1, palette.guard);

  ctx.strokeStyle = ring;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(18, 0, 22, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = palette.glow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(18, 0, 13, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = palette.edge;
  for (let i = 0; i < 4; i += 1) {
    const angle = (Math.PI / 2) * i;
    ctx.save();
    ctx.translate(18 + Math.cos(angle) * 24, Math.sin(angle) * 24);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(13, 0);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawFanSkin(ctx, visual) {
  const palette = visual.fallback.palette;
  ctx.fillStyle = palette.paper;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.arc(20, 0, 30, -0.75, 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = palette.guard;
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i += 1) {
    const angle = i * 0.28;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(20 + Math.cos(angle) * 28, Math.sin(angle) * 28);
    ctx.stroke();
  }

  ctx.fillStyle = palette.seal;
  ctx.beginPath();
  ctx.arc(24, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.guard;
  ctx.beginPath();
  ctx.arc(-5, 0, 4, 0, Math.PI * 2);
  ctx.fill();
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
