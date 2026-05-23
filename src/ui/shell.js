import {
  BadgeInfo,
  MapPinned,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  createIcons
} from 'lucide';

export function renderShell(root, state, content) {
  root.innerHTML = '';

  const shell = document.createElement('main');
  shell.className = 'app-shell';
  shell.innerHTML = `
    <section id="game-root" class="game-root" aria-label="古城夜巡战斗区域"></section>

    <section class="shell-layer" aria-label="游戏界面">
      <header class="topbar">
        <div class="brand-block">
          <p class="eyebrow">古城夜巡</p>
          <h1>${content.title}</h1>
        </div>
        <button class="primary-action" type="button" data-action="start">
          <i data-lucide="sparkles"></i>
          <span>开始夜巡</span>
        </button>
      </header>

      <aside class="combat-hud" aria-label="战斗状态">
        <div id="stage-panel" class="stage-panel" data-panel="stage">
          <span data-hud="stage-title">老街灯影阵</span>
          <strong data-hud="objective">击退妖影，点亮 3 盏灯 0 / 3</strong>
        </div>
        <div class="meter">
          <span>生命</span>
          <strong data-hud="hp">100 / 100</strong>
        </div>
        <div class="meter">
          <span>经验</span>
          <strong data-hud="exp">0 / 100</strong>
        </div>
        <div class="meter">
          <span>能量</span>
          <strong data-hud="energy">0 / 100</strong>
        </div>
        <div class="hud-line">
          <span>等级 <strong data-hud="level">1</strong></span>
          <span>击杀 <strong data-hud="kills">0</strong></span>
        </div>
      </aside>

      <aside id="weapon-panel" class="panel weapon-panel" aria-label="选择兵器">
        <div class="panel-title">
          <i data-lucide="swords"></i>
          <h2>选择兵器</h2>
        </div>
        <div class="weapon-list"></div>
      </aside>

      <aside id="upgrade-panel" class="panel upgrade-panel is-hidden" data-panel="upgrade" aria-label="选择功法">
        <div class="panel-title">
          <i data-lucide="sparkles"></i>
          <h2>选择功法</h2>
        </div>
        <div class="upgrade-list"></div>
      </aside>

      <aside id="narrator-panel" class="panel narrator-panel" aria-label="AI 说书人">
        <div class="panel-title">
          <i data-lucide="scroll-text"></i>
          <h2>AI 说书人</h2>
        </div>
        <p data-copy="narrator"></p>
      </aside>

      <aside id="culture-panel" class="panel compact-panel culture-panel" aria-label="文化线索">
        <div class="panel-title">
          <i data-lucide="badge-info"></i>
          <h2>文化线索待解锁</h2>
        </div>
        <p>${content.cultureCards[0].teaser}</p>
      </aside>

      <aside id="completion-panel" class="panel compact-panel completion-panel" aria-label="江湖游历卡">
        <div class="panel-title">
          <i data-lucide="shield"></i>
          <h2>江湖游历卡待生成</h2>
        </div>
        <p>尚未破阵</p>
      </aside>

      <aside id="route-panel" class="panel compact-panel route-panel" aria-label="游览路线">
        <div class="panel-title">
          <i data-lucide="map-pinned"></i>
          <h2>游览路线待推荐</h2>
        </div>
        <p>通关后解锁文化线索与游览路线。</p>
      </aside>

      <button class="icon-action reset-action" type="button" data-action="reset" aria-label="重新开始">
        <span>重新开始</span>
      </button>
    </section>
  `;

  root.appendChild(shell);

  const weaponList = shell.querySelector('.weapon-list');
  content.weapons.forEach((weapon) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `weapon-choice${weapon.id === state.getSnapshot().selectedWeapon ? ' is-active' : ''}`;
    button.dataset.weapon = weapon.id;
    button.innerHTML = `<strong>${weapon.name}</strong><span>${weapon.trait}</span>`;
    button.addEventListener('click', () => state.emit('weapon:selected', { weaponId: weapon.id }));
    weaponList.appendChild(button);
  });

  shell.querySelector('[data-copy="narrator"]').textContent = content.uiPlaceholders.narrator;

  createIcons({
    icons: {
      BadgeInfo,
      MapPinned,
      ScrollText,
      Shield,
      Sparkles,
      Swords
    }
  });

  function updateHud(snapshot) {
    if (!snapshot?.player) return;
    shell.querySelector('[data-hud="hp"]').textContent = `${snapshot.player.hp} / ${snapshot.player.maxHp}`;
    shell.querySelector('[data-hud="exp"]').textContent = `${snapshot.player.exp} / ${snapshot.player.maxExp}`;
    shell.querySelector('[data-hud="energy"]').textContent = `${snapshot.player.energy} / ${snapshot.player.maxEnergy}`;
    shell.querySelector('[data-hud="level"]').textContent = snapshot.player.level;
    shell.querySelector('[data-hud="kills"]').textContent = snapshot.kills;
    if (snapshot.stage?.objective) {
      shell.querySelector('[data-hud="stage-title"]').textContent = snapshot.stage.title;
      shell.querySelector('[data-hud="objective"]').textContent = `${snapshot.stage.objective.label} ${snapshot.stage.objective.current} / ${snapshot.stage.objective.target}`;
    }
  }

  function updateWeapon(weaponId) {
    shell.querySelectorAll('.weapon-choice').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.weapon === weaponId);
    });
  }

  function showUpgradePanel(upgrades = [], onSelect = () => {}) {
    const panel = shell.querySelector('#upgrade-panel');
    const list = panel.querySelector('.upgrade-list');
    list.innerHTML = '';
    upgrades.forEach((upgrade) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'upgrade-choice';
      button.dataset.upgrade = upgrade.id;
      const title = document.createElement('strong');
      title.textContent = upgrade.title;
      const desc = document.createElement('span');
      desc.textContent = upgrade.desc;
      button.append(title, desc);
      button.addEventListener('click', () => onSelect(upgrade.id));
      list.appendChild(button);
    });
    panel.classList.remove('is-hidden');
  }

  function hideUpgradePanel() {
    shell.querySelector('#upgrade-panel').classList.add('is-hidden');
  }

  return {
    root: shell,
    startButton: shell.querySelector('[data-action="start"]'),
    resetButton: shell.querySelector('[data-action="reset"]'),
    updateHud,
    updateWeapon,
    showUpgradePanel,
    hideUpgradePanel
  };
}
