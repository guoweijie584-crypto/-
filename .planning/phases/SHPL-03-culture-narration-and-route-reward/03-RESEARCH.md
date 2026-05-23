# Phase 3 Research: Culture, Narration, And Route Reward

**Researched:** 2026-05-23
**Status:** Ready for planning

## Implementation Findings

- The code already has stable route identifiers across `src/game/stages.js`, `src/content/demoContent.js`, and `src/game/cityMap.js`: `old-street`, `ancient-well`, `stone-bridge`, `garden-maze`, `city-tower`.
- `src/game/runSummary.js` returns selected weapon, kills, remaining HP, completion time, victory, stage completion, echo fragments, boss phase, selected upgrades, and damage taken. This is enough to generate a local title/comment without adding telemetry.
- `src/app/appState.js` already reserves `narratorText`, `unlockedCards`, `completion`, `runSummary`, and `route`, but currently only stores completion payload directly.
- `src/ui/shell.js` already renders reserved `#narrator-panel`, `#culture-panel`, `#completion-panel`, and `#route-panel` roots. Phase 3 should update these roots rather than introducing a separate blocking victory popup.
- Existing tests use Vitest + jsdom and favor contract-style assertions. Add focused tests for content contracts, narration generation, app-state unlock behavior, and shell rendering.

## Recommended Technical Shape

### Content

Keep scenic/cultural content in `src/content/demoContent.js` or split to `src/content/culture.js` only if the file gets hard to scan. For this phase, a modest extension of `demoContent.cultureCards` and `demoContent.route` is likely enough.

Each culture card should be structured data:

- `spotId`
- `title`
- `subtitle`
- `sourceNote`
- `unlockStage`
- `routeOrder`
- `teaser`
- `body`
- `heritageHint`
- `visitTip`
- `tags`

### Narration

Create a small local generation boundary, likely `src/narration/localNarrator.js`, exporting deterministic functions:

- `createOnboardingNarration(content)`
- `createStageNarration(stage, context)`
- `createCultureUnlockNarration(card, context)`
- `createCompletionNarration(summary, unlockedCards, content)`
- `createRouteRecommendation(route, cards)`
- `createTravelTitle(summary, content)`

The narrator should accept structured inputs and return plain strings or small objects. It should not import Canvas/game modules.

### App State

`createAppState.emit()` can handle:

- `game:stage-changed`: update current narrator text.
- `culture:unlocked`: append unique card by `spotId`.
- `game:completed`: compute final unlocked cards, completion/travel-card data, narrator text, and route recommendation.

Main bootstrap can orchestrate stage completion events from game snapshots if needed.

### UI

Add shell methods instead of one-off DOM manipulation in `main.js`:

- `updateNarrator(text)`
- `updateCultureCards(cards, latestCard)`
- `updateCompletionCard(card)`
- `updateRoute(routeView)`

Use `textContent` for generated copy. Avoid `innerHTML` for dynamic generated narration unless manually creating nodes.

## Risks And Mitigations

| Risk | Mitigation |
|------|------------|
| AI-style copy invents facts | Only generate tone/title/comment from structured data; culture facts stay in content records. |
| Route scope mismatch | Update roadmap/requirements and tests to assert five route IDs/order. |
| Completion UI becomes a new blocking popup | Reuse existing panels or a non-blocking reward surface; keep old victory popup removed. |
| Long Chinese copy overlaps panels | Keep card body concise, use scrollable compact panels where needed, and defer mobile polish to Phase 4. |
| Duplicate unlock events | Deduplicate by `spotId` in app state and tests. |

## Verification Strategy

- `tests/content-contract.test.js`: assert five culture cards, five route stops, route order, and required card fields.
- `tests/narration.test.js`: assert local generation returns title/comment/route copy without network access and includes structured inputs.
- `tests/app-state.test.js`: assert culture unlock deduplication and completion card state.
- `tests/app-shell.test.js`: assert narrator/culture/completion/route panels update with final copy.
- Existing `npm test` and `npm run build` remain mandatory.

## Out Of Scope

- Real AI API integration, RAG, embeddings, model selection, backend proxy, API keys.
- Real scenic content validation beyond clearly labeled demo data.
- PWA/share metadata and mobile touch controls.

