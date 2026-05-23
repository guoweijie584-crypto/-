# Phase 3: Culture, Narration, And Route Reward - Context

**Gathered:** 2026-05-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the AI+文旅 reward loop on top of the completed Canvas action loop. Phase 3 turns stage completion and run summary data into five structured culture-card unlocks, local Jianghu narrator copy, performance-based title/comment generation, a final `江湖游历卡`, and a real-world route recommendation.

This phase uses the current five-point route as v1 scope: `老街 -> 古井 -> 石桥 -> 园林 -> 城楼`. It does not add a real AI provider, backend proxy, CMS, account system, share-image rendering, mobile controls, or PWA metadata.

</domain>

<decisions>
## Implementation Decisions

### Route Scope
- **D-01:** Phase 3 formally upgrades v1 from the original three-point route to the current five-point route already implemented in code: 老街, 古井, 石桥, 园林, 城楼.
- **D-02:** The five route IDs are canonical for this phase: `old-street`, `ancient-well`, `stone-bridge`, `garden-maze`, and `city-tower`.
- **D-03:** The final route recommendation order is fixed for the demo: `老街 -> 古井 -> 石桥 -> 园林 -> 城楼`.

### Cultural Content
- **D-04:** Cultural facts must come from structured local data, not freeform AI generation.
- **D-05:** Each culture card must include at least `spotId`, `title`, `sourceNote`, `unlockStage`, and `routeOrder`; Phase 3 may extend cards with `subtitle`, `body`, `heritageHint`, `visitTip`, and `tags`.
- **D-06:** v1 demo content may remain clearly labeled as replaceable demo material, but the UI should feel like a coherent local-culture reward rather than a placeholder.
- **D-07:** A card unlocks only when the matching stage is complete. Completion can unlock all completed-stage cards from `runSummary.stages` defensively.

### Local AI-Style Narration
- **D-08:** No provider API keys or network calls are allowed in frontend code for v1.
- **D-09:** Narration must be deterministic local fallback generation with Jianghu tone, based on stage, selected weapon, unlocked cards, and run summary.
- **D-10:** AI-style text may rewrite tone, titles, and comments, but must not invent cultural facts beyond the structured content data.
- **D-11:** Narrator text should cover onboarding, stage transitions, culture unlocks, and completion.

### Travel Card And Route Reward
- **D-12:** The completion card must show selected weapon, performance summary, unlocked culture cards, generated title, and generated completion comment.
- **D-13:** The route panel must output the five-point route and concise stop-level visit copy from structured route/culture data.
- **D-14:** The old blocking victory popup remains removed; completion should update the existing side panels or a non-blocking reward surface.

### the agent's Discretion
- Exact Chinese wording, card body length, title tiers, and title thresholds may be tuned during implementation.
- UI may use existing side panels first before adding a larger modal, as long as text does not overlap and the final card is readable.
- Tests should prioritize deterministic data generation, state transitions, and DOM rendering over exact Canvas behavior.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — Product goal and AI+文旅 positioning.
- `.planning/REQUIREMENTS.md` — CULT, NARR, and ROUTE requirements updated for the five-point route.
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, and three-plan shape.
- `.planning/STATE.md` — Current route-scope decision and Phase 2 completion state.

### Phase 2 Foundation
- `.planning/phases/SHPL-02-three-stage-combat-loop/02-03-SUMMARY.md` — Run summary and victory-state foundation.
- `src/game/stages.js` — Canonical stage IDs, titles, objectives, and order.
- `src/game/runSummary.js` — Completion payload Phase 3 consumes.
- `src/game/GameApp.js` — Emits `game:stage-changed` and `game:completed`.
- `src/app/appState.js` — App state fields for narrator, unlocked cards, completion, run summary, and route.
- `src/content/demoContent.js` — Existing weapon, culture-card, and route data.
- `src/ui/shell.js` — DOM shell panels for narrator, culture, completion, and route output.
- `src/styles.css` — Existing visual treatment for right-side panels and compact panels.

### Constraints
- `gemini-code-1779459048019_副本.html` — Original reference remains untouched.
- Frontend must not contain AI provider secrets or depend on live AI APIs.

</canonical_refs>

<specifics>
## Specific Ideas

- Culture cards should read like rewards: a title, short cultural clue, heritage/visit hint, and source note.
- The narrator can call itself `AI 说书人` in UI, but implementation should be local template generation.
- Generated titles can combine performance and weapon identity, e.g. fast clear, high HP, full-route completion, or specific weapon choice.
- The route panel should make the offline behavior clear: follow the route in order after clearing the Jianghu副本.

</specifics>

<deferred>
## Deferred Ideas

- Real scenic source ingestion, citations, and operator-managed content are v2.
- Real AI model generation through backend/edge proxy is v2.
- Shareable rendered image version of the travel card is v2 or a later hardening task.
- Touch controls and PWA metadata remain Phase 4.

</deferred>

---

*Phase: SHPL-03-culture-narration-and-route-reward*
*Context gathered: 2026-05-23*
