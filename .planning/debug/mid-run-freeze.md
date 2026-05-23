---
status: resolved
trigger: "玩到一半卡住不动"
created: "2026-05-23"
updated: "2026-05-23"
---

# Debug Session: Mid Run Freeze

## Symptoms

- Expected behavior: Stage transitions continue normally while playing.
- Actual behavior: The run freezes mid-game.
- Error messages: Not provided by user.
- Timeline: Started after recent stage expansion work.
- Reproduction: Play through the expanded route until a later stage transition.

## Current Focus

- hypothesis: `GameApp.js` calls `createLamps()` for the new repeated lamp stage without importing it, causing a runtime ReferenceError during stage setup.
- test: Add focused contract coverage for stage progression into the new stone-bridge lamp stage.
- expecting: Test fails before import fix or would catch the missing public dependency; after fix, stage progression can initialize repeated objective types.
- next_action: resolved

## Evidence

- timestamp: 2026-05-23T21:52:00+08:00
  observation: `GameApp.js` imports `createEchoFragments` and `createTalismans` from `gameState.js`, but stage setup now calls `createLamps(progress.pointsKey)`.

## Eliminated

- hypothesis: Old victory popup is blocking movement.
  reason: Source has no active victory popup template/call, and defensive removal/hide guard is in place.

## Resolution

- root_cause: `GameApp.js` generalized stage setup to call `createLamps(progress.pointsKey)` for repeated lamp objectives, but the function was not imported from `gameState.js`.
- fix: Imported `createLamps` in `GameApp.js`.
- verification: Added a game contract regression test that advances from 古井回声阵 into 石桥渡影阵 and asserts the lamp objective initializes without freezing.
- files_changed: `src/game/GameApp.js`, `tests/game-contract.test.js`
