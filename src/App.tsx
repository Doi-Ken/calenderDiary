import { useState } from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { DiaryEditor } from './components/DiaryEditor/DiaryEditor';
import { loadStore, saveStore } from './storage';
import type { DiaryEntry, DiaryStore } from './types';
import styles from './App.module.css';

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function App() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [store, setStore] = useState<DiaryStore>(loadStore);

  const selectedKey = toDateKey(selectedDate);
  const entry = store[selectedKey];

  function handleSave(draft: Omit<DiaryEntry, 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const next: DiaryStore = {
      ...store,
      [selectedKey]: {
        ...draft,
        createdAt: entry?.createdAt ?? now,
        updatedAt: now,
      },
    };
    setStore(next);
    saveStore(next);
  }

  function handleDelete() {
    const next = { ...store };
    delete next[selectedKey];
    setStore(next);
    saveStore(next);
  }

  function handlePrevMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  }

  function handleNextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>📓 日記</span>
      </header>
      <main className={styles.main}>
        <div className={styles.left}>
          <Calendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            today={today}
            entryKeys={Object.keys(store)}
            onSelectDate={setSelectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
        <div className={styles.right}>
          <DiaryEditor
            date={selectedDate}
            entry={entry}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
