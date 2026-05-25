import styles from './Calendar.module.css';

interface Props {
  currentMonth: Date;
  selectedDate: Date;
  today: Date;
  entryKeys: string[];
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function Calendar({
  currentMonth,
  selectedDate,
  today,
  entryKeys,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const entrySet = new Set(entryKeys);

  return (
    <div className={styles.calendar}>
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={onPrevMonth} aria-label="前月">‹</button>
        <span className={styles.monthLabel}>
          {year}年{month + 1}月
        </span>
        <button className={styles.navBtn} onClick={onNextMonth} aria-label="翌月">›</button>
      </div>

      <div className={styles.grid}>
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`${styles.weekday} ${i === 0 ? styles.sun : ''} ${i === 6 ? styles.sat : ''}`}
          >
            {w}
          </div>
        ))}

        {cells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;

          const key = toKey(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const hasEntry = entrySet.has(key);
          const isSun = date.getDay() === 0;
          const isSat = date.getDay() === 6;

          return (
            <button
              key={key}
              className={[
                styles.cell,
                isSelected ? styles.selected : '',
                isToday ? styles.today : '',
                isSun ? styles.sun : '',
                isSat ? styles.sat : '',
              ].join(' ')}
              onClick={() => onSelectDate(date)}
            >
              <span className={styles.dayNum}>{date.getDate()}</span>
              {hasEntry && <span className={styles.dot} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
