import { loadEnvConfig } from '@next/env';
// Load environment variables from .env
loadEnvConfig(process.cwd());

async function runIntegrationTest() {
  const { supabase } = await import('./supabaseClient');

  console.log('====================================================');
  console.log('      EXAMVAL END-TO-END INTEGRATION TEST           ');
  console.log('====================================================\n');

  const report = {
    connection: 'FAILED',
    schemaMatch: 'FAILED',
    triggerValidation: 'FAILED',
    cleanup: 'FAILED'
  };

  const tempBlueprintId = 'a0e0a9f3-8d2a-4a6c-9411-cf0b5d52c111';
  const tempPaperId = 'b0e0a9f3-8d2a-4a6c-9411-cf0b5d52c222';
  const evalAUserId = 'a0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e1';
  const evalBUserId = 'b0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e2';

  try {
    // -----------------------------------------------------------------
    // Step 1: Database Schema & Baseline Connection Check
    // -----------------------------------------------------------------
    console.log('Step 1: Running baseline connection and table checks...');
    
    // Verify environment variables are present
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are missing from .env');
    }

    // Attempt a basic check against the database tables
    const { error: bpCheckErr } = await supabase.from('exam_blueprints').select('id').limit(1);
    if (bpCheckErr) throw new Error(`exam_blueprints table check failed: ${bpCheckErr.message}`);

    const { error: papersCheckErr } = await supabase.from('papers').select('id').limit(1);
    if (papersCheckErr) throw new Error(`papers table check failed: ${papersCheckErr.message}`);

    const { error: evalsCheckErr } = await supabase.from('evaluations').select('id').limit(1);
    if (evalsCheckErr) throw new Error(`evaluations table check failed: ${evalsCheckErr.message}`);

    report.connection = 'PASSED';
    console.log('✅ Baseline connection and required tables verified.\n');

    // -----------------------------------------------------------------
    // Step 2: Insertion & Payload Formatting Check
    // -----------------------------------------------------------------
    console.log('Step 2: Inserting temporary blueprint and paper payloads...');

    // 2.1 Insert temporary Blueprint
    const { data: bpData, error: bpInsertErr } = await supabase
      .from('exam_blueprints')
      .insert({
        id: tempBlueprintId,
        name: 'Integration Test Computer Science',
        structure: {
          Q1: 50
        }
      })
      .select();

    if (bpInsertErr) {
      throw new Error(`Failed to insert blueprint: ${bpInsertErr.message}`);
    }
    console.log(`- Temporary blueprint inserted (ID: ${tempBlueprintId})`);

    // 2.2 Insert temporary Paper linked to Blueprint
    const { data: paperData, error: paperInsertErr } = await supabase
      .from('papers')
      .insert({
        id: tempPaperId,
        student_anonymous_id: 'INTEGRATION_TEST_STUDENT_99',
        blueprint_id: tempBlueprintId,
        pdf_url: 'https://example.com/test-specimen.pdf',
        status: 'Pending_E1_E2',
        final_score: null
      })
      .select();

    if (paperInsertErr) {
      throw new Error(`Failed to insert paper: ${paperInsertErr.message}`);
    }
    console.log(`- Temporary paper script inserted (ID: ${tempPaperId})`);

    report.schemaMatch = 'PASSED';
    console.log('✅ Payload formats and relationship constraints match schema successfully.\n');

    // -----------------------------------------------------------------
    // Step 3: Server-Side Automation Trigger Validation
    // -----------------------------------------------------------------
    console.log('Step 3: Simulating double-blind grading and trigger validation...');

    // 3.1 Evaluator A inserts score of 45
    console.log('- Submitting grade as Evaluator A (Score: 45)');
    const { error: evalAErr } = await supabase
      .from('evaluations')
      .insert({
        paper_id: tempPaperId,
        user_id: evalAUserId,
        question_scores: { Q1: 45 },
        total_score: 45,
        notes: 'Exceptional introduction and code formatting.'
      });

    if (evalAErr) {
      throw new Error(`Failed to insert Evaluator A evaluation: ${evalAErr.message}`);
    }

    // 3.2 Evaluator B inserts score of 35
    console.log('- Submitting grade as Evaluator B (Score: 35)');
    const { error: evalBErr } = await supabase
      .from('evaluations')
      .insert({
        paper_id: tempPaperId,
        user_id: evalBUserId,
        question_scores: { Q1: 35 },
        total_score: 35,
        notes: 'Correct logic but compile errors in sub-parts.'
      });

    if (evalBErr) {
      throw new Error(`Failed to insert Evaluator B evaluation: ${evalBErr.message}`);
    }

    // Wait 1.5 seconds for PostgreSQL trigger to resolve and propagate status
    console.log('Waiting 1.5 seconds for database trigger execution...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3.3 Re-fetch paper and assert status change
    console.log('Re-fetching paper status...');
    const { data: updatedPaper, error: fetchErr } = await supabase
      .from('papers')
      .select('status, final_score')
      .eq('id', tempPaperId)
      .single();

    if (fetchErr) {
      throw new Error(`Failed to fetch updated paper status: ${fetchErr.message}`);
    }

    console.log(`- Expected Status: Needs_Reconciliation`);
    console.log(`- Retrieved Status: ${updatedPaper?.status}`);

    if (updatedPaper?.status !== 'Needs_Reconciliation') {
      throw new Error(`Trigger validation failed. Paper status is '${updatedPaper?.status}' instead of 'Needs_Reconciliation'`);
    }

    report.triggerValidation = 'PASSED';
    console.log('✅ Server-side trigger successfully caught discrepancy and routed paper.\n');

  } catch (err: any) {
    console.error(`❌ Integration test failed: ${err.message}\n`);
  } finally {
    // -----------------------------------------------------------------
    // Step 4: Staging Cleanup (Tear Down)
    // -----------------------------------------------------------------
    console.log('Step 4: Running cascading cleanup...');
    try {
      // Delete evaluations first
      await supabase.from('evaluations').delete().eq('paper_id', tempPaperId);
      // Delete paper
      await supabase.from('papers').delete().eq('id', tempPaperId);
      // Delete blueprint
      await supabase.from('exam_blueprints').delete().eq('id', tempBlueprintId);
      
      report.cleanup = 'PASSED';
      console.log('✅ Temporary data wiped successfully.\n');
    } catch (cleanupErr: any) {
      console.error(`⚠️ Cleanup warning: ${cleanupErr.message}\n`);
    }

    // -----------------------------------------------------------------
    // Step 5: Integration Status Report
    // -----------------------------------------------------------------
    console.log('====================================================');
    console.log('           INTEGRATION TEST SUMMARY REPORT          ');
    console.log('====================================================');
    console.log(`Supabase Client Connection       : [ ${report.connection === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} ]`);
    console.log(`Payload & Schema Match Check     : [ ${report.schemaMatch === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} ]`);
    console.log(`Automated Discrepancy Routing    : [ ${report.triggerValidation === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} ]`);
    console.log(`Teardown & Cleanup Process       : [ ${report.cleanup === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} ]`);
    console.log('====================================================\n');
  }
}

runIntegrationTest();
