import { useState, useEffect } from 'react';
import type { DiaryEntry, Mood } from '../../types';
import styles from './DiaryEditor.module.css';

interface Props {
  date: Date;
  entry: DiaryEntry | undefined;
  onSave: (draft: Omit<DiaryEntry, 'createdAt' | 'updatedAt'>) => void;
  onDelete: () => void;
}

const MOODS: { value: Mood; label: string }[] = [
  { value: 'good', label: '😊' },
  { value: 'neutral', label: '😐' },
  { value: 'bad', label: '😞' },
];

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = WEEKDAY_LABELS[date.getDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

export function DiaryEditor({ date, entry, onSave, onDelete }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood | undefined>(undefined);

  useEffect(() => {
    setTitle(entry?.title ?? '');
    setBody(entry?.body ?? '');
    setMood(entry?.mood);
  }, [entry, date]);

  function handleSave() {
    onSave({ title, body, mood });
  }

  function handleDelete() {
    if (window.confirm('この日記を削除しますか？')) {
      onDelete();
    }
  }

  const hasEntry = entry !== undefined;
  const isDirty =
    title !== (entry?.title ?? '') ||
    body !== (entry?.body ?? '') ||
    mood !== entry?.mood;

  return (
    <div className={styles.editor}>
      <h2 className={styles.dateHeading}>{formatDate(date)}</h2>

      <div className={styles.field}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="タイトル（任意）"
          maxLength={50}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <textarea
          className={styles.bodyTextarea}
          placeholder="今日のことを書いてみましょう..."
          maxLength={5000}
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <div className={styles.charCount}>{body.length} / 5000</div>
      </div>

      <div className={styles.moodRow}>
        <span className={styles.moodLabel}>気分</span>
        <div className={styles.moodBtns}>
          {MOODS.map(m => (
            <button
              key={m.value}
              className={`${styles.moodBtn} ${mood === m.value ? styles.moodSelected : ''}`}
              onClick={() => setMood(mood === m.value ? undefined : m.value)}
              aria-label={m.value}
              title={m.value}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!isDirty && hasEntry}
        >
          保存
        </button>
        {hasEntry && (
          <button className={styles.deleteBtn} onClick={handleDelete}>
            削除
          </button>
        )}
      </div>

      {entry && (
        <p className={styles.timestamp}>
          最終更新：{new Date(entry.updatedAt).toLocaleString('ja-JP')}
        </p>
      )}
    </div>
  );
}
