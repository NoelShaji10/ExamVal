import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export interface ExamBlueprint {
  id: string;
  name: string;
  structure: any; // JSONB structure representing questions
  created_at: string;
  updated_at: string;
}

export interface PaperDetails {
  id: string;
  blueprint_id: string;
  pdf_url: string;
  student_anonymous_id: string;
  status: string;
  final_score: number | null;
  created_at: string;
  updated_at: string;
  exam_blueprints: ExamBlueprint;
}

export interface FetchPaperDetailsResult {
  paperData: PaperDetails | null;
  loading: boolean;
  error: string | null;
}

export function useFetchPaperDetails(paperId: string): FetchPaperDetailsResult {
  const [paperData, setPaperData] = useState<PaperDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // Reset state on paperId change
    setLoading(true);
    setError(null);
    setPaperData(null);

    if (!paperId) {
      setLoading(false);
      return;
    }

    async function fetchPaperDetails() {
      try {
        // Query the 'papers' table and perform an inner join on 'exam_blueprints'
        const { data, error: dbError } = await supabase
          .from('papers')
          .select('*, exam_blueprints!inner(*)')
          .eq('id', paperId)
          .single();

        if (dbError) {
          throw dbError;
        }

        if (active) {
          setPaperData(data as unknown as PaperDetails);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'An error occurred while fetching paper details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchPaperDetails();

    return () => {
      active = false;
    };
  }, [paperId]);

  return { paperData, loading, error };
}
