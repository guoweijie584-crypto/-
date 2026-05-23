import { describe, expect, it } from 'vitest';

import { createInitialGameState } from '../src/game/gameState.js';
import { createRunSummary } from '../src/game/runSummary.js';

describe('createRunSummary', () => {
  it('returns the exact Phase 2 run summary fields', () => {
    const state = createInitialGameState({ selectedWeapon: 'spear' });
    state.gameState = 'victory';
    state.kills = 12;
    state.gameTime = 188.42;
    state.player.hp = 63.9;
    state.stageStatus = state.stageStatus.map((stage) => ({ ...stage, complete: true }));
    state.runStats.echoFragments = 5;
    state.runStats.bossPhaseReached = 2;
    state.runStats.damageTaken = 37.7;
    state.runStats.selectedUpgrades = [{ id: 'spear-dash', title: '游龙入阵' }];

    const summary = createRunSummary(state);

    expect(Object.keys(summary)).toEqual([
      'selectedWeapon',
      'kills',
      'remainingHp',
      'completionTime',
      'victory',
      'stages',
      'echoFragments',
      'bossPhaseReached',
      'selectedUpgrades',
      'damageTaken'
    ]);
    expect(summary).toMatchObject({
      selectedWeapon: 'spear',
      kills: 12,
      remainingHp: 63,
      completionTime: 188.4,
      victory: true,
      echoFragments: 5,
      bossPhaseReached: 2,
      damageTaken: 37
    });
    expect(summary.stages.every((stage) => stage.complete)).toBe(true);
    expect(summary.selectedUpgrades).toEqual([{ id: 'spear-dash', title: '游龙入阵' }]);
  });
});
