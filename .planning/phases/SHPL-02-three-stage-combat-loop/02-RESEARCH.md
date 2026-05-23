# Phase 2 Research: Three-Stage Combat Loop

**Researched:** 2026-05-23
**Phase:** SHPL-02-three-stage-combat-loop
**Question:** What needs to be known to plan Phase 2 well?

## Research Summary

Phase 2 should evolve the existing migrated Canvas loop by adding structured gameplay data and small, testable systems around the current imperative loop rather than rewriting the renderer or introducing a game engine. The safest planning shape is three vertical waves:

1. Weapon selection and weapon-specific combat identity.
2. Stage data, objectives, enemy sets, and stage transitions.
3. Boss encounter, victory state, run summary, and the Phase 2 victory panel.

This preserves Phase 1's working `mountGame()` boundary while adding the first complete 3-5 minute game loop.

## Current Implementation Constraints

### Game Entry And Loop

- `src/game/GameApp.js` owns `mountGame(container, options)`, creates Canvas, installs input, starts/stops the loop, mutates game state, renders, and emits `game:snapshot`.
- The implementation is currently monolithic inside `GameApp.js` for combat behavior. Phase 2 should split data and helpers only where it reduces risk:
  - `src/game/weapons.js` for weapon definitions and weapon upgrade pools.
  - `src/game/stages.js` for stage definitions and objective state.
  - `src/game/enemies.js` for enemy definitions/spawn helpers/behavior helpers.
  - `src/game/boss.js` for `雾甲守将` state and attacks if it becomes too large for `GameApp.js`.
  - `src/game/runSummary.js` for summary creation.
- Keep `mountGame()` as the public integration point. Later phases should not need to call internal gameplay helpers.

### State Model

`createInitialGameState()` currently includes:

- `gameState`
- `kills`
- `gameTime`
- `spawnTimer`
- `screenShake`
- `camera`
- `terrain`
- `player`
- `enemies`
- `droppedWeapons`
- `projectiles`
- `particles`
- `damageTexts`

Phase 2 should extend it with:

- `selectedWeapon`
- `currentStageIndex`
- `stageStatus`
- `objectives`
- `boss`
- `runStats`
- `runSummary`

The snapshot returned by `getSnapshot()` should expand to include selected weapon, stage status, objective status, boss status, and run summary when available.

### UI Shell

- `src/ui/shell.js` already renders weapon, narrator, culture, completion, and route panels.
- Weapon selection currently changes app state but does not drive the game. Phase 2 should pass the selected weapon into `mountGame()` or call a public game method before `start()`.
- The completion panel can be reused for the Phase 2 victory panel and `江湖游历卡` placeholder shell, but must avoid Phase 3 content: no AI title/comment, no culture-card body, and no route recommendation.

## Weapon Planning Findings

The user locked strong weapon differentiation plus 3 selectable upgrades per weapon.

Recommended target contracts:

### Sword

- Identity: agile, sword-wave pressure.
- Baseline behavior: shorter cooldown, moderate range, lower single-hit damage.
- Signature action: sword wave projectile when upgraded or as core weapon trait.
- Upgrade pool examples:
  - `剑气穿透`: sword waves pierce additional enemies.
  - `剑影连斩`: lower attack cooldown or extra quick slash.
  - `游身步`: speed/brief dodge-style mobility bonus.

### Blade

- Identity: heavy broad sweep and impact.
- Baseline behavior: slower cooldown, wider arc, higher damage/knockback.
- Signature action: circular slash or broad cleave.
- Upgrade pool examples:
  - `横扫千军`: wider sweep arc/range.
  - `破甲重斩`: bonus damage to armored/boss enemies.
  - `震地刀风`: short-range shockwave on heavy swings.

### Spear

- Identity: thrust/dash penetration.
- Baseline behavior: narrow attack cone, longer reach, forward lunge.
- Signature action: dash/thrust through enemies along aim vector.
- Upgrade pool examples:
  - `游龙突`: longer thrust/dash distance.
  - `穿云贯阵`: hit multiple enemies in a line.
  - `回马枪`: reduced cooldown or second hit after dash.

Planning implication: do not start by adding full skill-tree UI. Use data-driven weapon definitions and adapt `performAttack()` around `selectedWeapon`.

## Stage Planning Findings

The user locked a sequential stage loop:

