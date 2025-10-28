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
        const { text, voice = 'nigerian-male', apiKey } = await req.json();

        if (!text) {
            throw new Error('Text is required');
        }

        // Get environment variables
        const minimaxApiKey = Deno.env.get('MINIMAX_API_KEY');
        const minimaxTtsUrl = Deno.env.get('MINIMAX_TTS_URL');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!minimaxApiKey || !minimaxTtsUrl) {
            throw new Error('Minimax TTS not configured');
        }

        // Verify API key and get user
        let userId = null;
        if (apiKey) {
            const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/api_keys?key=eq.${apiKey}&active=eq.true`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            const keys = await verifyResponse.json();
            if (!keys || keys.length === 0) {
                throw new Error('Invalid or inactive API key');
            }

            const keyData = keys[0];
            if (keyData.usage >= keyData.quota) {
                throw new Error('API key quota exceeded');
            }

            userId = keyData.user_id;
        }

        // Call Minimax TTS API
        const startTime = Date.now();
        const ttsResponse = await fetch(minimaxTtsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${minimaxApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                voice,
                speed: 1.0,
                pitch: 1.0
            })
        });

        if (!ttsResponse.ok) {
            const errorText = await ttsResponse.text();
            throw new Error(`Minimax TTS error: ${errorText}`);
        }

        const ttsData = await ttsResponse.json();
        const latency = Date.now() - startTime;

        // Calculate duration and cost
        const duration = ttsData.duration || text.length * 0.05; // Estimate 0.05s per character
        const cost = duration * 0.0001; // $0.0001 per second

        // Log usage if user is authenticated
        if (userId) {
            await fetch(`${supabaseUrl}/rest/v1/tts_logs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    text,
                    voice,
                    duration,
                    tokens: text.length,
                    cost
                })
            });

            // Update API key usage
            await fetch(`${supabaseUrl}/rest/v1/rpc/increment_api_key_usage`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key_value: apiKey,
                    seconds: Math.ceil(duration)
                })
            });
        }

        // Return audio URL
        return new Response(JSON.stringify({
            data: {
                audioUrl: ttsData.audio_url || ttsData.url,
                duration,
                cost,
                latency,
                voice
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('TTS error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'TTS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
