import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function seedNewDb() {
  const { supabase } = await import('../src/features/operations/supabaseClient');
  console.log('=== Seeding UUID-Based Database ===');

  try {
    const blueprintId = 'a0e0a9f3-8d2a-4a6c-9411-cf0b5d52c100';
    const paperId = 'b0e0a9f3-8d2a-4a6c-9411-cf0b5d52c200';

    // 1. Blueprint
    console.log('Seeding blueprint...');
    const { data: bp, error: bpErr } = await supabase
      .from('exam_blueprints')
      .upsert({
        id: blueprintId,
        name: 'Final Term Computer Science',
        structure: {
          Q1_a: 5,
          Q1_b: 10,
          Q2_a: 5
        }
      })
      .select();

    if (bpErr) throw bpErr;
    console.log('✅ Blueprint seeded:', bp);

    // 2. Paper
    console.log('Seeding paper...');
    const { data: paper, error: paperErr } = await supabase
      .from('papers')
      .upsert({
        id: paperId,
        student_anonymous_id: 'ANON_STUDENT_99',
        blueprint_id: blueprintId,
        pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        status: 'Pending_E1_E2',
        final_score: null
      })
      .select();

    if (paperErr) throw paperErr;
    console.log('✅ Paper seeded:', paper);

  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seedNewDb();
