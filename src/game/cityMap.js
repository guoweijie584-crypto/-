export const SUZHOU_CITY_MAP = {
  cityBounds: { x: -1900, y: -1900, width: 3800, height: 3800 },
  roads: [
    { id: 'pingjiang-road', kind: 'street', x: 760, y: -1500, width: 150, height: 1300 },
    { id: 'pingjiang-cross-north', kind: 'lane', x: 520, y: -1280, width: 640, height: 96 },
    { id: 'pingjiang-cross-south', kind: 'lane', x: 430, y: -760, width: 760, height: 92 },
    { id: 'well-main-street', kind: 'street', x: 100, y: -520, width: 150, height: 1040 },
    { id: 'well-square', kind: 'square', x: -90, y: -130, width: 520, height: 420 },
    { id: 'well-to-panmen-lane', kind: 'street', x: -980, y: 500, width: 1320, height: 130 },
    { id: 'panmen-court', kind: 'square', x: -1500, y: 720, width: 700, height: 520 },
    { id: 'panmen-gate-road', kind: 'street', x: -1220, y: 560, width: 150, height: 640 }
  ],
  canals: [
    { id: 'pingjiang-canal', x: 560, y: -1560, width: 90, height: 1420 },
    { id: 'central-canal', x: 330, y: -620, width: 86, height: 1080 },
    { id: 'south-moat', x: -1780, y: 1180, width: 2860, height: 170 },
    { id: 'west-moat', x: -1780, y: -1380, width: 155, height: 2700 }
  ],
  bridges: [
    { id: 'pingjiang-north-bridge', x: 525, y: -1274, width: 150, height: 88 },
    { id: 'pingjiang-south-bridge', x: 520, y: -754, width: 150, height: 86 },
    { id: 'well-stone-bridge', x: 312, y: -36, width: 130, height: 86 },
    { id: 'panmen-water-gate-bridge', x: -1235, y: 1140, width: 210, height: 240 }
  ],
  buildings: [
    { id: 'old-street-shops-west', kind: 'shops', x: 670, y: -1510, width: 70, height: 1180 },
    { id: 'old-street-shops-east', kind: 'shops', x: 930, y: -1450, width: 220, height: 520 },
    { id: 'old-street-houses-east', kind: 'houses', x: 940, y: -850, width: 240, height: 430 },
    { id: 'garden-wall-north', kind: 'garden', x: -180, y: -720, width: 450, height: 120 },
    { id: 'garden-wall-east', kind: 'garden', x: 430, y: -520, width: 160, height: 620 },
    { id: 'well-houses-west', kind: 'houses', x: -330, y: -460, width: 260, height: 320 },
    { id: 'well-houses-south', kind: 'houses', x: -270, y: 320, width: 530, height: 150 },
    { id: 'panmen-wall-west', kind: 'wall', x: -1600, y: 540, width: 170, height: 780 },
    { id: 'panmen-wall-south', kind: 'wall', x: -1580, y: 1020, width: 840, height: 170 },
    { id: 'panmen-tower', kind: 'tower', x: -1320, y: 700, width: 330, height: 250 },
    { id: 'panmen-water-wall', kind: 'wall', x: -920, y: 920, width: 180, height: 330 }
  ],
  landmarks: {
    'old-street': { id: 'old-street', title: '平江路老街', x: 835, y: -1110 },
    'ancient-well': { id: 'ancient-well', title: '古井广场', x: 145, y: 60 },
    'city-tower': { id: 'city-tower', title: '盘门水陆城门', x: -1160, y: 850 },
    'old-street-lamps': [
      { id: 'lamp-1', x: 820, y: -1320 },
      { id: 'lamp-2', x: 850, y: -1030 },
      { id: 'lamp-3', x: 805, y: -720 }
    ],
    'echo-fragments': [
      { id: 'echo-1', x: 110, y: -250 },
      { id: 'echo-2', x: 290, y: -50 },
      { id: 'echo-3', x: 130, y: 160 },
      { id: 'echo-4', x: -80, y: 80 },
      { id: 'echo-5', x: 305, y: 265 }
    ],
    talismans: [
      { id: 'talisman-1', x: -1380, y: 840 },
      { id: 'talisman-2', x: -1095, y: 640 },
      { id: 'talisman-3', x: -850, y: 820 }
    ],
    spawnPoints: [
      { x: 820, y: -1460 },
      { x: 1030, y: -1220 },
      { x: 760, y: -620 },
      { x: 125, y: -430 },
      { x: 315, y: 180 },
      { x: -160, y: 80 },
      { x: -980, y: 545 },
      { x: -1450, y: 820 },
      { x: -900, y: 620 }
    ]
  },
  decorations: [
    { type: 'willow', x: 520, y: -1370 },
    { type: 'willow', x: 455, y: -560 },
    { type: 'lantern', x: 880, y: -1385 },
    { type: 'lantern', x: 880, y: -840 },
    { type: 'boat', x: 585, y: -430 },
    { type: 'boat', x: -1540, y: 1215 },
    { type: 'stone', x: 40, y: 250 },
    { type: 'tree', x: -1250, y: 630 }
  ]
};

