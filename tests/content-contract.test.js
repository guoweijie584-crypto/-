import { describe, expect, it } from 'vitest';

import { demoContent } from '../src/content/demoContent.js';
import { STAGE_IDS } from '../src/game/stages.js';

describe('demo culture content', () => {
  it('defines five culture cards in stage order', () => {
    expect(demoContent.cultureCards).toHaveLength(5);
    expect(demoContent.cultureCards.map((card) => card.spotId)).toEqual(STAGE_IDS);
    expect(demoContent.cultureCards.map((card) => card.routeOrder)).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps culture cards backed by structured replaceable fields', () => {
    demoContent.cultureCards.forEach((card, index) => {
      expect(card).toMatchObject({
        spotId: STAGE_IDS[index],
        sourceNote: expect.any(String),
        unlockStage: index + 1,
        routeOrder: index + 1,
        subtitle: expect.any(String),
        body: expect.any(String),
        heritageHint: expect.any(String),
        visitTip: expect.any(String)
      });
      expect(card.tags.length).toBeGreaterThan(0);
      expect(card.sourceNote).toContain('演示资料');
    });
  });

  it('aligns route stops with culture cards', () => {
    expect(demoContent.route).toHaveLength(5);
    expect(demoContent.route.map((stop) => stop.spotId)).toEqual(STAGE_IDS);
    demoContent.route.forEach((stop, index) => {
      expect(stop.routeOrder).toBe(index + 1);
      expect(stop.visitHint).toEqual(expect.any(String));
      expect(demoContent.cultureCards[index].spotId).toBe(stop.spotId);
    });
  });
});
