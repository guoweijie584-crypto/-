import {
  Archive,
  BadgeInfo,
  CircleDot,
  Gauge,
  MapPinned,
  Pause,
  Play,
  Save,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  X,
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
        <div class="topbar-actions">
          <button class="ghost-action" type="button" data-action="pause" aria-pressed="false">
            <i data-lucide="pause"></i>
            <span data-copy="pause-label">暂停</span>
          </button>
          <button class="ghost-action" type="button" data-action="save">
            <i data-lucide="save"></i>
            <span data-copy="save-label">存档</span>
          </button>
          <button class="ghost-action" type="button" data-action="archive">
            <i data-lucide="archive"></i>
            <span>档案</span>
          </button>
          <button class="primary-action" type="button" data-action="start">
            <i data-lucide="sparkles"></i>
            <span data-copy="start-label">开始夜巡</span>
          </button>
        </div>
      </header>

      <div id="pause-overlay" class="pause-overlay is-hidden" aria-live="polite">
        <div class="pause-card">
          <i data-lucide="pause"></i>
          <h2>已暂停</h2>
          <p>江湖暂歇，再点暂停继续巡夜。</p>
        </div>
      </div>

      <aside id="archive-panel" class="panel archive-panel is-hidden" aria-label="存档列表">
        <header class="archive-header">
          <div class="panel-title">
            <i data-lucide="archive"></i>
            <h2>存档列表</h2>
          </div>
          <button class="icon-action archive-close" type="button" data-action="archive-close" aria-label="关闭">
            <i data-lucide="x"></i>
          </button>
        </header>
        <p class="archive-empty" data-copy="archive-empty">还没有任何存档，点击"存档"按钮记录当前进度。</p>
        <ul class="archive-list" data-list="archive"></ul>
      </aside>

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

      <aside id="boss-panel" class="panel boss-panel is-hidden" data-panel="boss" aria-label="雾甲守将">
        <div class="panel-title">
          <i data-lucide="shield"></i>
          <h2 data-hud="boss-title">雾甲守将</h2>
        </div>
        <div class="boss-meter">
          <span data-hud="boss-phase">破甲前</span>
          <strong data-hud="boss-hp">0 / 0</strong>
        </div>
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
          <h2 data-culture="heading">文化线索待解锁</h2>
        </div>
        <div data-culture="body">
          <p>${content.cultureCards[0].teaser}</p>
        </div>
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

  shell.querySelector('[data-copy="narrator"]').textContent = state.getSnapshot().narratorText || content.uiPlaceholders.narrator;

  createIcons({
    icons: {
      Archive,
      BadgeInfo,
      MapPinned,
      Pause,
      Play,
      Save,
      ScrollText,
      Shield,
      Sparkles,
      Swords,
      Trash2,
      X
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
      const objective = snapshot.stage.objective;
      const ultimateTask = objective.ultimateTask ? `｜${objective.ultimateTask}` : '';
      shell.querySelector('[data-hud="objective"]').textContent = `${objective.label} ${objective.current} / ${objective.target} ${ultimateTask}`;
    }
    updateBoss(snapshot.boss);
  }

  function updateWeapon(weaponId) {
    shell.querySelectorAll('.weapon-choice').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.weapon === weaponId);
    });
  }

  function updateNarrator(text) {
    shell.querySelector('[data-copy="narrator"]').textContent = text || content.uiPlaceholders.narrator;
  }

  function updateCultureCards(cards = [], latestCard = null) {
    const panel = shell.querySelector('#culture-panel');
    const heading = panel.querySelector('[data-culture="heading"]');
    const body = panel.querySelector('[data-culture="body"]');
    body.innerHTML = '';

    if (cards.length === 0) {
      heading.textContent = content.uiPlaceholders.culture;
      const placeholder = document.createElement('p');
      placeholder.textContent = content.cultureCards[0]?.teaser ?? '通关后解锁文化线索。';
      body.appendChild(placeholder);
      return;
    }

    const activeCard = latestCard ?? cards[cards.length - 1];
    heading.textContent = '已解锁文化线索';

    const count = document.createElement('p');
    count.className = 'culture-unlock-count';
    count.textContent = `已解锁 ${cards.length} / ${content.cultureCards.length} 处`;

    const card = document.createElement('article');
    card.className = 'culture-card';

    const title = document.createElement('strong');
    title.textContent = activeCard.title;

    const subtitle = document.createElement('span');
    subtitle.className = 'culture-card__subtitle';
    subtitle.textContent = activeCard.subtitle ?? activeCard.teaser;

    const bodyCopy = document.createElement('p');
    bodyCopy.textContent = activeCard.body ?? activeCard.teaser;

    const hint = document.createElement('p');
    hint.className = 'culture-card__hint';
    hint.textContent = activeCard.visitTip ?? activeCard.heritageHint ?? activeCard.sourceNote;

    const tags = document.createElement('div');
    tags.className = 'culture-card__tags';
    (activeCard.tags ?? []).forEach((tagText) => {
      const tag = document.createElement('span');
      tag.textContent = tagText;
      tags.appendChild(tag);
    });

    card.append(title, subtitle, bodyCopy, hint, tags);

    const list = document.createElement('ol');
    list.className = 'culture-route-list';
    cards.forEach((item) => {
      const entry = document.createElement('li');
      entry.textContent = item.title;
      list.appendChild(entry);
    });

    body.append(count, card, list);
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
      const header = document.createElement('span');
      header.className = 'upgrade-choice__header';
      const icon = document.createElement('span');
      icon.className = 'upgrade-choice__icon';
      icon.innerHTML = '<i data-lucide="circle-dot"></i>';
      const title = document.createElement('strong');
      title.textContent = upgrade.title;
      const tags = document.createElement('span');
      tags.className = 'upgrade-choice__tags';
      [upgrade.school, upgrade.tier].filter(Boolean).forEach((label) => {
        const tag = document.createElement('em');
        tag.textContent = label;
        tags.appendChild(tag);
      });
      header.append(icon, title, tags);

      const desc = document.createElement('span');
      desc.className = 'upgrade-choice__summary';
      desc.textContent = upgrade.desc;

      const effects = document.createElement('span');
      effects.className = 'upgrade-choice__effects';
      (upgrade.effects ?? []).forEach((effect) => {
        const item = document.createElement('span');
        item.textContent = effect;
        effects.appendChild(item);
      });

      const focus = document.createElement('span');
      focus.className = 'upgrade-choice__focus';
      const focusLabel = upgrade.focus?.label ?? '收益';
      const focusValue = Math.max(0, Math.min(100, upgrade.focus?.value ?? 70));
      focus.innerHTML = `
        <span><i data-lucide="gauge"></i>${focusLabel}</span>
        <b style="--value:${focusValue}%"></b>
      `;

      const tactic = document.createElement('span');
      tactic.className = 'upgrade-choice__tactic';
      tactic.textContent = upgrade.tactic ?? '选择后立即生效。';

      button.append(header, desc, effects, focus, tactic);
      button.addEventListener('click', () => onSelect(upgrade.id));
      list.appendChild(button);
    });
    createIcons({
      icons: {
        CircleDot,
        Gauge
      }
    });
    panel.classList.remove('is-hidden');
  }

  function hideUpgradePanel() {
    shell.querySelector('#upgrade-panel').classList.add('is-hidden');
  }

  function updateBoss(boss) {
    const panel = shell.querySelector('#boss-panel');
    if (!boss?.active) {
      panel.classList.add('is-hidden');
      return;
    }
    panel.classList.remove('is-hidden');
    shell.querySelector('[data-hud="boss-title"]').textContent = boss.title;
    shell.querySelector('[data-hud="boss-phase"]').textContent = boss.phase === 2 ? '雾甲觉醒' : '破甲前';
    shell.querySelector('[data-hud="boss-hp"]').textContent = `${boss.hp} / ${boss.maxHp}`;
  }

  function setPauseState(isPaused) {
    const button = shell.querySelector('[data-action="pause"]');
    button.setAttribute('aria-pressed', String(Boolean(isPaused)));
    button.querySelector('[data-copy="pause-label"]').textContent = isPaused ? '继续' : '暂停';

    const existingIcon = button.querySelector('svg, [data-lucide]');
    const replacement = document.createElement('i');
    replacement.setAttribute('data-lucide', isPaused ? 'play' : 'pause');
    if (existingIcon) {
      existingIcon.replaceWith(replacement);
    } else {
      button.prepend(replacement);
    }
    createIcons({ icons: { Pause, Play } });

    shell.querySelector('#pause-overlay').classList.toggle('is-hidden', !isPaused);
  }

  function flashSaveStatus(message = '已存档') {
    const label = shell.querySelector('[data-copy="save-label"]');
    if (!label) return;
    label.textContent = message;
    clearTimeout(flashSaveStatus._timer);
    flashSaveStatus._timer = setTimeout(() => {
      label.textContent = '存档';
    }, 1400);
  }

  function setStartLabel(label) {
    const node = shell.querySelector('[data-copy="start-label"]');
    if (node) node.textContent = label;
  }

  function formatTimestamp(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function showArchivePanel() {
    shell.querySelector('#archive-panel').classList.remove('is-hidden');
  }

  function hideArchivePanel() {
    shell.querySelector('#archive-panel').classList.add('is-hidden');
  }

  function isArchivePanelVisible() {
    return !shell.querySelector('#archive-panel').classList.contains('is-hidden');
  }

  function renderArchive(entries = [], handlers = {}) {
    const list = shell.querySelector('[data-list="archive"]');
    const empty = shell.querySelector('[data-copy="archive-empty"]');
    list.innerHTML = '';
    const hasEntries = entries.length > 0;
    empty.classList.toggle('is-hidden', hasEntries);

    entries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'archive-item';
      item.dataset.archiveId = entry.id;

      const meta = document.createElement('div');
      meta.className = 'archive-item__meta';
      const title = document.createElement('strong');
      title.textContent = entry.name;
      const time = document.createElement('span');
      time.textContent = formatTimestamp(entry.savedAt);
      const stage = document.createElement('span');
      stage.className = 'archive-item__stage';
      stage.textContent = entry.summary ?? '';
      meta.append(title, time, stage);

      const actions = document.createElement('div');
      actions.className = 'archive-item__actions';
      const loadButton = document.createElement('button');
      loadButton.type = 'button';
      loadButton.className = 'ghost-action archive-item__load';
      loadButton.textContent = '恢复';
      loadButton.addEventListener('click', () => handlers.onLoad?.(entry.id));
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'icon-action archive-item__delete';
      deleteButton.setAttribute('aria-label', '删除');
      deleteButton.innerHTML = '<i data-lucide="trash-2"></i>';
      deleteButton.addEventListener('click', () => handlers.onDelete?.(entry.id));
      actions.append(loadButton, deleteButton);

      item.append(meta, actions);
      list.appendChild(item);
    });

    createIcons({ icons: { Trash2 } });
  }

  return {
    root: shell,
    startButton: shell.querySelector('[data-action="start"]'),
    resetButton: shell.querySelector('[data-action="reset"]'),
    pauseButton: shell.querySelector('[data-action="pause"]'),
    saveButton: shell.querySelector('[data-action="save"]'),
    archiveButton: shell.querySelector('[data-action="archive"]'),
    archiveCloseButton: shell.querySelector('[data-action="archive-close"]'),
    updateHud,
    updateWeapon,
    updateNarrator,
    updateCultureCards,
    showUpgradePanel,
    hideUpgradePanel,
    setPauseState,
    flashSaveStatus,
    setStartLabel,
    renderArchive,
    showArchivePanel,
    hideArchivePanel,
    isArchivePanelVisible
  };
}
