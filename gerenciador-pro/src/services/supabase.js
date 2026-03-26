import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "SUA_URL";
const supabaseKey = "SUA_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);