import { describe, expect, it } from 'vitest';

import { createAppState } from '../src/app/appState.js';
import { demoContent } from '../src/content/demoContent.js';
import { renderShell } from '../src/ui/shell.js';

describe('renderShell', () => {
  it('renders all reserved product roots and phase copy', () => {
    const root = document.createElement('div');
    const state = createAppState({ narratorText: demoContent.uiPlaceholders.narrator });

    renderShell(root, state, demoContent);

    ['game-root', 'weapon-panel', 'boss-panel', 'narrator-panel', 'culture-panel', 'completion-panel', 'route-panel'].forEach((id) => {
      expect(root.querySelector(`#${id}`)).toBeTruthy();
    });
    expect(root.querySelector('#victory-panel')).toBeNull();

    expect(root.textContent).toContain('山河破阵录：古城夜巡');
    expect(root.textContent).toContain('开始夜巡');
    expect(root.textContent).toContain('选择兵器');
    expect(root.querySelectorAll('.weapon-choice')).toHaveLength(6);
    expect(root.textContent).toContain('双月匕');
    expect(root.textContent).toContain('月轮刃');
    expect(root.textContent).toContain('符箓折扇');
    expect(root.textContent).toContain('选择功法');
    expect(root.querySelector('#stage-panel')).toBeTruthy();
    expect(root.querySelector('[data-hud="objective"]')).toBeTruthy();
    expect(root.textContent).toContain('老街灯影阵');
    expect(root.textContent).toContain('AI 说书人');
    expect(root.textContent).toContain('文化线索待解锁');
    expect(root.textContent).toContain('江湖游历卡待生成');
    expect(root.textContent).toContain('游览路线待推荐');
    expect(root.textContent).not.toContain('夜灯破雾侠');
    expect(root.textContent).not.toContain('老街 -> 古井 -> 城楼');
  });

  it('updates selected weapon through state events', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    state.emit('weapon:selected', { weaponId: 'fan' });
    shell.updateWeapon(state.getSnapshot().selectedWeapon);

    expect(root.querySelector('[data-weapon="fan"]').classList.contains('is-active')).toBe(true);
  });

  it('renders weapon-specific upgrade choices', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    shell.showUpgradePanel([
      {
        id: 'sword-flow',
        title: '流云剑步',
        school: '身法',
        tier: '轻灵',
        desc: '移动速度提升',
        effects: ['移动速度 +12%', '攻击冷却 -2 帧'],
        tactic: '适合边走位边清理灯影妖。',
        focus: { label: '机动', value: 86 }
      },
      { id: 'sword-wave', title: '青锋剑气', desc: '剑气提升' },
      { id: 'sword-focus', title: '听风破影', desc: '伤害提升' }
    ]);

    expect(root.querySelector('#upgrade-panel').classList.contains('is-hidden')).toBe(false);
    expect(root.textContent).toContain('流云剑步');
    expect(root.textContent).toContain('身法');
    expect(root.textContent).toContain('移动速度 +12%');
    expect(root.textContent).toContain('适合边走位边清理灯影妖。');
    expect(root.querySelector('.upgrade-choice__focus b').getAttribute('style')).toContain('--value:86%');
    expect(root.querySelectorAll('.upgrade-choice')).toHaveLength(3);
  });

  it('updates narrator copy safely', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    shell.updateNarrator('AI 说书人记下新的夜巡旁白');

    expect(root.querySelector('[data-copy="narrator"]').textContent).toBe('AI 说书人记下新的夜巡旁白');
  });

  it('does not render the old blocking victory popup', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    expect(shell.showVictory).toBeUndefined();
    expect(root.querySelector('#victory-panel')).toBeNull();
    expect(root.textContent).not.toContain('破阵成功');
  });
});
