import { useSyncExternalStore } from 'react';
import { loadPreferences, savePreferences } from './preferencesStorage';
export type Preferences = {
  name: string;
  bio: string;
  photo: string;
  push: boolean;
  email: boolean;
  reminder: boolean;
  bpm: number;
  countIn: number;
  metronome: boolean;
  volume: number;
};
const defaults: Preferences = {
  name: '김민수',
  bio: '기타와 좋은 합주를 좋아합니다.',
  photo: '',
  push: true,
  email: false,
  reminder: true,
  bpm: 120,
  countIn: 0,
  metronome: false,
  volume: 0.8,
};
let scope = 'm1';
let value: Preferences = { ...defaults, ...loadPreferences() };
const listeners = new Set<() => void>();
export function activatePreferences(user: string, displayName?: string) {
  if (scope === user && !displayName) return;
  scope = user;
  value = {
    ...defaults,
    ...(user !== 'm1' ? { name: '뮤지션', bio: '' } : {}),
    ...loadPreferences(user),
    ...(displayName ? { name: displayName } : {}),
  };
  listeners.forEach((listener) => listener());
}
export function updatePreferences(next: Partial<Preferences>) {
  const updated = { ...value, ...next };
  savePreferences(updated, scope);
  value = updated;
  listeners.forEach((listener) => listener());
}
export function usePreferences() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => value,
    () => value,
  );
}
