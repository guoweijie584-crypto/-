import { describe, expect, it } from 'vitest';

import { ENEMIES, ENEMY_TYPES, createEnemy } from '../src/game/enemies.js';
import { STAGE_IDS, STAGES, createStageProgress } from '../src/game/stages.js';

describe('stage contract', () => {
  it('defines five scenic stages in order', () => {
    expect(STAGE_IDS).toEqual(['old-street', 'ancient-well', 'stone-bridge', 'garden-maze', 'city-tower']);
    expect(STAGES.map((stage) => stage.title)).toEqual(['老街灯影阵', '古井回声阵', '石桥渡影阵', '园林迷踪阵', '城楼镇妖阵']);
  });

  it('defines objective contracts with ultimate tasks', () => {
    expect(createStageProgress('old-street')).toMatchObject({ type: 'lamps', target: 3, pointsKey: 'old-street-lamps' });
    expect(createStageProgress('ancient-well')).toMatchObject({ type: 'echo-fragments', target: 5, pointsKey: 'well-echo-fragments' });
    expect(createStageProgress('stone-bridge')).toMatchObject({ type: 'lamps', target: 4, pointsKey: 'bridge-lanterns' });
    expect(createStageProgress('garden-maze')).toMatchObject({ type: 'echo-fragments', target: 6, pointsKey: 'garden-echo-fragments' });
    expect(createStageProgress('city-tower')).toMatchObject({ type: 'talismans', target: 3, pointsKey: 'tower-talismans' });
    STAGES.forEach((stage) => {
      expect(stage.objective.ultimateTask).toContain('终极任务');
    });
  });

  it('maps stage enemy sets to domain enemy IDs', () => {
    STAGES.forEach((stage) => {
      stage.enemies.forEach((enemyType) => {
        expect(ENEMY_TYPES).toContain(enemyType);
      });
    });

    expect(Object.keys(ENEMIES)).toEqual(['lamp-shadow', 'paper-doll', 'well-shadow']);
    expect(createEnemy('well-shadow', { x: 1, y: 2 }, 0)).toMatchObject({
      type: 'well-shadow',
      name: '井影',
      behavior: 'ripple-ranged'
    });
  });
});
