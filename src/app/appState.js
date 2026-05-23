const DEFAULT_STATE = {
  status: 'ready',
  selectedWeapon: 'sword',
  selectedUpgrade: null,
  pendingUpgrades: [],
  narratorText: '',
  unlockedCards: [],
  completion: null,
  runSummary: null,
  routeView: null,
  route: []
};

function mergeUnlockedCards(existing = [], incoming = []) {
  const bySpot = new Map(existing.map((card) => [card.spotId, card]));
  incoming.filter(Boolean).forEach((card) => {
    if (!bySpot.has(card.spotId)) {
      bySpot.set(card.spotId, card);
    }
  });
  return [...bySpot.values()].sort((a, b) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0));
}

function getCompletedStageIds(summary = {}) {
  return (summary.stages ?? [])
    .filter((stage) => stage.complete)
    .map((stage) => stage.id);
}

function getCardsForCompletedStages(summary = {}, cultureCards = []) {
  const completed = new Set(getCompletedStageIds(summary));
  return cultureCards.filter((card) => completed.has(card.spotId));
}

export function createAppState(initial = {}) {
  let state = {
    ...DEFAULT_STATE,
    ...initial
  };

  const listeners = new Set();

  function getSnapshot() {
    return typeof structuredClone === 'function'
      ? structuredClone(state)
      : JSON.parse(JSON.stringify(state));
  }

  function notify(eventName, payload) {
    const snapshot = getSnapshot();
    listeners.forEach((listener) => listener(eventName, payload, snapshot));
  }

  function setState(patch) {
    state = {
      ...state,
      ...patch
    };
    notify('state:changed', patch);
    return getSnapshot();
  }

  function emit(eventName, payload = {}) {
    if (eventName === 'weapon:selected') {
      state = { ...state, selectedWeapon: payload.weaponId };
    }

    if (eventName === 'game:upgrade-available') {
      state = { ...state, pendingUpgrades: payload.upgrades ?? [] };
    }

    if (eventName === 'game:upgrade-selected') {
      state = { ...state, selectedUpgrade: payload.upgradeId, pendingUpgrades: [] };
    }

    if (eventName === 'game:started') {
      state = { ...state, status: 'playing' };
    }

    if (eventName === 'game:reset') {
      state = {
        ...state,
        status: 'ready',
        unlockedCards: [],
        completion: null,
        runSummary: null,
        routeView: null,
        narratorText: initial.narratorText ?? ''
      };
    }

    if (eventName === 'culture:unlocked') {
      const card = payload.card ?? payload;
      state = { ...state, unlockedCards: mergeUnlockedCards(state.unlockedCards, [card]) };
    }

    if (eventName === 'narrator:updated') {
      state = { ...state, narratorText: payload.text ?? '' };
    }

    if (eventName === 'game:snapshot') {
      state = { ...state, status: payload.status ?? state.status };
    }

    if (eventName === 'game:completed') {
      const rawSummary = payload.summary ?? payload.runSummary ?? payload;
      const completedCards = getCardsForCompletedStages(rawSummary, payload.cultureCards ?? []);
      const unlockedCards = mergeUnlockedCards(state.unlockedCards, [
        ...completedCards,
        ...(payload.unlockedCards ?? [])
      ]);
      state = {
        ...state,
        status: 'victory',
        completion: payload.completion ?? payload,
        runSummary: rawSummary,
        routeView: payload.routeView ?? state.routeView,
        unlockedCards,
        narratorText: payload.narratorText ?? state.narratorText
      };
    }

    notify(eventName, payload);
    return getSnapshot();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    subscribe,
    emit,
    setState,
    getSnapshot
  };
}