export function getLandmarkPosition(id) {
  return SUZHOU_CITY_MAP.landmarks[id] ?? { x: 0, y: 0 };
}

export function getStageObjectivePoints(type) {
  if (type === 'lamps') return SUZHOU_CITY_MAP.landmarks['old-street-lamps'];
  if (type === 'echo-fragments') return SUZHOU_CITY_MAP.landmarks['echo-fragments'];
  if (type === 'talismans') return SUZHOU_CITY_MAP.landmarks.talismans;
  return [];
}

export function getPassableSpawnPoint(reference = { x: 0, y: 0 }, minDistance = 520) {
  const points = SUZHOU_CITY_MAP.landmarks.spawnPoints.filter((point) => {
    const dx = point.x - reference.x;
    const dy = point.y - reference.y;
    return Math.sqrt(dx * dx + dy * dy) >= minDistance && !isBlockedCircle(point.x, point.y, 24);
  });
  const pool = points.length > 0 ? points : SUZHOU_CITY_MAP.landmarks.spawnPoints;
  return pool[Math.floor(Math.random() * pool.length)] ?? { x: reference.x + minDistance, y: reference.y };
}

export function isBlockedCircle(x, y, radius = 0) {
  const bounds = SUZHOU_CITY_MAP.cityBounds;
  if (
    x - radius < bounds.x ||
    y - radius < bounds.y ||
    x + radius > bounds.x + bounds.width ||
    y + radius > bounds.y + bounds.height
  ) {
    return true;
  }

  const onBridge = SUZHOU_CITY_MAP.bridges.some((bridge) => circleIntersectsRect(x, y, radius, bridge));
  const inCanal = SUZHOU_CITY_MAP.canals.some((canal) => circleIntersectsRect(x, y, radius, canal));
  if (inCanal && !onBridge) return true;

  return SUZHOU_CITY_MAP.buildings.some((building) => circleIntersectsRect(x, y, radius, building));
}

export function moveCircleWithCollisions(entity, dx, dy, radius = entity.radius ?? 0) {
  const nextX = entity.x + dx;
  if (!isBlockedCircle(nextX, entity.y, radius)) {
    entity.x = nextX;
  }

  const nextY = entity.y + dy;
  if (!isBlockedCircle(entity.x, nextY, radius)) {
    entity.y = nextY;
  }
}

export function resolveBlockedCircle(entity, radius = entity.radius ?? 0, searchStep = 18, maxRings = 8) {
  if (!isBlockedCircle(entity.x, entity.y, radius)) return false;

  for (let ring = 1; ring <= maxRings; ring += 1) {
    const dist = ring * searchStep;
    for (let i = 0; i < 16; i += 1) {
      const angle = (Math.PI * 2 * i) / 16;
      const x = entity.x + Math.cos(angle) * dist;
      const y = entity.y + Math.sin(angle) * dist;
      if (!isBlockedCircle(x, y, radius)) {
        entity.x = x;
        entity.y = y;
        return true;
      }
    }
  }

  return false;
}

export function isSegmentBlocked(x1, y1, x2, y2, radius = 0, step = 12) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const checks = Math.max(1, Math.ceil(distance / step));
  for (let i = 1; i <= checks; i += 1) {
    const t = i / checks;
    if (isBlockedCircle(x1 + dx * t, y1 + dy * t, radius)) return true;
  }
  return false;
}

export function clampToCityBounds(entity, radius = entity.radius ?? 0) {
  const bounds = SUZHOU_CITY_MAP.cityBounds;
  entity.x = Math.max(bounds.x + radius, Math.min(bounds.x + bounds.width - radius, entity.x));
  entity.y = Math.max(bounds.y + radius, Math.min(bounds.y + bounds.height - radius, entity.y));
}

function circleIntersectsRect(cx, cy, radius, rect) {
  const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= radius * radius;
}
