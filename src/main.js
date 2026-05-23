import './styles.css';

import { createAppState } from './app/appState.js';
import { demoContent } from './content/demoContent.js';
import { mountGame } from './game/GameApp.js';
import { renderShell } from './ui/shell.js';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Missing #app root');
}

const appState = createAppState({
  narratorText: demoContent.uiPlaceholders.narrator,
  route: demoContent.route
});

const shell = renderShell(root, appState, demoContent);
const gameRoot = shell.root.querySelector('#game-root');

const game = mountGame(gameRoot, {
  selectedWeapon: appState.getSnapshot().selectedWeapon,
  emit: (eventName, payload) => appState.emit(eventName, payload)
});

appState.emit('game:ready', game.getSnapshot());

shell.startButton.addEventListener('click', () => {
  appState.emit('game:started', { selectedWeapon: appState.getSnapshot().selectedWeapon });
  game.start();
});

shell.resetButton.addEventListener('click', () => {
  appState.emit('game:reset');
  game.reset();
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
});

shell.updateHud(game.getSnapshot());
