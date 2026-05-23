const SOUND_PROFILES = {
  attack: { type: 'sawtooth', start: 620, end: 260, duration: 0.11, gain: 0.08 },
  hit: { type: 'square', start: 180, end: 90, duration: 0.08, gain: 0.07 },
  enemyDeath: { type: 'triangle', start: 260, end: 70, duration: 0.18, gain: 0.08 },
  playerDeath: { type: 'sawtooth', start: 180, end: 38, duration: 0.55, gain: 0.11 },
  upgrade: { type: 'triangle', start: 420, end: 840, duration: 0.24, gain: 0.07 },
  stage: { type: 'sine', start: 360, end: 720, duration: 0.32, gain: 0.06 },
  victory: { type: 'triangle', start: 520, end: 1040, duration: 0.5, gain: 0.08 },
  weaponSelect: { type: 'sine', start: 520, end: 620, duration: 0.09, gain: 0.05 },
  throw: { type: 'sawtooth', start: 360, end: 120, duration: 0.16, gain: 0.07 },
  pickup: { type: 'triangle', start: 520, end: 760, duration: 0.12, gain: 0.06 },
  ultimate: { type: 'sawtooth', start: 160, end: 980, duration: 0.42, gain: 0.09 }
};

export function createSoundController(globalScope = globalThis) {
  const AudioContextCtor = globalScope.AudioContext ?? globalScope.webkitAudioContext;
  let ctx = null;
  let muted = false;

  function getContext() {
    if (!AudioContextCtor || muted) return null;
    if (!ctx) ctx = new AudioContextCtor();
    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      ctx.resume();
    }
    return ctx;
  }

  function play(name) {
    const profile = SOUND_PROFILES[name];
    const audio = profile ? getContext() : null;
    if (!audio) return false;

    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, profile.end), now + profile.duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(profile.gain, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + profile.duration + 0.02);
    return true;
  }

  return {
    play,
    setMuted(value) {
      muted = Boolean(value);
    },
    get muted() {
      return muted;
    }
  };
}
