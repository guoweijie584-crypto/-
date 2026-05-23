# Phase 3 Pattern Map

**Mapped:** 2026-05-23
**Phase:** SHPL-03-culture-narration-and-route-reward

## Target Files And Existing Analogs

| Target | Role | Existing Analog | Notes |
|--------|------|-----------------|-------|
| `src/content/demoContent.js` | Culture cards and route data | Existing `cultureCards` and `route` arrays | Extend records; keep structured verified data local. |
| `src/narration/localNarrator.js` | Local AI-style fallback generation | `src/game/runSummary.js` deterministic summary creation | Pure functions; no network calls. |
| `src/app/appState.js` | Unlock/completion state | Existing event-driven state updates | Add dedupe and derived completion state. |
| `src/main.js` | Event orchestration | Existing app/game subscription bridge | Wire stage/completion events to shell updates. |
| `src/ui/shell.js` | DOM rendering of rewards | Existing panel roots and shell methods | Add update methods; render dynamic text safely. |
| `src/styles.css` | Panel styling | Existing compact panels | Add concise list/card styling without nested cards. |
| `tests/content-contract.test.js` | Content data contract | Existing stage/weapon contract tests | Assert five route stops and required fields. |
| `tests/narration.test.js` | Narration contract | Existing run-summary tests | Assert deterministic title/comment/route output. |
| `tests/app-state.test.js` | State unlock contract | Existing shell tests | Assert dedupe and completion derived state. |
| `tests/app-shell.test.js` | UI root/copy contract | Existing shell root tests | Assert panels update and old victory popup stays absent. |

## Existing Patterns To Preserve

- Keep Canvas/game code independent from AI/network calls.
- Use English identifiers and Chinese user-facing copy.
- Use structured local data for scenic/cultural facts.
- Use app-state events as the integration point between game and DOM shell.
- Use `textContent` or node creation for generated copy.
- Keep `gemini-code-1779459048019_副本.html` untouched.

## Planning Implications

- Plan 03-01 should upgrade data and unlock state first, because narration and route output depend on content records.
- Plan 03-02 should add pure local generation before UI completion flow, making title/comment behavior testable.
- Plan 03-03 should compose the final reward UI from content + narrator + run summary.

