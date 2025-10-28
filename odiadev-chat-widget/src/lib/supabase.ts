import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ectphyvfbkwaawtnzrlo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdHBoeXZmYmt3YWF3dG56cmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTYzMDAsImV4cCI6MjA3MTYzMjMwMH0.X94YQtlWmFH3qoiVVpMOzIzJx81Nt4vvAyeCwpxLJAQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
