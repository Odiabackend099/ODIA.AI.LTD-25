Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token and get user
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Get TTS logs
        const logsResponse = await fetch(
            `${supabaseUrl}/rest/v1/tts_logs?user_id=eq.${userId}&order=created_at.desc&limit=100`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const logs = await logsResponse.json();

        // Get API keys
        const keysResponse = await fetch(
            `${supabaseUrl}/rest/v1/api_keys?user_id=eq.${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const apiKeys = await keysResponse.json();

        // Calculate statistics
        const totalRequests = logs.length;
        const totalDuration = logs.reduce((sum: number, log: any) => sum + (log.duration || 0), 0);
        const totalCost = logs.reduce((sum: number, log: any) => sum + parseFloat(log.cost || 0), 0);
        const totalTokens = logs.reduce((sum: number, log: any) => sum + (log.tokens || 0), 0);

        // Calculate average latency (assuming logs would track this)
        const avgLatency = logs.length > 0 ? 150 : 0; // Placeholder

        // Daily breakdown (last 7 days)
        const dailyStats: any = {};
        const now = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyStats[dateKey] = {
                requests: 0,
                duration: 0,
                cost: 0
            };
        }

        logs.forEach((log: any) => {
            const logDate = new Date(log.created_at).toISOString().split('T')[0];
            if (dailyStats[logDate]) {
                dailyStats[logDate].requests++;
                dailyStats[logDate].duration += log.duration || 0;
                dailyStats[logDate].cost += parseFloat(log.cost || 0);
            }
        });

        return new Response(JSON.stringify({
            data: {
                summary: {
                    totalRequests,
                    totalDuration: Math.round(totalDuration),
                    totalCost: totalCost.toFixed(4),
                    totalTokens,
                    avgLatency
                },
                apiKeys: apiKeys.map((key: any) => ({
                    id: key.id,
                    key: `${key.key.substring(0, 10)}...`,
                    quota: key.quota,
                    usage: key.usage,
                    active: key.active,
                    created_at: key.created_at
                })),
                dailyStats,
                recentLogs: logs.slice(0, 20)
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Usage stats error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'STATS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
