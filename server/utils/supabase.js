import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kqksryqiitqqjuvhzmoe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxa3NyeXFpaXRxcWp1dmh6bW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwOTE3NDMsImV4cCI6MjA0NzY2Nzc0M30.LBv9wJH7cbH3_ZexBNabRIGlCfNeFNlE3Id3B_AOliI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
