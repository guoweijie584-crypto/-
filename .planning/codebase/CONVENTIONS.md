# Conventions

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Summary

The existing code uses straightforward imperative JavaScript with global state and function declarations. It prioritizes prototype speed and visual feedback over modularity. There are useful patterns to preserve, but no formal linting, formatting, typing, testing, or project conventions yet.

## Code Style

Observed in `gemini-code-1779459048019_副本.html`:

- Four-space indentation in HTML/CSS/JS blocks.
- Semicolons are mostly used.
- `const` is used for stable references and data definitions.
- `let` is used for mutable arrays and counters.
- Function declarations are used for most behavior.
- Object literals store state (`player`, `camera`, `terrain`, enemy/projectile objects).
- Inline event listeners are registered at script top level.

## State Mutation Pattern

The dominant pattern is direct mutation of global objects and arrays:

- Player fields are mutated in `update()`, `performAttack()`, `damageEnemy()`, `hurtPlayer()`, `resetGame()`, and upgrade effects.
- Arrays such as `enemies`, `projectiles`, `particles`, and `damageTexts` are pushed to, filtered, and iterated directly.
- `gameState` controls simulation pause/resume.

This is acceptable for the current demo but should be isolated before adding stages, AI content, route cards, or persistence.

## Rendering Pattern

Canvas rendering uses:

- `ctx.save()` / `ctx.restore()` around local transforms.
- Camera translation in `render()` before world-space drawing.
- Separate helper functions for specific entities.
- Canvas shapes instead of image assets.
- Color and glow effects for combat feedback.

The target game can keep this pattern initially, especially for hackathon speed, but should eventually add a sprite/asset pipeline.

## UI Pattern

The demo uses regular HTML/CSS for HUD and modals:

- HUD values are updated through `document.getElementById(...).innerText` and bar transforms.
- Upgrade options are dynamically created DOM nodes.
- Modal visibility uses `style.display`.

This pattern aligns with the target plan to keep AI dialogue, culture cards, route cards, and event pages in Web UI around the game surface.

## Error Handling

There is effectively no runtime error handling. Browser APIs are assumed to exist, DOM elements are assumed present, and game state transitions are trusted.

Future code should add defensive boundaries for:

- AI request failures and timeouts.
- Missing or invalid cultural content.
- Mobile/touch input availability.
- Browser audio/autoplay constraints if sound is added.
- Canvas/context initialization failure.

## Comments

Comments are sparse and mostly practical:

- Terrain generation label.
- Player label.
- Ultimate label.
- A note around a previous invisible-player drawing fix.
- Movement-control restoration note.

Keep comments focused on non-obvious gameplay or rendering decisions.

## Recommended Conventions For Next Phase

When the code moves beyond one file:

- Use English identifiers for implementation concepts and Chinese display strings for UI/content.
- Keep data definitions separate from behavior where practical.
- Use event names for cross-layer milestones, such as `stage-cleared`, `culture-card-unlocked`, and `run-completed`.
- Treat cultural/scenic content as verified data, not AI-invented facts.
- Keep Canvas/game code independent from AI/network calls.
- Add a formatter/linter once a package manager is introduced.

