import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function addPaper() {
  const { supabase } = await import('../src/features/operations/supabaseClient');
  console.log('=== Adding Test Paper to Database ===');

  const randomNum = Math.floor(100 + Math.random() * 900);
  const studentAnonymousId = `ANON_STUDENT_${randomNum}`;

  try {
    const { data, error } = await supabase
      .from('papers')
      .insert({
        student_anonymous_id: studentAnonymousId,
        blueprint_id: 1, // Points to existing "Final Term Computer Science" blueprint
        status: 'Pending_E1_E2',
        final_score: null,
        moderator_notes: null
      })
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully added paper:`);
    console.log(JSON.stringify(data, null, 2));
    console.log(`\nYou can now refresh your page. The paper should appear in the Evaluator Workspace!`);

  } catch (err: any) {
    console.error('❌ Failed to add paper:', err.message);
  }
}

addPaper();
