import { describe, expect, it, vi } from 'vitest';

import {
  SUZHOU_CITY_MAP,
  getLandmarkPosition,
  getPassableSpawnPoint,
  getStageObjectivePoints,
  isBlockedCircle,
  isSegmentBlocked,
  resolveBlockedCircle
} from '../src/game/cityMap.js';

describe('suzhou city map', () => {
  it('defines the scenic route landmarks', () => {
    expect(getLandmarkPosition('old-street')).toMatchObject({ title: '平江路老街' });
    expect(getLandmarkPosition('ancient-well')).toMatchObject({ title: '古井广场' });
    expect(getLandmarkPosition('city-tower')).toMatchObject({ title: '盘门水陆城门' });
  });

  it('blocks canals and buildings but allows bridge and road points', () => {
    expect(isBlockedCircle(580, -1000, 18)).toBe(true);
    expect(isBlockedCircle(560, -1230, 18)).toBe(false);
    expect(isBlockedCircle(700, -1000, 18)).toBe(true);
    expect(isBlockedCircle(835, -1000, 18)).toBe(false);
  });

  it('places objective points on passable city areas', () => {
    ['lamps', 'echo-fragments', 'talismans'].forEach((type) => {
      getStageObjectivePoints(type).forEach((point) => {
        expect(isBlockedCircle(point.x, point.y, 18)).toBe(false);
      });
    });
  });

  it('returns passable spawn points from the configured city map', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const point = getPassableSpawnPoint({ x: 0, y: 0 }, 100);
    expect(SUZHOU_CITY_MAP.landmarks.spawnPoints).toContainEqual(point);
    expect(isBlockedCircle(point.x, point.y, 24)).toBe(false);
    vi.restoreAllMocks();
  });

  it('detects projectile paths through walls and resolves entities out of buildings', () => {
    expect(isSegmentBlocked(835, -1000, 960, -1000, 8)).toBe(true);
    expect(isSegmentBlocked(835, -1110, 835, -1040, 8)).toBe(false);

    const enemy = { x: 700, y: -1000, radius: 18 };
    expect(isBlockedCircle(enemy.x, enemy.y, enemy.radius)).toBe(true);
    expect(resolveBlockedCircle(enemy, enemy.radius)).toBe(true);
    expect(isBlockedCircle(enemy.x, enemy.y, enemy.radius)).toBe(false);
  });
});
