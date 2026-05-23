---
phase: 3
slug: culture-narration-and-route-reward
status: approved
shadcn_initialized: false
preset: none
created: 2026-05-23
---

# Phase 3 — UI Design Contract

> Visual and interaction contract for culture unlocks, local AI-style narration, final travel card, and route recommendation.

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Component library | none |
| Icon library | lucide |
| Font | keep current stack: `"Trebuchet MS", "Microsoft YaHei", "PingFang SC", sans-serif` |
| Rendering split | Canvas for gameplay; DOM panels for narrator, culture cards, completion card, and route reward |

Phase 3 must keep the game as the first-viewport product surface. Do not add a landing page.

## Copywriting Contract

| Surface | Required copy direction |
|---------|-------------------------|
| Narrator heading | `AI 说书人` |
| Culture heading before unlock | `文化线索待解锁` |
| Culture heading after unlock | `已解锁文化线索` |
| Completion heading | `江湖游历卡` |
| Route heading | `夜巡游线` |
| Route order | `老街 -> 古井 -> 石桥 -> 园林 -> 城楼` |

Visible cultural facts must come from structured content. Generated text may add Jianghu tone but must not introduce unsupported facts.

## Layout Contract

- Keep `#narrator-panel`, `#culture-panel`, `#completion-panel`, and `#route-panel` as stable roots.
- The culture panel should show the latest unlock first and a compact list/count for previously unlocked cards.
- The completion panel should show generated title, selected weapon, kills, remaining HP, completion time, cleared stages, unlocked card count, and completion comment.
- The route panel should show five ordered stops with short visit hints.
- Do not restore the old blocking `#victory-panel`.
- Avoid nested cards. A repeated card item may be framed, but page sections/panels should not be cards inside cards.
- Text must wrap within panels. Long source notes can use smaller text or collapsed/secondary styling.

## Interaction Contract

- Onboarding shows narrator copy before starting the run.
- Stage changes update narrator text.
- Stage clear unlocks one culture card tied to that stage ID.
- Completion updates narrator, culture card list, completion card, and route panel in one flow.
- Reset returns panels to initial placeholder state.

## Responsive Contract

- Desktop: panels can remain visible around the Canvas.
- Narrow screens: Phase 4 handles full mobile optimization, but Phase 3 must not create fixed-width text that overflows.
- Completion and route content may scroll inside their panels if needed.

## Checker Sign-Off

- [x] Copywriting: PASS
- [x] Visual scope: PASS
- [x] Component scope: PASS
- [x] Route scope: PASS

**Approval:** approved 2026-05-23

