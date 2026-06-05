import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export interface Evaluation {
  id: string | number;
  paper_id: string | number;
  user_id: string;
  user_role: string | null;
  question_scores: Record<string, number>;
  total_score: number;
  notes: any; // Can be a string or parsed JSON object mapping question_id -> feedback
  created_at: string;
}

export interface FetchEvaluationsResult {
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetchEvaluations(paperId: string | number): FetchEvaluationsResult {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchEvaluations() {
    if (!paperId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('paper_id', paperId)
        .order('created_at', { ascending: true });

      if (dbError) {
        throw dbError;
      }

      const parsedEvaluations = (data || []).map((item: any) => {
        let parsedNotes = item.notes;
        if (typeof item.notes === 'string') {
          try {
            parsedNotes = JSON.parse(item.notes);
          } catch (e) {
            // fallback to original string
          }
        }
        return {
          ...item,
          notes: parsedNotes,
        };
      });
      setEvaluations(parsedEvaluations);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching evaluations.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvaluations();
  }, [paperId]);

  return { evaluations, loading, error, refetch: fetchEvaluations };
}
