// Public Supabase browser config. Never put a service_role key here.
window.MYCLOTH_SUPABASE_URL = 'https://ywlxneengfjrfujgypco.supabase.co';
window.MYCLOTH_SUPABASE_ANON_KEY = 'sb_publishable_g1Nv2IZXdDnKfGc-3O2HVg_azhCZsTT';

window.myClothSupabase =
  window.supabase && !window.MYCLOTH_SUPABASE_URL.startsWith('PASTE_')
    ? window.supabase.createClient(window.MYCLOTH_SUPABASE_URL, window.MYCLOTH_SUPABASE_ANON_KEY)
    : null;
