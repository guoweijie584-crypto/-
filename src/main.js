import './styles.css';

import { createAppState } from './app/appState.js';
import { demoContent } from './content/demoContent.js';
import { mountGame } from './game/GameApp.js';
import { renderShell } from './ui/shell.js';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Missing #app root');
}

const SAVE_KEY = 'shanhe-pozhen:save';

function readSavedRun() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('readSavedRun failed', error);
    return null;
  }
}

function writeSavedRun(snapshot) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    return true;
  } catch (error) {
    console.warn('writeSavedRun failed', error);
    return false;
  }
}

function clearSavedRun() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn('clearSavedRun failed', error);
  }
}

const savedRun = readSavedRun();

function removeLegacyVictoryPanel() {
  document.querySelector('#victory-panel')?.remove();
}

const appState = createAppState({
  narratorText: demoContent.uiPlaceholders.narrator,
  route: demoContent.route,
  selectedWeapon: savedRun?.selectedWeapon ?? 'sword'
});

const shell = renderShell(root, appState, demoContent);
removeLegacyVictoryPanel();
const gameRoot = shell.root.querySelector('#game-root');

const game = mountGame(gameRoot, {
  selectedWeapon: appState.getSnapshot().selectedWeapon,
  emit: (eventName, payload) => appState.emit(eventName, payload)
});

let hasSavedRun = false;
if (savedRun && game.loadSnapshot(savedRun)) {
  hasSavedRun = true;
  shell.setStartLabel('继续夜巡');
  shell.updateWeapon(game.getSnapshot().selectedWeapon);
}

appState.emit('game:ready', game.getSnapshot());

shell.startButton.addEventListener('click', () => {
  appState.emit('game:started', { selectedWeapon: appState.getSnapshot().selectedWeapon });
  shell.setStartLabel('开始夜巡');
  hasSavedRun = false;
  game.start();
});

shell.resetButton.addEventListener('click', () => {
  clearSavedRun();
  hasSavedRun = false;
  shell.setStartLabel('开始夜巡');
  appState.emit('game:reset');
  game.reset();
});

shell.pauseButton.addEventListener('click', () => {
  const paused = game.togglePause();
  shell.setPauseState(paused);
});

shell.root.querySelector('#pause-overlay .pause-card').addEventListener('click', () => {
  if (game.isPaused()) {
    game.setPaused(false);
    shell.setPauseState(false);
  }
});

shell.saveButton.addEventListener('click', () => {
  const snapshot = game.saveSnapshot();
  const ok = writeSavedRun(snapshot);
  shell.flashSaveStatus(ok ? '已存档' : '存档失败');
  if (ok) hasSavedRun = true;
});

appState.subscribe((eventName, payload, snapshot) => {
  if (eventName === 'game:snapshot') {
    shell.updateHud(payload);
  }

  if (eventName === 'weapon:selected') {
    shell.updateWeapon(snapshot.selectedWeapon);
    game.setWeapon(snapshot.selectedWeapon);
  }

  if (eventName === 'game:upgrade-available') {
    shell.showUpgradePanel(payload.upgrades, (upgradeId) => {
      game.selectUpgrade(upgradeId);
    });
  }

  if (eventName === 'game:upgrade-selected') {
    shell.hideUpgradePanel();
  }

  if (eventName === 'game:paused') {
    shell.setPauseState(Boolean(payload?.paused));
  }

  if (eventName === 'game:completed') {
    clearSavedRun();
    hasSavedRun = false;
    shell.setStartLabel('再战一次');
    removeLegacyVictoryPanel();
  }
});

shell.updateHud(game.getSnapshot());
shell.setPauseState(game.isPaused());
if (hasSavedRun) shell.flashSaveStatus('读取存档');
