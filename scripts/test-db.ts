import { loadEnvConfig } from '@next/env';
// Load environment variables from .env.local
loadEnvConfig(process.cwd());

// TESTING FEATURE FILE (CAN  BE DELETED LATER)
async function testDatabaseOperations() {
  const { supabase } = await import('../src/features/operations/supabaseClient');

  console.log('=== Supabase Database Operations Test ===\n');

  // Verify that the environment variables are accessible in this environment
  console.log('Checking environment variables...');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ Undefined'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Defined' : '❌ Undefined'}\n`);

  try {
    // 1. Fetch a paper and do the inner join with exam_blueprints
    console.log('Step 1: Fetching paper details (including exam blueprint layout)...');
    const { data: papers, error: papersError } = await supabase
      .from('papers')
      .select('*, exam_blueprints!inner(*)')
      .limit(1);

    if (papersError) {
      throw new Error(`Failed to fetch papers: ${papersError.message}`);
    }

    if (!papers || papers.length === 0) {
      console.log('⚠️ No papers found in the database. Please make sure you have inserted a paper script first.\n');
      return;
    }

    const testPaper = papers[0];
    console.log('✅ Successfully fetched paper and blueprint:');
    console.log(`   - Paper ID: ${testPaper.id}`);
    console.log(`   - Student Anonymous ID: ${testPaper.student_anonymous_id}`);
    console.log(`   - PDF URL: ${testPaper.pdf_url}`);
    console.log(`   - Blueprint ID: ${testPaper.blueprint_id}`);
    console.log(`   - Blueprint Name: ${testPaper.exam_blueprints.name}`);
    console.log(`   - Blueprint Structure:`, JSON.stringify(testPaper.exam_blueprints.structure, null, 2));

    // 2. Submit a mock evaluation
    console.log('\nStep 2: Submitting a mock evaluation...');
    // Generate a temporary UUID for testing
    const mockEvaluatorId = '00000000-0000-0000-0000-000000000001'; 
    const mockQuestionScores = { q1: 8.5, q2: 4.0 };
    const mockTotalScore = 12.5;

    const { data: evalData, error: evalError } = await supabase
      .from('evaluations')
      .insert({
        paper_id: testPaper.id,
        user_id: mockEvaluatorId,
        question_scores: mockQuestionScores,
        total_score: mockTotalScore,
        notes: { q1: 'Good derivation', q2: 'Arithmetic error' }
      })
      .select();

    if (evalError) {
      console.log(`❌ Evaluation insert failed: ${evalError.message}`);
      console.log('   (Note: This might fail if you have RLS enabled, or if this evaluator has already graded this paper due to the unique constraint).');
    } else {
      console.log('✅ Evaluation inserted successfully:', evalData);
    }

    // 3. Submit a mock reconciliation (Moderator override)
    console.log('\nStep 3: Submitting a mock reconciliation...');
    const mockModeratorId = '11111111-1111-1111-1111-111111111111';
    const finalReconciledScore = 13.0;
    const adjustmentReason = 'Added 0.5 marks back due to evaluator grading variance in Q2.';

    // Insert reconciliation log
    const { error: reconError } = await supabase
      .from('reconciliations')
      .insert({
        paper_id: testPaper.id,
        moderator_id: mockModeratorId,
        original_e1_score: 8.5,
        original_e2_score: 4.0,
        final_reconciled_score: finalReconciledScore,
        adjustment_reason: adjustmentReason
      });

    if (reconError) {
      console.log(`❌ Reconciliation insert failed: ${reconError.message}`);
    } else {
      console.log('✅ Reconciliation audit trail logged successfully.');

      // Update paper status and final score
      const { error: paperUpdateError } = await supabase
        .from('papers')
        .update({
          final_score: finalReconciledScore,
          status: 'Completed'
        })
        .eq('id', testPaper.id);

      if (paperUpdateError) {
        console.log(`❌ Paper update failed: ${paperUpdateError.message}`);
      } else {
        console.log('✅ Paper status and final score updated to Completed.');
      }
    }

  } catch (err: any) {
    console.error('\n❌ Test execution failed:', err.message);
  }
}

testDatabaseOperations();
