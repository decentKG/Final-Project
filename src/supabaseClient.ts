import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.com/dashboard/project/qvwhyenvmbkkyxgoriki/settings/api-keys';  // replace this
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d2h5ZW52bWJra3l4Z29yaWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjA0NTMsImV4cCI6MjA2Nzc5NjQ1M30.7mjbUhsUcn6AhKE2ItLDO9s1IXjP5EgBE6dGzN2kWTo';                    // replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
