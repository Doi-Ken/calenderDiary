export type Mood = 'good' | 'neutral' | 'bad';

export interface DiaryEntry {
  title: string;
  body: string;
  mood?: Mood;
  createdAt: string;
  updatedAt: string;
}

export type DiaryStore = Record<string, DiaryEntry>;
