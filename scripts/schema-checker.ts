import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function inspectSchema() {
  const { supabase } = await import('../src/features/operations/supabaseClient');
  console.log('=== Inspecting Schema Columns ===');

  try {
    // We can run a select on information_schema or just try fetching * on tables
    // and printing whatever keys exist.
    const { data: blueprints, error: bErr } = await supabase.from('exam_blueprints').select('*').limit(1);
    if (bErr) console.error('exam_blueprints error:', bErr.message);
    else console.log('exam_blueprints columns:', blueprints?.[0] ? Object.keys(blueprints[0]) : 'no records');

    const { data: papers, error: pErr } = await supabase.from('papers').select('*').limit(1);
    if (pErr) console.error('papers error:', pErr.message);
    else console.log('papers columns:', papers?.[0] ? Object.keys(papers[0]) : 'no records');

    const { data: evaluations, error: eErr } = await supabase.from('evaluations').select('*').limit(1);
    if (eErr) console.error('evaluations error:', eErr.message);
    else console.log('evaluations columns:', evaluations?.[0] ? Object.keys(evaluations[0]) : 'no records');

    const { data: reconciliations, error: rErr } = await supabase.from('reconciliations').select('*').limit(1);
    if (rErr) console.error('reconciliations error:', rErr.message);
    else console.log('reconciliations columns:', reconciliations?.[0] ? Object.keys(reconciliations[0]) : 'no records');

  } catch (err: any) {
    console.error('Inspection failed:', err.message);
  }
}

inspectSchema();