1. `老街灯影阵`: kill enemies and light 3 lamps.
2. `古井回声阵`: collect echo fragments while dodging echo-wave hazards.
3. `城楼镇妖阵`: hold/defend the gate or break talismans before boss.
4. `雾甲守将`: two-phase boss.
5. Victory.

Recommended stage contract:

```text
id
title
objectiveLabel
enemyTypes
target
spawnProfile
onEnter state initializer
progress checker
completion event
```

Planning implication: put stage definitions in `src/game/stages.js`, but keep objective update calls inside the main loop until the behavior is stable.

## Enemy And Boss Planning Findings

### Enemy Types

Replace prototype names with domain types:

- `灯影妖`: fast chase pressure; low-mid HP; appears in stage 1 and possibly boss summons.
- `纸人怪`: group surround pressure; lower individual speed, group spawn bias; appears stage 1/3 and boss summons.
- `井影`: ranged/ripple interference; should produce projectiles or echo waves; appears stage 2.
- `雾甲守将`: boss; charge and area slash; half-health fog armor/summon transition.

Planning implication: `enemy.type` should become domain IDs, and `spawnEnemy()` should use current stage enemy sets instead of random prototype buckets.

### Boss

The boss should be simple but explicit:

- Boss state starts after stage 3 objective completion.
- Phase 1: charge and area slash.
- Phase 2: starts at half health; adds fog armor shield and/or summons paper enemies.
- Victory triggers when boss HP reaches zero.

Planning implication: boss can be represented as a special enemy object with `type: 'mist-armor-general'` plus `boss.phase`, or as `state.boss` linked to an enemy. The plan should prefer whichever keeps `damageEnemy()` and rendering changes smallest.

## Victory And Summary Planning Findings

Phase 2 should emit and display standard run summary data:

- `selectedWeapon`
- `kills`
- `remainingHp`
- `completionTime`
- `victory`
- `stages`
- `echoFragments`
- `bossPhaseReached`
- `selectedUpgrades`
- `damageTaken`

Recommended events:

- `game:stage-changed`
- `game:objective-updated`
- `game:boss-started`
- `game:completed`
- Continue emitting `game:snapshot`.

Planning implication: add summary assertions in tests. Do not rely only on browser manual testing.

## Test Strategy

Keep Phase 2 tests focused on contracts rather than frame-perfect gameplay:

- Weapon data test: three weapons exist, each has 3 upgrades, each maps to distinct combat traits.
- Stage data test: three ordered stages exist with required IDs/titles/objective types.
- Game contract test: snapshot includes `selectedWeapon`, `stage`, `objectives`, and `runSummary` shape.
- Summary test: a helper can produce summary with the required Phase 2 fields.
- Shell test: victory/summary placeholder copy exists after shell update, without asserting Phase 3 culture/AI copy.

Manual/browser verification should cover:

- select each weapon and confirm different feel;
- complete stage 1 lamp objective;
- complete stage 2 fragment objective while echo waves appear;
- enter stage 3 and start boss;
- defeat boss and see victory panel plus `江湖游历卡` placeholder.

## Risk Notes

- The current `showUpgradeScreen()` auto-applies a random upgrade instead of showing real selectable choices. Phase 2 must decide whether to implement selectable upgrade UI now or keep it as auto-selection. Because the user explicitly chose selectable pools, the plan should include real choices or a tightly scoped DOM/Canvas upgrade selection path.
- A 3-5 minute loop can become too long if all objectives are tuned high. Initial thresholds should be low and adjustable through stage data.
- Boss and enemy behavior should be behaviorally distinct but not full bespoke AI systems. Keep complexity inside readable helper functions.
- Avoid adding Phase 3 content early. The victory panel may show performance data and `江湖游历卡` placeholder only.

## Recommended Plan Split

### 02-01 Weapon Selection And Combat Identity

Implement selected weapon propagation, weapon definitions, weapon-specific attack behavior, and 3-upgrade pools per weapon.

### 02-02 Stage Loop And Enemy Mapping

Implement stage definitions, old street lamps, ancient well fragments/echo waves, city tower gate/talisman objective, stage transitions, and stage-specific enemy spawns.

### 02-03 Boss, Victory, And Run Summary

Implement `雾甲守将`, two boss phases, victory state, run summary, victory panel, and final verification.

## Research Complete

Phase 2 is ready for UI-SPEC gating and planning. The main planning constraint is to preserve Phase 1's public game API while adding data-driven weapons/stages/enemies incrementally.
