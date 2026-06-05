import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function inspectSchema() {
  const { supabase } = await import('../src/features/operations/supabaseClient');
  console.log('=== Inspecting Live Supabase Schema ===');

  try {
    // 1. Fetch tables list or describe them by inspecting a row
    const { data: blueprints, error: bErr } = await supabase.from('exam_blueprints').select('*');
    if (bErr) console.error('Error fetching blueprints:', bErr);
    else console.log('exam_blueprints list:', JSON.stringify(blueprints, null, 2));

    const { data: papers, error: pErr } = await supabase.from('papers').select('*');
    if (pErr) console.error('Error fetching papers:', pErr);
    else console.log('papers list:', JSON.stringify(papers, null, 2));

    const { data: evaluations, error: eErr } = await supabase.from('evaluations').select('*');
    if (eErr) console.error('Error fetching evaluations:', eErr);
    else console.log('evaluations list:', JSON.stringify(evaluations, null, 2));

    const { data: reconciliations, error: rErr } = await supabase.from('reconciliations').select('*');
    if (rErr) console.error('Error fetching reconciliations:', rErr);
    else console.log('reconciliations list:', JSON.stringify(reconciliations, null, 2));

  } catch (err: any) {
    console.error('Inspection failed:', err.message);
  }
}

inspectSchema();
