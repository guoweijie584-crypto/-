const DEFAULT_STATE = {
  status: 'ready',
  selectedWeapon: 'sword',
  narratorText: '',
  unlockedCards: [],
  completion: null,
  route: []
};

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

    if (eventName === 'game:started') {
      state = { ...state, status: 'playing' };
    }

    if (eventName === 'game:reset') {
      state = { ...state, status: 'ready' };
    }

    if (eventName === 'game:snapshot') {
      state = { ...state, status: payload.status ?? state.status };
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
