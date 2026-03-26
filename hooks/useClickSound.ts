import { useCallback } from 'react';

let sharedAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;

function getAudio() {
  if (!sharedAudio) {
    sharedAudio = new Audio('/click.mp3');
    sharedAudio.volume = 0.25;
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

// Unlock audio on first user gesture (required by iOS/Android)
function unlockAudio() {
  if (audioUnlocked) return;
  const audio = getAudio();
  const unlock = () => {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
    }).catch(() => {});
    document.removeEventListener('touchstart', unlock, true);
    document.removeEventListener('click', unlock, true);
  };
  document.addEventListener('touchstart', unlock, true);
  document.addEventListener('click', unlock, true);
}

if (typeof window !== 'undefined') {
  unlockAudio();
}

export function playClick() {
  const enabled = localStorage.getItem('sound') !== 'off';
  if (!enabled) return;
  const audio = getAudio();
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function useClickSound() {
  return useCallback(() => playClick(), []);
}
