import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export interface PaperWithRelations {
  id: string | number;
  student_anonymous_id: string;
  blueprint_id: string | number;
  status: string;
  final_score: number | null;
  moderator_notes: string | null;
  created_at: string;
  updated_at: string;
  exam_blueprints: {
    id: string | number;
    name: string;
    max_marks: number;
    structure: any;
  } | null;
  evaluations: Array<{
    id: string | number;
    user_id: string;
    user_role: string | null;
    question_scores: Record<string, number>;
    total_score: number;
    notes: any;
    created_at: string;
  }>;
}

export interface FetchPapersResult {
  papers: PaperWithRelations[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetchPapers(): FetchPapersResult {
  const [papers, setPapers] = useState<PaperWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPapers() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('papers')
        .select(`
          *,
          exam_blueprints (*),
          evaluations (*)
        `)
        .order('created_at', { ascending: false });

      if (dbError) {
        throw dbError;
      }

      setPapers((data || []) as unknown as PaperWithRelations[]);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching papers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPapers();
  }, []);

  return { papers, loading, error, refetch: fetchPapers };
}
