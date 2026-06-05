import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function checkColumns() {
  const { supabase } = await import('../src/features/operations/supabaseClient');
  console.log('=== Checking Column Support ===');

  // Test 1: title/structures
  const { error: err1 } = await supabase.from('exam_blueprints').insert({
    id: 'test_bp_1',
    title: 'Test Title',
    structures: []
  });
  console.log('Test 1 (title/structures) result:', err1 ? `❌ Failed: ${err1.message}` : '✅ Succeeded!');

  // Test 2: name/structure
  const { error: err2 } = await supabase.from('exam_blueprints').insert({
    id: 'test_bp_2',
    name: 'Test Name',
    structure: {}
  });
  console.log('Test 2 (name/structure) result:', err2 ? `❌ Failed: ${err2.message}` : '✅ Succeeded!');

  // Clean up if any succeeded
  await supabase.from('exam_blueprints').delete().in('id', ['test_bp_1', 'test_bp_2']);
}

checkColumns();
