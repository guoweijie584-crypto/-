# 山河破阵录：古城夜巡

## What This Is

《山河破阵录：古城夜巡》是一个 AI 文旅江湖动作小游戏。玩家扫码进入被“遗忘妖雾”笼罩的古城，扮演巡夜少侠，在老街、古井、城楼等景点化成的关卡里用剑、刀、枪破阵闯关，并在每关通关后解锁真实地方文化、景点故事或非遗线索。

它不是普通导览，也不是单纯打怪，而是把文旅内容包装成江湖任务：景点是关卡，历史是剧情，非遗是功法，路线是通关奖励。最终由 AI 说书人根据玩家表现生成专属“江湖游历卡”和真实游览路线，把线上娱乐自然导向线下打卡。

## Core Value

用一段 3-5 分钟可扫码即玩的动作闯关体验，把真实景区文化转化成玩家愿意完成、分享并线下跟走的江湖副本。

## Requirements

### Validated

- ✓ 单文件 Canvas 动作生存 demo 已存在，支持浏览器直接打开运行 — existing
- ✓ 玩家可用 WASD/方向键移动，并用鼠标控制朝向 — existing
- ✓ 左键挥砍、右键投掷武器、空格大招的核心动作循环已实现 — existing
- ✓ 敌人生成、追击/逃离、碰撞伤害、击杀、经验、能量、升级选择已实现 — existing
- ✓ Canvas 游戏画面与 HTML HUD/模态框叠加的结构已验证 — existing
- ✓ 粒子、伤害数字、屏幕震动、剑气/爆炸/大招链路等反馈效果已实现 — existing

### Active

- [ ] 将现有 demo 重命名并重构为《山河破阵录：古城夜巡》的 H5/PWA 项目骨架
- [ ] 保留并整理移动、挥砍、投掷、大招、升级、怪物围攻等动作玩法
- [ ] 实现剑、刀、枪三种武器选择，并让三者在手感和机制上明显不同
- [ ] 实现三关闭环：老街灯影阵、古井回声阵、城楼镇妖阵
- [ ] 实现基础怪物和 Boss：灯影妖、纸人怪、回声/井影类敌人、雾甲守将
- [ ] 每关通关后解锁一张真实文化卡，讲述老街故事、古井传说、城楼/非遗线索
- [ ] 实现 AI 说书人，用江湖口吻引导剧情、关卡目标和文化解锁
- [ ] 根据玩家表现生成称号、通关评语和专属“江湖游历卡”
- [ ] 通关后推荐真实游览路线，第一版为“老街 -> 古井 -> 城楼”
- [ ] 支持手机扫码即玩，完成 3-5 分钟可体验的完整闭环

### Out of Scope

- 大型开放世界或长线 RPG 养成 — 第一版必须保持 3-5 分钟轻体验
- 复杂账号体系、排行榜、社交关系链 — 与景区现场扫码体验的核心价值无关
- 多景区通用后台 CMS — 可先用本地结构化内容验证单景区闭环
- 重度 3D 美术与复杂动画资产 — 第一版优先玩法、文旅闭环和分享传播
- AI 即兴编造景区事实 — 文化内容必须基于真实资料，AI 只做讲述、改写和个性化包装
- 原生 App — 第一版采用 H5/PWA，降低景区活动现场传播门槛

## Context

当前目录中已有 `gemini-code-1779459048019_副本.html`，是一个 734 行的单文件 Canvas 动作生存 demo。它具备可复用的动作玩法基础：移动、鼠标朝向、挥砍、投掷武器、终极技能、敌人围攻、经验升级、随机能力选择、粒子反馈和 HUD。代码库映射已写入 `.planning/codebase/`，作为后续规划和重构依据。

目标产品应面向景区、古城街区、文旅活动现场和文旅局/运营方展示。对外讲法是：这不是一个小游戏，而是一个可以把景区变成江湖副本的互动文旅入口。游客通过扫码进入游戏，在刀剑枪破阵中了解景点故事，完成后获得个性化路线和通关卡，从线上娱乐导向线下游览。

第一版控制为轻量 MVP：一张古城夜景地图，三种武器，三关，几个怪物，一个 Boss，三张文化卡，一张通关游历卡。外层用普通 Web 技术承载武器选择、AI 对话框、文化卡、通关卡和活动页面；游戏部分可继续基于 Canvas，也可在重构时评估 Phaser 3。

## Constraints

- **Platform**: 第一版做成 H5/PWA — 扫码即玩，适合景区、古城街区和活动现场传播
- **Duration**: 完整体验控制在 3-5 分钟 — 便于现场试玩、传播和评审展示
- **Gameplay Scope**: 第一版只做三关、一张地图、三种武器、基础怪物和一个 Boss — 保证闭环可完成
- **Content Integrity**: 景区、历史、非遗信息必须来源于真实资料 — AI 负责表达和个性化，不负责无约束编造事实
- **Existing Code**: 现有 Canvas demo 是玩法基础 — 优先复用已验证的动作循环，再逐步模块化
- **Mobile First**: 必须支持手机操作 — 当前 demo 是键鼠输入，后续需要尽早补触控/虚拟摇杆/按钮
- **AI Safety**: AI API 密钥不能放在前端 — 如需真实模型调用，应通过后端、边缘函数或受控代理

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| H5/PWA 优先，而不是原生 App | 扫码即玩更适合景区现场、文旅活动和快速传播 | — Pending |
| 以现有 Canvas demo 作为玩法起点 | 已验证核心动作手感和反馈，能缩短 MVP 周期 | — Pending |
| 游戏外层用普通 Web UI 承载 AI/文化/路线内容 | 文化卡、说书人、通关卡和分享页更适合 DOM UI | — Pending |
| 第一版只做三关完整闭环 | 比堆功能更能证明“景区变江湖副本”的核心价值 | — Pending |
| AI 不直接发明文化事实 | 文旅项目必须可信，AI 只做讲述、改写、称号和路线包装 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check -> still the right priority?
3. Audit Out of Scope -> reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-23 after initialization*
