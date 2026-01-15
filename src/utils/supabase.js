import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://qjhpcfozgorzfotlpyql.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaHBjZm96Z29yemZvdGxweXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDM5MTUsImV4cCI6MjA4NDA3OTkxNX0.6qE3WEeziLODUEKJ-FKV9ZtHEGzu_RJKcwodf7rzP-w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
