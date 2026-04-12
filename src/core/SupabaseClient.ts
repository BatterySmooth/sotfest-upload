import { createClient } from "@supabase/supabase-js";
import { Config } from "@core/Config";

export const supabase = createClient(Config.SupabaseUrl, Config.SupabaseKey);