import { describe, expect, it } from 'vitest';

import { demoContent } from '../src/content/demoContent.js';
import {
  createCompletionComment,
  createCompletionNarration,
  createCultureUnlockNarration,
  createOnboardingNarration,
  createRouteRecommendation,
  createStageNarration,
  createTravelTitle
} from '../src/narration/localNarrator.js';

const fullSummary = {
  selectedWeapon: 'sword',
  kills: 52,
  remainingHp: 86,
  completionTime: 213.2,
  victory: true,
  stages: demoContent.cultureCards.map((card) => ({
    id: card.spotId,
    title: card.title,
    complete: true
  }))
};

describe('local narrator fallback', () => {
  it('creates deterministic onboarding and stage narration', () => {
    expect(createOnboardingNarration(demoContent)).toContain('老街');
    expect(createOnboardingNarration(demoContent)).toContain('城楼');
    expect(createStageNarration({ title: '古井回声阵', index: 2, total: 5 }, { weapon: demoContent.weapons[0] }))
      .toContain('第 2 / 5 阵');
  });

  it('creates culture unlock narration from structured card data', () => {
    const text = createCultureUnlockNarration(demoContent.cultureCards[0], { weapon: demoContent.weapons[0] });

    expect(text).toContain('老街灯影阵');
    expect(text).toContain(demoContent.cultureCards[0].teaser);
    expect(text).toContain('剑');
  });

  it('generates performance-based title and comment', () => {
    const title = createTravelTitle(fullSummary, demoContent);
    const comment = createCompletionComment(fullSummary, demoContent.cultureCards, demoContent);

    expect(title).toBe('剑定山河');
    expect(comment).toContain('气血尚足');
    expect(comment).toContain('5/5');
    expect(comment).toContain('3分33秒');
    expect(comment).toContain('5 张文化卡');
  });

  it('creates completion narration and five-stop route copy', () => {
    const narration = createCompletionNarration(fullSummary, demoContent.cultureCards, demoContent);
    const route = createRouteRecommendation(demoContent.route, demoContent.cultureCards);

    expect(narration).toContain('剑定山河');
    expect(route.routeText).toBe('老街 -> 古井 -> 石桥 -> 园林 -> 城楼');
    expect(route.summary).toContain('老街 -> 古井 -> 石桥 -> 园林 -> 城楼');
    expect(route.stopLines).toHaveLength(5);
  });

  it('exports synchronous local functions only', () => {
    const result = createTravelTitle(fullSummary, demoContent);

    expect(result).toEqual(expect.any(String));
    expect(result).not.toHaveProperty('then');
  });
});
