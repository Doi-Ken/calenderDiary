# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Calendar-based diary web app (Japanese UI). Users pick a date from a monthly calendar and create/view/edit diary entries for that date.

## Tech Stack

- React + TypeScript, built with Vite
- CSS Modules for styling
- localStorage for persistence (key: `diary-app-data`)

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Architecture

### Data Model

```ts
type Mood = 'good' | 'neutral' | 'bad';

interface DiaryEntry {
  title: string;
  body: string;
  mood?: Mood;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

// Stored in localStorage as JSON
type DiaryStore = Record<string, DiaryEntry>; // key: "YYYY-MM-DD"
```

### Component Structure

Two-pane layout: calendar (left) + diary editor (right). Mobile: stacked vertically.

- `App.tsx` — owns all state: selected date, displayed month, diary store. CRUD ops update localStorage immediately.
- `Calendar/` — monthly grid, prev/next month navigation, dot markers on days that have entries, today highlighted
- `DiaryEditor/` — title input (max 50 chars), body textarea (max 5000 chars), mood selector (😊/😐/😞), save/delete buttons (delete requires confirmation dialog)

State flows top-down from `App.tsx` as props; no external state library.

## Design

- Simple and minimal, light mode only
- Japanese UI text throughout
