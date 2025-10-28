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
        const { message, apiKey, conversationHistory = [] } = await req.json();

        if (!message) {
            throw new Error('Message is required');
        }

        // Get environment variables
        const groqApiKey = Deno.env.get('GROQ_API_KEY');
        const groqModel = Deno.env.get('GROQ_MODEL') || 'llama-3.1-8b-instant';
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!groqApiKey) {
            throw new Error('GROQ_API_KEY not configured');
        }

        // Verify API key if provided
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

        // Build conversation for Groq
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant optimized for Nigerian English and Pidgin. Provide clear, concise responses with cultural awareness. Keep responses under 100 words for fast TTS conversion.'
            },
            ...conversationHistory.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        // Call Groq API
        const startTime = Date.now();
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: groqModel,
                messages,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            throw new Error(`Groq API error: ${errorText}`);
        }

        const groqData = await groqResponse.json();
        const latency = Date.now() - startTime;
        const aiResponse = groqData.choices[0]?.message?.content || 'No response';
        const tokensUsed = groqData.usage?.total_tokens || 0;

        // Return response
        return new Response(JSON.stringify({
            data: {
                response: aiResponse,
                tokensUsed,
                latency,
                model: groqModel
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Chat error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'CHAT_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
