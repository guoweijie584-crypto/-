import './styles.css';

import { createAppState } from './app/appState.js';
import { demoContent } from './content/demoContent.js';
import { mountGame } from './game/GameApp.js';
import {
  createCompletionComment,
  createCompletionNarration,
  createCultureUnlockNarration,
  createOnboardingNarration,
  createRouteRecommendation,
  createStageNarration,
  createTravelTitle
} from './narration/localNarrator.js';
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

function getWeaponLabel(weaponId) {
  return demoContent.weapons.find((item) => item.id === weaponId)?.name ?? demoContent.weapons[0].name;
}

function getClearedStageCount(summary = {}) {
  return (summary.stages ?? []).filter((stage) => stage.complete).length;
}

function removeLegacyVictoryPanel() {
  document.querySelector('#victory-panel')?.remove();
}

const appState = createAppState({
  narratorText: createOnboardingNarration(demoContent),
  route: demoContent.route,
  cultureCards: demoContent.cultureCards,
  selectedWeapon: savedRun?.selectedWeapon ?? 'sword'
});

const shell = renderShell(root, appState, demoContent);
removeLegacyVictoryPanel();
const gameRoot = shell.root.querySelector('#game-root');

const game = mountGame(gameRoot, {
  selectedWeapon: appState.getSnapshot().selectedWeapon,
  emit: (eventName, payload) => {
    if (eventName === 'game:completed') {
      const unlockedCards = demoContent.cultureCards.filter((card) => (
        (payload.stages ?? []).some((stage) => stage.id === card.spotId && stage.complete)
      ));
      const routeView = createRouteRecommendation(demoContent.route, unlockedCards);
      const completion = {
        title: createTravelTitle(payload, demoContent),
        comment: createCompletionComment(payload, unlockedCards, demoContent),
        selectedWeaponName: getWeaponLabel(payload.selectedWeapon),
        kills: payload.kills ?? 0,
        remainingHp: payload.remainingHp ?? 0,
        completionTime: payload.completionTime ?? 0,
        clearedStageCount: getClearedStageCount(payload),
        totalStageCount: demoContent.route.length,
        summary: payload,
        unlockedCards
      };
      appState.emit(eventName, {
        summary: payload,
        cultureCards: demoContent.cultureCards,
        unlockedCards,
        completion,
        routeView,
        narratorText: createCompletionNarration(payload, unlockedCards, demoContent)
      });
      return;
    }
    appState.emit(eventName, payload);
  }
});

let hasSavedRun = false;
if (savedRun && game.loadSnapshot(savedRun)) {
  hasSavedRun = true;
  shell.setStartLabel('继续夜巡');
  shell.updateWeapon(game.getSnapshot().selectedWeapon);
}

appState.emit('game:ready', game.getSnapshot());
shell.updateNarrator(appState.getSnapshot().narratorText);

function getUnlockedStageCards(gameSnapshot, appSnapshot) {
  const unlockedIds = new Set(appSnapshot.unlockedCards.map((card) => card.spotId));
  const completedIds = new Set(
    (gameSnapshot.stageStatus ?? [])
      .filter((stage) => stage.complete)
      .map((stage) => stage.id)
  );
  return demoContent.cultureCards.filter((card) => completedIds.has(card.spotId) && !unlockedIds.has(card.spotId));
}

shell.startButton.addEventListener('click', () => {
  appState.emit('game:started', { selectedWeapon: appState.getSnapshot().selectedWeapon });
  appState.emit('narrator:updated', { text: createOnboardingNarration(demoContent) });
  shell.setStartLabel('开始夜巡');
  hasSavedRun = false;
  game.start();
});

shell.resetButton.addEventListener('click', () => {
  clearSavedRun();
  hasSavedRun = false;
  shell.setStartLabel('开始夜巡');
  appState.emit('game:reset');
  shell.resetRewardPanels();
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

  if (eventName === 'game:stage-changed') {
    const weapon = demoContent.weapons.find((item) => item.id === snapshot.selectedWeapon);
    appState.emit('narrator:updated', { text: createStageNarration(payload.stage, { weapon }) });
    getUnlockedStageCards(payload, snapshot).forEach((card) => {
      appState.emit('culture:unlocked', { card });
    });
  }

  if (eventName === 'culture:unlocked') {
    const weapon = demoContent.weapons.find((item) => item.id === snapshot.selectedWeapon);
    appState.emit('narrator:updated', { text: createCultureUnlockNarration(payload.card ?? payload, { weapon }) });
    shell.updateCultureCards(snapshot.unlockedCards, payload.card ?? payload);
  }

  if (eventName === 'narrator:updated') {
    shell.updateNarrator(snapshot.narratorText);
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
    shell.updateNarrator(snapshot.narratorText);
    shell.updateCultureCards(snapshot.unlockedCards, snapshot.unlockedCards.at(-1));
    shell.updateCompletionCard(snapshot.completion);
    shell.updateRoute(snapshot.routeView);
    removeLegacyVictoryPanel();
  }
});

shell.updateHud(game.getSnapshot());
shell.setPauseState(game.isPaused());
if (hasSavedRun) shell.flashSaveStatus('读取存档');
