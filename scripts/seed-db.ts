import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function seedDatabase() {
  const { supabase } = await import('../src/features/operations/supabaseClient');
  console.log('=== Seeding Database ===');

  try {
    // 1. Insert Exam Blueprint
    console.log('Seeding exam blueprint...');
    const { data: bpData, error: bpError } = await supabase
      .from('exam_blueprints')
      .upsert({
        id: 1,
        name: 'Final Term Computer Science',
        max_marks: 20,
        structure: {
          Q1_a: 5,
          Q1_b: 10,
          Q2_a: 5
        }
      })
      .select();

    if (bpError) throw bpError;
    console.log('✅ Blueprint seeded successfully:', bpData);

    // 2. Insert test paper
    console.log('Seeding test paper...');
    const { data: paperData, error: paperError } = await supabase
      .from('papers')
      .upsert({
        id: 1042,
        student_anonymous_id: 'ANON_STUDENT_99',
        blueprint_id: 1,
        status: 'Pending_E1_E2',
        final_score: null,
        moderator_notes: null
      })
      .select();

    if (paperError) throw paperError;
    console.log('✅ Test paper seeded successfully:', paperData);

  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seedDatabase();
