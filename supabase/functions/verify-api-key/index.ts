Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { apiKey } = await req.json();

        if (!apiKey) {
            throw new Error('API key is required');
        }

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        // Verify API key
        const verifyResponse = await fetch(
            `${supabaseUrl}/rest/v1/api_keys?key=eq.${apiKey}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const keys = await verifyResponse.json();
        
        if (!keys || keys.length === 0) {
            return new Response(JSON.stringify({
                data: {
                    valid: false,
                    message: 'API key not found'
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const keyData = keys[0];

        if (!keyData.active) {
            return new Response(JSON.stringify({
                data: {
                    valid: false,
                    message: 'API key is inactive'
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const remainingQuota = keyData.quota - keyData.usage;
        const quotaExceeded = keyData.usage >= keyData.quota;

        return new Response(JSON.stringify({
            data: {
                valid: !quotaExceeded,
                active: keyData.active,
                quota: keyData.quota,
                usage: keyData.usage,
                remainingQuota,
                quotaExceeded,
                message: quotaExceeded ? 'Quota exceeded' : 'Valid'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API key verification error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'VERIFICATION_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
