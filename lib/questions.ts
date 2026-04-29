import { getSupabase } from './supabase';
import type { Question, Level } from '@/types/quiz';

function mapRow(row: Record<string, unknown>): Question {
  return {
    id: row.id as string,
    level: row.level as Level,
    statement: { pt: row.statement_pt as string, en: row.statement_en as string },
    answer: row.answer as boolean,
    explanation: { pt: row.explanation_pt as string, en: row.explanation_en as string },
    docLink: (row.doc_link as string | null) ?? undefined,
  };
}

export async function getAllQuestions(): Promise<Question[]> {
  const { data, error } = await getSupabase().from('questions').select('*');
  if (error) throw error;
  return data.map(mapRow);
}

export async function getQuestionsByLevel(level: Level): Promise<Question[]> {
  const { data, error } = await getSupabase()
    .from('questions')
    .select('*')
    .eq('level', level);
  if (error) throw error;
  return data.map(mapRow);
}
