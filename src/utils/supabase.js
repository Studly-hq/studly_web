import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://cvfnibcbhlfvdqhbbpbf.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Zm5pYmNiaGxmdmRxaGJicGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODY3MTQsImV4cCI6MjA4MzM2MjcxNH0.EtWR_62-f5uwXQVfh4OCxRCFvBCf-wRw7vSxXDgnZ1w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
