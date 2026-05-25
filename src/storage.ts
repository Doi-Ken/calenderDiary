import type { DiaryStore } from './types';

const KEY = 'diary-app-data';

export function loadStore(): DiaryStore {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DiaryStore) : {};
  } catch {
    return {};
  }
}

export function saveStore(store: DiaryStore): void {
  localStorage.setItem(KEY, JSON.stringify(store));
}
