# Phase 2: Three-Stage Combat Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-23
**Phase:** 2-Three-Stage Combat Loop
**Areas discussed:** Weapon feel, Stage rhythm, Enemies and boss, Victory loop

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| 三武器手感 | How different sword, blade, and spear should feel. | |
| 三关节奏 | How old street, ancient well, and city tower stage objectives should progress. | |
| 敌人与 Boss | How distinct enemy and boss behavior should be. | |
| 胜利闭环 | What run summary data and victory UI Phase 2 should output. | |
| 全部讨论 | Discuss all Phase 2 gray areas. | ✓ |

**User's choice:** 5
**Notes:** User chose to discuss all Phase 2 gray areas.

---

## Weapon Feel

| Option | Description | Selected |
|--------|-------------|----------|
| 轻量差异 | Sword, blade, and spear share the existing attack system with stat differences only. | |
| 核心机制差异 | Sword keeps sword-wave identity, blade gets broad/circular strikes, spear gets dash penetration. | |
| 强差异 + 成长分支 | Weapons have distinct mechanics plus weapon-specific growth branches. | ✓ |

**User's choice:** 3
**Notes:** The user wants weapon choice to meaningfully affect play, not just stats.

| Option | Description | Selected |
|--------|-------------|----------|
| 每把武器 2 个固定强化 | Two fixed upgrades per weapon. | |
| 每把武器 3 个可选强化池 | Level-up choices are drawn from the selected weapon's own upgrade pool. | ✓ |
| 每把武器小技能树 | Two or more tree-like routes per weapon. | |

**User's choice:** 2
**Notes:** Preserve the current random upgrade-choice feel while making each weapon feel like a distinct `功法`.

---

## Stage Rhythm

| Option | Description | Selected |
|--------|-------------|----------|
| 每关不同目标 | Old street fight/light, ancient well collect/dodge, city tower defend/break into boss. | ✓ |
| 统一击杀推进 | All stages progress through kill count only. | |
| 计时生存推进 | Stages advance by surviving timers. | |

**User's choice:** 1
**Notes:** User wants stronger dungeon/objective identity than kill-count-only progression.

| Option | Description | Selected |
|--------|-------------|----------|
| 极简目标 | Kill 12 enemies, collect 5 fragments, kill 1 elite. | |
| 标准目标 | Kill and light 3 lamps; collect fragments and dodge echo waves; hold gate or break talismans before boss. | ✓ |
| 高表现目标 | Each stage has small mechanisms, independent prompts, and special fail states. | |

**User's choice:** 2
**Notes:** The chosen standard target gives each stage a clear verb while keeping Phase 2 feasible.

---

## Enemies And Boss

| Option | Description | Selected |
|--------|-------------|----------|
| 轻量换皮 | Reuse chase/flee behavior and only change names, colors, and stats. | |
| 行为差异 | Fast chase, group surround, ranged/ripple interference, boss charge and area slash. | ✓ |
| 强机制敌人 | Every enemy has distinct skills, weak points, and counters. | |

**User's choice:** 2
**Notes:** Lock enemy behaviors as: `灯影妖` fast chase, `纸人怪` group surround, `井影` ranged/ripple interference, `雾甲守将` boss charge and area slash.

| Option | Description | Selected |
|--------|-------------|----------|
| 单阶段 Boss | Boss has charge and area slash only. | |
| 两阶段 Boss | At half HP, boss adds fog armor and/or summons paper enemies. | ✓ |
| 三阶段 Boss | Boss progressively layers charge, shield, summon, and full-screen fog. | |

**User's choice:** 2
**Notes:** Boss should feel final without expanding into a high-risk multi-phase encounter.

---

## Victory Loop

| Option | Description | Selected |
|--------|-------------|----------|
| 基础数据 | Weapon, kills, remaining HP, completion time, victory flag. | |
| 标准数据 | Basic data plus stage completion, fragments, boss phase, upgrades, and damage taken. | ✓ |
| 详细数据 | Standard data plus hit rate, skill counts, per-stage time, and route preference. | |

**User's choice:** 2
**Notes:** Phase 2 should emit enough summary data for Phase 3 title/comment/card generation without over-instrumenting.

| Option | Description | Selected |
|--------|-------------|----------|
| 只进入胜利状态并暴露 summary 事件 | No visible Phase 2 completion UI beyond state/event. | |
| 显示简版胜利面板 | Show `破阵成功` and basic performance summary. | |
| 先做完整通关卡雏形 | Start building the full travel-card experience in Phase 2. | ✓ |

**User's choice:** 3
**Notes:** This was identified as likely Phase 3 scope creep, so it was narrowed before locking.

| Option | Description | Selected |
|--------|-------------|----------|
| 接受收窄边界 | Build victory panel plus `江湖游历卡` placeholder shell, but no AI/culture/route content. | ✓ |
| 坚持完整通关卡雏形 | Allow Phase 2 to enter Phase 3 culture/AI/route scope. | |

**User's choice:** 1
**Notes:** Final locked boundary: Phase 2 may show a victory panel and placeholder shell only; Phase 3 owns full card, AI copy, culture content, and route.

---

## the agent's Discretion

- Tune exact objective counts, enemy stats, boss HP, cooldowns, and spawn rates during planning/execution to hit the 3-5 minute target loop.
- Use Canvas shapes/effects for objective and enemy visuals until a real art pipeline exists.

## Deferred Ideas

- Full travel card, culture card content, AI-generated title/comment, and route recommendation belong to Phase 3.
- Touch controls and PWA hardening belong to Phase 4.
- Full weapon skill trees, three-phase boss, detailed combat analytics, and per-enemy weak-point systems are later expansion candidates.
