export const SUZHOU_CITY_MAP = {
  cityBounds: { x: -1900, y: -1900, width: 3800, height: 3800 },
  roads: [],
  canals: [],
  bridges: [],
  buildings: [],
  landmarks: {
    'old-street': { id: 'old-street', title: '平江路老街', x: 835, y: -1110 },
    'ancient-well': { id: 'ancient-well', title: '古井广场', x: 145, y: 60 },
    'stone-bridge': { id: 'stone-bridge', title: '水巷石桥', x: 880, y: 620 },
    'garden-maze': { id: 'garden-maze', title: '园林曲径', x: -260, y: 1180 },
    'city-tower': { id: 'city-tower', title: '盘门水陆城门', x: -1160, y: 850 },
    route: ['old-street', 'ancient-well', 'stone-bridge', 'garden-maze', 'city-tower'],
    'old-street-lamps': [
      { id: 'lamp-1', x: 820, y: -1320 },
      { id: 'lamp-2', x: 850, y: -1030 },
      { id: 'lamp-3', x: 805, y: -720 }
    ],
    'well-echo-fragments': [
      { id: 'echo-1', x: 110, y: -250 },
      { id: 'echo-2', x: 290, y: -50 },
      { id: 'echo-3', x: 130, y: 160 },
      { id: 'echo-4', x: -80, y: 80 },
      { id: 'echo-5', x: 305, y: 265 }
    ],
    'bridge-lanterns': [
      { id: 'bridge-lamp-1', x: 720, y: 420 },
      { id: 'bridge-lamp-2', x: 930, y: 470 },
      { id: 'bridge-lamp-3', x: 1040, y: 720 },
      { id: 'bridge-lamp-4', x: 790, y: 825 }
    ],
    'garden-echo-fragments': [
      { id: 'garden-echo-1', x: -470, y: 990 },
      { id: 'garden-echo-2', x: -210, y: 935 },
      { id: 'garden-echo-3', x: -20, y: 1110 },
      { id: 'garden-echo-4', x: -350, y: 1255 },
      { id: 'garden-echo-5', x: -120, y: 1390 },
      { id: 'garden-echo-6', x: -560, y: 1320 }
    ],
    'tower-talismans': [
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
      { x: 720, y: 430 },
      { x: 1040, y: 740 },
      { x: -460, y: 980 },
      { x: -120, y: 1380 },
      { x: -980, y: 545 },
      { x: -1450, y: 820 },
      { x: -900, y: 620 }
    ]
  },
  decorations: []
};

export function getLandmarkPosition(id) {
  return SUZHOU_CITY_MAP.landmarks[id] ?? { x: 0, y: 0 };
}

export function getStageObjectivePoints(type) {
  if (type === 'lamps') return SUZHOU_CITY_MAP.landmarks['old-street-lamps'];
  if (type === 'echo-fragments') return SUZHOU_CITY_MAP.landmarks['well-echo-fragments'];
  if (type === 'talismans') return SUZHOU_CITY_MAP.landmarks['tower-talismans'];
  if (Array.isArray(SUZHOU_CITY_MAP.landmarks[type])) return SUZHOU_CITY_MAP.landmarks[type];
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
