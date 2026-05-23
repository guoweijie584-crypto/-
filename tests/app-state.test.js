import { describe, expect, it } from 'vitest';

import { createAppState } from '../src/app/appState.js';
import { demoContent } from '../src/content/demoContent.js';

describe('createAppState culture unlocks', () => {
  it('deduplicates unlocked culture cards by spotId', () => {
    const state = createAppState();
    const card = demoContent.cultureCards[0];

    state.emit('culture:unlocked', { card });
    state.emit('culture:unlocked', { card });

    expect(state.getSnapshot().unlockedCards).toHaveLength(1);
    expect(state.getSnapshot().unlockedCards[0].spotId).toBe('old-street');
  });

  it('unlocks completed-stage cards on game completion', () => {
    const state = createAppState();

    state.emit('game:completed', {
      summary: {
        stages: [
          { id: 'old-street', complete: true },
          { id: 'ancient-well', complete: true },
          { id: 'stone-bridge', complete: false },
          { id: 'garden-maze', complete: true }
        ]
      },
      cultureCards: demoContent.cultureCards,
      completion: { title: '剑定山河', comment: '完成三处线索' }
    });

    expect(state.getSnapshot().unlockedCards.map((card) => card.spotId)).toEqual([
      'old-street',
      'ancient-well',
      'garden-maze'
    ]);
  });

  it('keeps raw run summary separate from generated completion copy', () => {
    const state = createAppState();
    const summary = {
      selectedWeapon: 'sword',
      kills: 52,
      remainingHp: 86,
      completionTime: 213.2,
      stages: [{ id: 'old-street', complete: true }]
    };

    state.emit('game:completed', {
      summary,
      cultureCards: demoContent.cultureCards,
      completion: {
        title: '剑定山河',
        comment: '以剑清出线索',
        selectedWeaponName: '剑',
        kills: 52,
        remainingHp: 86,
        completionTime: 213.2,
        clearedStageCount: 1,
        totalStageCount: 5,
        summary,
        unlockedCards: [demoContent.cultureCards[0]]
      },
      routeView: {
        routeText: '老街 -> 古井 -> 石桥 -> 园林 -> 城楼',
        summary: '夜巡路线建议：老街 -> 古井 -> 石桥 -> 园林 -> 城楼。',
        stopLines: ['老街：从老街入口进入。']
      },
      narratorText: '剑定山河归档。'
    });

    expect(state.getSnapshot().runSummary).toEqual(summary);
    expect(state.getSnapshot().completion.title).toBe('剑定山河');
    expect(state.getSnapshot().completion.comment).toContain('以剑');
    expect(state.getSnapshot().completion.selectedWeaponName).toBe('剑');
    expect(state.getSnapshot().completion.kills).toBe(52);
    expect(state.getSnapshot().completion.remainingHp).toBe(86);
    expect(state.getSnapshot().completion.completionTime).toBe(213.2);
    expect(state.getSnapshot().completion.unlockedCards[0].title).toBe('老街灯影阵');
    expect(state.getSnapshot().routeView.routeText).toBe('老街 -> 古井 -> 石桥 -> 园林 -> 城楼');
    expect(state.getSnapshot().narratorText).toBe('剑定山河归档。');
  });

  it('clears culture unlocks on reset', () => {
    const state = createAppState();

    state.emit('culture:unlocked', { card: demoContent.cultureCards[0] });
    state.emit('game:reset');

    expect(state.getSnapshot().unlockedCards).toEqual([]);
    expect(state.getSnapshot().completion).toBeNull();
    expect(state.getSnapshot().runSummary).toBeNull();
    expect(state.getSnapshot().routeView).toBeNull();
  });

  it('stores narrator updates as app state', () => {
    const state = createAppState();

    state.emit('narrator:updated', { text: '线索解开，下一处路标已亮。' });

    expect(state.getSnapshot().narratorText).toBe('线索解开，下一处路标已亮。');
  });
});
