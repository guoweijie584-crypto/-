# Project Research: Pitfalls

**Defined:** 2026-05-23
**Project:** 山河破阵录：古城夜巡

## Key Pitfalls

| Pitfall | Warning Sign | Prevention |
|---------|--------------|------------|
| Building another endless combat demo | No stage clear, no cards, no route after playing. | Add win conditions and stage events before adding extra combat polish. |
| AI hallucinating cultural facts | Generated text contains unsourced scenic claims. | Keep factual fields in content data and let AI/fallback only change tone. |
| Desktop-only controls | Demo works with mouse/keyboard but not phone. | Add touch movement and action buttons in the MVP roadmap. |
| Over-migrating to Phaser too early | Time spent recreating existing mechanics instead of proving文旅 loop. | Use Vite + Canvas for v1, revisit Phaser only after MVP. |
| No shareable reward | Player finishes but has nothing to show or follow offline. | Prioritize completion card and route panel in the culture phase. |
| Weak scenic-area pitch | Game is fun but not clearly useful to景区/文旅局. | Make culture unlocks and route recommendation visible in the first complete loop. |

## Phase Mapping

- Phase 1 should prevent structural debt by creating a modular Vite shell.
- Phase 2 should prevent endless-game drift by implementing stages and a boss.
- Phase 3 should prevent文旅-value drift by delivering cards, narrator fallback, and route output.
- Phase 4 should prevent distribution failure by hardening mobile, PWA, and share behavior.

