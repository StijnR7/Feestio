import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvkfcirdkxemqhydfpml.supabase.co'; // 🔁 Replace
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2a2ZjaXJka3hlbXFoeWRmcG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3Mjc4MzAsImV4cCI6MjA2NTMwMzgzMH0.afkZBSssfzOAeliyVZItnXf3ZDMcUlM3Xo1MfPxeCUM'; // 🔁 Replace

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
