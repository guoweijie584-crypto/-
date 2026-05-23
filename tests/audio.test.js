import { describe, expect, it, vi } from 'vitest';

import { createSoundController } from '../src/game/audio.js';

function createAudioContextMock() {
  const oscillator = {
    type: 'sine',
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn()
  };
  const gain = {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    },
    connect: vi.fn()
  };
  const AudioContext = vi.fn(() => ({
    currentTime: 1,
    state: 'running',
    destination: {},
    createOscillator: vi.fn(() => oscillator),
    createGain: vi.fn(() => gain)
  }));
  return { AudioContext, oscillator, gain };
}

describe('createSoundController', () => {
  it('plays semantic Web Audio effects when AudioContext is available', () => {
    const audio = createAudioContextMock();
    const sound = createSoundController({ AudioContext: audio.AudioContext });

    expect(sound.play('attack')).toBe(true);
    expect(audio.AudioContext).toHaveBeenCalledTimes(1);
    expect(audio.oscillator.start).toHaveBeenCalled();
    expect(audio.oscillator.stop).toHaveBeenCalled();
    expect(audio.gain.connect).toHaveBeenCalled();
  });

  it('is a safe no-op when audio support is unavailable or muted', () => {
    const silent = createSoundController({});
    expect(silent.play('attack')).toBe(false);

    const audio = createAudioContextMock();
    const muted = createSoundController({ AudioContext: audio.AudioContext });
    muted.setMuted(true);
    expect(muted.play('attack')).toBe(false);
    expect(audio.AudioContext).not.toHaveBeenCalled();
  });
});
