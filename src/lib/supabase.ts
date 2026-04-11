import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpdmwyaxiseppvzqgnhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZG13eWF4aXNlcHB2enFnbmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjkzNzksImV4cCI6MjA5MTQwNTM3OX0.QSWR1p-cfYIRCfuNwYQ8vzVdbYazbwwiXgx4hvltuvA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
