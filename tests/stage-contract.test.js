import { describe, expect, it } from 'vitest';

import { ENEMIES, ENEMY_TYPES, createEnemy } from '../src/game/enemies.js';
import { STAGE_IDS, STAGES, createStageProgress } from '../src/game/stages.js';

describe('stage contract', () => {
  it('defines three scenic stages in order', () => {
    expect(STAGE_IDS).toEqual(['old-street', 'ancient-well', 'city-tower']);
    expect(STAGES.map((stage) => stage.title)).toEqual(['老街灯影阵', '古井回声阵', '城楼镇妖阵']);
  });

  it('defines distinct objective types and low MVP targets', () => {
    expect(createStageProgress('old-street')).toMatchObject({ type: 'lamps', target: 3 });
    expect(createStageProgress('ancient-well')).toMatchObject({ type: 'echo-fragments', target: 5 });
    expect(createStageProgress('city-tower')).toMatchObject({ type: 'talismans', target: 3 });
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
