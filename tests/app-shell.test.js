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

  it('renders and resets the final travel card', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    shell.updateCompletionCard({
      title: '剑定山河',
      comment: '气血尚足，以剑清出 5/5 处夜巡线索。',
      selectedWeaponName: '剑',
      kills: 52,
      remainingHp: 86,
      completionTime: 213.2,
      clearedStageCount: 5,
      totalStageCount: 5,
      unlockedCards: demoContent.cultureCards
    });

    expect(root.querySelector('#completion-panel').textContent).toContain('江湖游历卡');
    expect(root.querySelector('#completion-panel').textContent).toContain('剑定山河');
    expect(root.querySelector('#completion-panel').textContent).toContain('兵器');
    expect(root.querySelector('#completion-panel').textContent).toContain('剑');
    expect(root.querySelector('#completion-panel').textContent).toContain('52');
    expect(root.querySelector('#completion-panel').textContent).toContain('86');
    expect(root.querySelector('#completion-panel').textContent).toContain('3分33秒');
    expect(root.querySelector('#completion-panel').textContent).toContain('老街灯影阵');

    shell.resetRewardPanels();

    expect(root.querySelector('#completion-panel').textContent).toContain('江湖游历卡待生成');
  });

  it('renders and resets the five-stop route recommendation', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    shell.updateRoute({
      routeText: '老街 -> 古井 -> 石桥 -> 园林 -> 城楼',
      summary: '夜巡路线建议：老街 -> 古井 -> 石桥 -> 园林 -> 城楼。',
      stopLines: [
        '老街：从老街入口进入，先看街巷灯火和沿街铺面。',
        '古井：转入古井点位，观察井沿、水脉与周边巷口。',
        '石桥：沿水巷走到石桥，留意桥面、栏板和河岸灯影。',
        '园林：进入园林曲径，寻找漏窗、框景和转角视线。',
        '城楼：最后登临城楼，回望整条古城夜巡路线。'
      ]
    });

    expect(root.querySelector('#route-panel').textContent).toContain('夜巡游线');
    expect(root.querySelector('#route-panel').textContent).toContain('老街 -> 古井 -> 石桥 -> 园林 -> 城楼');
    expect(root.querySelectorAll('#route-panel li')).toHaveLength(5);
    expect(root.querySelector('#route-panel').textContent).toContain('最后登临城楼');

    shell.resetRewardPanels();

    expect(root.querySelector('#route-panel').textContent).toContain('游览路线待推荐');
  });
});
