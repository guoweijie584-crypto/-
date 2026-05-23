import { describe, expect, it } from 'vitest';

import { createAppState } from '../src/app/appState.js';
import { demoContent } from '../src/content/demoContent.js';
import { renderShell } from '../src/ui/shell.js';

describe('renderShell', () => {
  it('renders all reserved product roots and phase copy', () => {
    const root = document.createElement('div');
    const state = createAppState({ narratorText: demoContent.uiPlaceholders.narrator });

    renderShell(root, state, demoContent);

    ['game-root', 'weapon-panel', 'narrator-panel', 'culture-panel', 'completion-panel', 'route-panel'].forEach((id) => {
      expect(root.querySelector(`#${id}`)).toBeTruthy();
    });

    expect(root.textContent).toContain('山河破阵录：古城夜巡');
    expect(root.textContent).toContain('开始夜巡');
    expect(root.textContent).toContain('选择兵器');
    expect(root.textContent).toContain('AI 说书人');
    expect(root.textContent).toContain('文化线索待解锁');
    expect(root.textContent).toContain('江湖游历卡待生成');
    expect(root.textContent).toContain('游览路线待推荐');
  });

  it('updates selected weapon through state events', () => {
    const root = document.createElement('div');
    const state = createAppState();
    const shell = renderShell(root, state, demoContent);

    state.emit('weapon:selected', { weaponId: 'spear' });
    shell.updateWeapon(state.getSnapshot().selectedWeapon);

    expect(root.querySelector('[data-weapon="spear"]').classList.contains('is-active')).toBe(true);
  });
});
