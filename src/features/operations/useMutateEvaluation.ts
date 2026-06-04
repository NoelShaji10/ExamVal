import { useState } from 'react';
import { supabase } from './supabaseClient';

export interface SubmitEvaluationParams {
  paper_id: string;
  user_id: string;
  user_role: string;
  question_scores: Record<string, number>;
  total_score: number;
  notes?: Record<string, string>;
}

export interface SubmitReconciliationParams {
  paper_id: string;
  final_score: number;
  notes: string; // Moderator text notes (maps to adjustment_reason)
  moderator_id: string;
  original_e1_score: number;
  original_e2_score: number;
}

/**
 * Hook to submit a new evaluation record for a paper.
 */
export function useSubmitEvaluation(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitEvaluation = async (params: SubmitEvaluationParams) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // In evaluations table, we insert the paper_id, user_id, question_scores, total_score, and notes.
      const { error: dbError } = await supabase
        .from('evaluations')
        .insert({
          paper_id: params.paper_id,
          user_id: params.user_id,
          question_scores: params.question_scores,
          total_score: params.total_score,
          notes: params.notes || null,
        });

      if (dbError) {
        throw dbError;
      }

      setSuccess(true);
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true, error: null };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to submit evaluation.';
      setError(errMsg);
      if (options?.onError) {
        options.onError(errMsg);
      }
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { submitEvaluation, loading, error, success };
}

/**
 * Hook to submit a moderator reconciliation, updating the paper status and logging notes.
 */
export function useSubmitReconciliation(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitReconciliation = async (params: SubmitReconciliationParams) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Insert reconciliation audit record
      const { error: reconError } = await supabase
        .from('reconciliations')
        .insert({
          paper_id: params.paper_id,
          moderator_id: params.moderator_id,
          original_e1_score: params.original_e1_score,
          original_e2_score: params.original_e2_score,
          final_reconciled_score: params.final_score,
          adjustment_reason: params.notes,
        });

      if (reconError) {
        throw reconError;
      }

      // 2. Update the target paper status and final score
      const { error: paperError } = await supabase
        .from('papers')
        .update({
          final_score: params.final_score,
          status: 'Completed',
        })
        .eq('id', params.paper_id);

      if (paperError) {
        throw paperError;
      }

      setSuccess(true);
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return { success: true, error: null };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to submit reconciliation.';
      setError(errMsg);
      if (options?.onError) {
        options.onError(errMsg);
      }
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { submitReconciliation, loading, error, success };
}
