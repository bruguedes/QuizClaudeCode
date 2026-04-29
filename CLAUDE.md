# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16.2.4** (not 14 as originally planned). This version has breaking changes — APIs, conventions, and file structure may differ from older training data. Check `node_modules/next/dist/docs/` if unsure about any API. Tailwind CSS is **v4** (configured entirely via `@theme` blocks in `globals.css` — no `tailwind.config.ts`).

ESLint enforces **React Compiler rules** (`react-hooks/set-state-in-effect`, `react-hooks/refs`):
- Do not call `setState` synchronously inside `useEffect` — derive state or use lazy `useState` initializers
- Do not update `ref.current` during render — use `useLayoutEffect` instead

## Project Overview

**Claude Code Knowledge Quiz** — a bilingual (PT-BR/EN) adaptive True/False quiz about Claude Code. 10 questions per session, adaptive difficulty (beginner → intermediate → advanced), 15s timer per question, questions stored in Supabase.

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase · Vercel · npm**

## Setup

Fill in `.env.local` with real Supabase credentials, then run the schema + seed in the Supabase SQL Editor:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

```bash
# Run supabase/seed.sql in Supabase SQL Editor (manual step)
```

## Dev Commands

```bash
npm run dev       # local dev server (http://localhost:3000)
npm run build     # production build + type check
npm run lint      # ESLint
vercel --prod     # deploy to Vercel
```

## Architecture

### Directory layout

```
app/
  layout.tsx          # root layout (Inter font, metadata)
  page.tsx            # Welcome screen (language selector + start → /quiz)
  quiz/page.tsx       # Quiz orchestrator (useQuiz + QuizPlay + overlays)
components/
  WelcomeScreen.tsx
  QuizPlay.tsx        # wraps QuizCard + useTimer; receives key={questionId} to reset timer per question
  QuizCard.tsx
  TimerBar.tsx
  AnswerFeedback.tsx  # post-answer overlay (3s auto-advance)
  ResultScreen.tsx
  LevelBadge.tsx
lib/
  supabase.ts         # lazy getSupabase() — avoids SSR prerender crash
  questions.ts        # getAllQuestions / getQuestionsByLevel (maps DB rows → Question)
  quiz-engine.ts      # getNextLevel, pickQuestion, getMaxLevel, constants
  i18n.ts             # t(key, lang, vars?) — all UI strings PT/EN
hooks/
  useQuiz.ts          # primary quiz state machine (lazy useState for lang from localStorage)
  useTimer.ts         # 15s countdown; no setState in effects (counts down via setTimeout chain)
types/
  quiz.ts             # Question, QuizState, AnswerRecord, Level, Lang
supabase/
  seed.sql            # schema DDL + RLS + 30 questions (10 per level) with PT+EN text
```

### Timer reset pattern

The timer resets between questions by mounting a **fresh `<QuizPlay>` component** via `key={question.id}`. This is the React Compiler-compatible alternative to calling `setState` in a `useEffect`. The `quiz/page.tsx` renders `<QuizPlay key={state.currentQuestion.id} ... />`.

### Supabase client

`lib/supabase.ts` uses a lazy singleton (`getSupabase()`) to avoid the `createBrowserClient` being called at module-load time during static prerendering.

### Core types (`types/quiz.ts`)

```typescript
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Lang  = 'pt' | 'en';

export interface Question {
  id: string;
  level: Level;
  statement: Record<Lang, string>;
  answer: boolean;
  explanation: Record<Lang, string>;
  docLink?: string;
}

export interface QuizState {
  currentQuestion: Question | null;
  questionIndex: number;       // 0–9
  currentLevel: Level;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  answers: AnswerRecord[];
  phase: 'welcome' | 'playing' | 'feedback' | 'result';
  lang: Lang;
}
```

### Adaptive difficulty rules (`lib/quiz-engine.ts`)

- **Level up**: 3 consecutive correct answers
- **Level down**: 2 consecutive wrong answers (minimum: beginner)
- Quiz ends after **10 questions total**
- Session starts at **beginner**

### Supabase schema

```sql
CREATE TABLE questions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level         text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  statement_pt  text NOT NULL,
  statement_en  text NOT NULL,
  answer        boolean NOT NULL,
  explanation_pt text NOT NULL,
  explanation_en text NOT NULL,
  doc_link      text,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON questions FOR SELECT USING (true);
```

Row mapping in `lib/questions.ts`: DB columns `statement_pt`/`statement_en` → `statement: { pt, en }` (same pattern for `explanation`).

### i18n

Language is stored in `localStorage` (key: `quiz_lang`) and read via lazy `useState` initializer on mount. All UI strings live in `lib/i18n.ts` via `t(key, lang, vars?)`. Questions use `statement[lang]` / `explanation[lang]` directly.

### Design tokens (in `app/globals.css` `@theme` block)

Primary: `#D97757` (Claude orange). Correct: `#16A34A`. Wrong: `#DC2626`. Timer bar: orange → red when `percent ≤ 33%`. Font: Inter.

## Non-functional targets

- Lighthouse ≥ 90 (Performance & Accessibility)
- Responsive: 320px → 1440px
- Initial load < 2s on 4G
- RLS active: public read only, no client-side writes
