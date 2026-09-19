import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Standard CORS headers allowing safe invocation
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight options request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Initialize Supabase Client using standard public credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        // Forward the Authorization header if provided, otherwise default to anon key
        headers: { Authorization: req.headers.get('Authorization') ?? `Bearer ${supabaseAnonKey}` },
      },
    })

    // 3. Query 1 row from public.content (Read-only)
    const { data, error } = await supabase
      .from('content')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    // 4. Return standard 200 JSON payload
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Activity logged successfully.",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (err: any) {
    // Return structured error without exposing internal server secrets
    return new Response(
      JSON.stringify({ status: "error", message: err.message || "Query failed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})