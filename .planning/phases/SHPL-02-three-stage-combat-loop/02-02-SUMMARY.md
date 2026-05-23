# Plan 02-02 Summary: Stage Objectives And Enemies

## Result

Implemented the three-stage scenic combat loop before the boss encounter.

## Completed Tasks

- Added `src/game/stages.js` with ordered `old-street`, `ancient-well`, and `city-tower` stage definitions.
- Added `src/game/enemies.js` with `灯影妖`, `纸人怪`, and `井影` domain enemy contracts.
- Added objective state and snapshots for lamps, echo fragments/waves, and talismans.
- Replaced active enemy spawning with stage-specific enemy sets.
- Added DOM stage HUD and Canvas objective rendering.

## Verification

- `npm test` passed.
- `npm run build` passed.
- `git diff --name-only -- gemini-code-1779459048019_副本.html` printed no path.

## Deviations from Plan

None - plan executed exactly as written.

## Commit

- `2bd2b88 feat(02-02): add staged objectives and enemies`

## Self-Check: PASSED
