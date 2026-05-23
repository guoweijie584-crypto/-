<!-- GSD:project-start source:PROJECT.md -->
## Project

# 山河破阵录：古城夜巡

《山河破阵录：古城夜巡》是一个 AI 文旅江湖动作小游戏。玩家扫码进入被“遗忘妖雾”笼罩的古城，扮演巡夜少侠，在老街、古井、城楼等景点化成的关卡里用剑、刀、枪破阵闯关，并在每关通关后解锁真实地方文化、景点故事或非遗线索。

**Core value:** 用一段 3-5 分钟可扫码即玩的动作闯关体验，把真实景区文化转化成玩家愿意完成、分享并线下跟走的江湖副本。

Current v1 direction:
- Build a Vite + Canvas H5/PWA MVP.
- Preserve the existing Canvas action demo as gameplay foundation.
- Deliver three stages, three weapons, culture cards, local AI-style narration, final travel card, and 老街 -> 古井 -> 城楼 route recommendation.
- Keep the current `gemini-code-1779459048019_副本.html` untouched as reference unless a GSD plan explicitly changes that.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

- Current codebase: standalone HTML5 Canvas demo in `gemini-code-1779459048019_副本.html`.
- Planned v1 stack: Vite + Canvas 2D + DOM/CSS UI overlays.
- AI v1: local fallback templates only; do not put provider API keys in frontend code.
- PWA: add manifest/service-worker metadata during mobile hardening phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

- Use English identifiers for implementation concepts and Chinese display strings for user-facing game/culture copy.
- Keep Canvas/game code independent from AI/network calls.
- Treat scenic/cultural content as structured verified data; AI/fallback rewrites tone but does not invent facts.
- Keep DOM UI for narrator, culture cards, completion card, and route output around the Canvas game surface.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Recommended v1 boundaries:
- `game`: Canvas loop, player, enemies, weapons, stages, collisions, effects.
- `content`: stage definitions, cultural cards, route metadata.
- `narration`: local fallback generation for storyteller lines, title, comments, and route copy.
- `ui`: weapon select, HUD, AI dialogue, culture card modal, completion card, route panel.

The current demo is monolithic. Migration should preserve behavior first, then modularize around these boundaries.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project-local skills found. Use installed GSD skills for planning, execution, verification, UI review, and debugging.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `$gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `$gsd-debug` for investigation and bug fixing
- `$gsd-plan-phase 1` to plan the first phase
- `$gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `$gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` — do not edit manually.
<!-- GSD:profile-end -->
