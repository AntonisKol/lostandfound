import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xipgggvehtbvfjbuqzkc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcGdnZ3ZlaHRidmZqYnVxemtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjA0OTcsImV4cCI6MjA3OTMzNjQ5N30.98iehbIkKbdUeH4Z002pbUqpLHeYOh8P8Zko55dviFo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
