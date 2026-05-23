# Testing

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Current State

There are no automated tests, no test framework, no CI, and no manual QA checklist in the repository.

The current demo can only be verified manually by opening `gemini-code-1779459048019_副本.html` in a browser and playing.

## Behaviors To Manually Verify Today

Core demo checks:

- Page opens without console errors.
- Canvas fills the viewport and resizes with the window.
- WASD and arrow keys move the player.
- Mouse position controls aim direction.
- Holding left mouse performs repeated melee attacks.
- Right mouse throws the weapon and disables melee weapon state until pickup.
- Thrown weapon damages enemies, slows, lands, and can be picked up.
- Space triggers ultimate only at full energy.
- Enemies spawn around the player and either chase or flee according to type.
- Player HP decreases on contact with chasing enemies.
- Enemy death increments kills, grants EXP, and grants energy.
- Level-up pauses gameplay and shows three upgrade options.
- Upgrade selection resumes gameplay and applies the effect.
- Game-over modal appears when HP reaches zero.
- Restart resets major state.

## High-Risk Untested Areas

- Collision edge cases when enemies are removed during `forEach` iteration.
- Explosion projectile hit logic, which uses a single `proj.hitEnemies` flag rather than tracking each enemy independently.
- Long sessions with unbounded enemy, particle, or text counts.
- Touch/mobile input, which does not exist yet.
- Viewport resizing during active gameplay.
- Ultimate teleport outside intended gameplay boundaries; player is clamped in `update()` afterward, not inside `triggerUltimate()`.
- Upgrade stacking and balancing over multiple levels.

## Suggested Automated Test Strategy

When the project is converted into a structured web app:

- Unit-test pure helpers such as distance, XP thresholds, stage progression, title generation inputs, and route selection.
- Extract combat calculations into testable functions.
- Add Playwright smoke tests for page load, canvas presence, HUD visibility, modals, and basic input.
- Add content validation tests for scenic/cultural cards to ensure required fields and source labels exist.
- Mock AI generation and verify fallback behavior when AI fails.

## Suggested Manual QA For Target V1

For the planned `山河破阵录：古城夜巡` MVP:

- Weapon select works for sword, blade, and spear.
- Each weapon feels mechanically different.
- Stage 1 clears and unlocks the old-street culture card.
- Stage 2 clears and unlocks the ancient-well culture card.
- Stage 3 boss clears and unlocks the completion card.
- AI storyteller copy appears in the expected Jianghu tone.
- Completion title and comment are generated or fall back gracefully.
- Route card shows `老街 -> 古井 -> 城楼`.
- Mobile viewport has no overlapping controls or unreadable cards.
- The full loop completes in roughly 3-5 minutes.

## Missing Infrastructure

No files currently exist for:

- `package.json`
- unit test runner
- browser test runner
- lint/format scripts
- CI workflow
- QA checklist artifact

