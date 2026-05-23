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
      stages: [{ id: 'old-street', complete: true }]
    };

    state.emit('game:completed', {
      summary,
      cultureCards: demoContent.cultureCards,
      completion: {
        title: '剑定山河',
        comment: '以剑清出线索',
        summary,
        unlockedCards: [demoContent.cultureCards[0]]
      },
      narratorText: '剑定山河归档。'
    });

    expect(state.getSnapshot().runSummary).toEqual(summary);
    expect(state.getSnapshot().completion.title).toBe('剑定山河');
    expect(state.getSnapshot().completion.comment).toContain('以剑');
    expect(state.getSnapshot().narratorText).toBe('剑定山河归档。');
  });

  it('clears culture unlocks on reset', () => {
    const state = createAppState();

    state.emit('culture:unlocked', { card: demoContent.cultureCards[0] });
    state.emit('game:reset');

    expect(state.getSnapshot().unlockedCards).toEqual([]);
    expect(state.getSnapshot().completion).toBeNull();
    expect(state.getSnapshot().runSummary).toBeNull();
  });

  it('stores narrator updates as app state', () => {
    const state = createAppState();

    state.emit('narrator:updated', { text: '线索解开，下一处路标已亮。' });

    expect(state.getSnapshot().narratorText).toBe('线索解开，下一处路标已亮。');
  });
});
