# ODIADEV AI Voice Infrastructure System

Complete end-to-end voice AI platform with backend API, database, chat widget, and admin dashboard.

## Deployed Applications

### Chat Widget (Voice+Text Interface)
**URL:** https://wi226k0g9688.space.minimax.io
- Nigerian English optimized speech recognition
- Real-time Groq LLM chat
- Minimax TTS voice synthesis
- Embeddable on any website

### Admin Dashboard
**URL:** https://bowssclmerw2.space.minimax.io
- Usage analytics and metrics
- API key management
- Usage logs viewer
- CEO inspirational messaging

## System Architecture

```
┌─────────────────┐
│  Chat Widget    │ ← Embeddable Voice+Text Interface
│  (Vite/React)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Supabase Edge   │ ← Backend API Functions
│   Functions     │   - chat-groq (LLM)
└────────┬────────┘   - tts-minimax (TTS)
         │            - api-key-generate
         │            - usage-stats
         ↓            - verify-api-key
┌─────────────────┐
│    Database     │ ← PostgreSQL + RLS
│   (Supabase)    │   - profiles
└─────────────────┘   - api_keys
                      - tts_logs
```

## Database Schema

### profiles
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
email TEXT UNIQUE NOT NULL
name TEXT
plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'))
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### api_keys
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID NOT NULL
key TEXT NOT NULL
quota INTEGER DEFAULT 3600
usage INTEGER DEFAULT 0
active BOOLEAN DEFAULT true
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### tts_logs
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID NOT NULL
text TEXT NOT NULL
voice TEXT NOT NULL
duration FLOAT NOT NULL
tokens INTEGER
cost NUMERIC(10,6)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## API Endpoints

All Edge Functions are deployed and accessible at:
`https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/<function-name>`

### 1. Chat Endpoint (Groq LLM)
**URL:** `/chat-groq`
**Method:** POST

**Request:**
```json
{
  "message": "Hello, how are you?",
  "apiKey": "odia_xxx",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "data": {
    "response": "AI response text",
    "tokensUsed": 50,
    "latency": 150,
    "model": "llama-3.1-8b-instant"
  }
}
```

### 2. TTS Endpoint (Minimax)
**URL:** `/tts-minimax`
**Method:** POST

**Request:**
```json
{
  "text": "Text to convert to speech",
  "voice": "nigerian-male",
  "apiKey": "odia_xxx"
}
```

**Response:**
```json
{
  "data": {
    "audioUrl": "https://...",
    "duration": 5.2,
    "cost": 0.00052,
    "latency": 180,
    "voice": "nigerian-male"
  }
}
```

### 3. API Key Generation
**URL:** `/api-key-generate`
**Method:** POST
**Auth:** Required (Bearer token)

**Request:**
```json
{
  "quota": 36000
}
```

**Response:**
```json
{
  "data": {
    "apiKey": "odia_abc123...",
    "quota": 36000,
    "created": {...}
  }
}
```

### 4. Usage Statistics
**URL:** `/usage-stats`
**Method:** GET
**Auth:** Required (Bearer token)

**Response:**
```json
{
  "data": {
    "summary": {
      "totalRequests": 150,
      "totalDuration": 300,
      "totalCost": "0.0300",
      "totalTokens": 15000,
      "avgLatency": 180
    },
    "apiKeys": [...],
    "dailyStats": {...},
    "recentLogs": [...]
  }
}
```

### 5. Verify API Key
**URL:** `/verify-api-key`
**Method:** POST

**Request:**
```json
{
  "apiKey": "odia_xxx"
}
```

**Response:**
```json
{
  "data": {
    "valid": true,
    "active": true,
    "quota": 36000,
    "usage": 1200,
    "remainingQuota": 34800,
    "quotaExceeded": false,
    "message": "Valid"
  }
}
```

## Environment Variables Required

Add these to Supabase Dashboard → Project Settings → Edge Functions → Environment Variables:

```bash
# Groq LLM API
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-8b-instant

# Minimax TTS API
MINIMAX_API_KEY=...
MINIMAX_TTS_URL=https://minimax-tts-odiadev.onrender.com/tts

# Supabase (automatically set)
SUPABASE_URL=https://ectphyvfbkwaawtnzrlo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

## Widget Integration Guide

### Basic Embed (Light Theme)
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website with ODIADEV Voice AI</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- ODIADEV Widget Configuration -->
    <script>
        window.ODIA_WIDGET = {
            theme: 'light',
            autoPlayAudio: true,
            voice: 'nigerian-male'
        };
    </script>
    
    <!-- Embed Widget -->
    <iframe 
        src="https://wi226k0g9688.space.minimax.io" 
        style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999;"
    ></iframe>
</body>
</html>
```

### Advanced Embed with API Key
```html
<script>
    window.ODIA_WIDGET = {
        apiKey: 'odia_your_api_key_here', // Required for usage tracking
        theme: 'dark',
        autoPlayAudio: false, // User manually clicks to play TTS
        voice: 'nigerian-female'
    };
</script>

<iframe 
    src="https://wi226k0g9688.space.minimax.io" 
    style="position: fixed; bottom: 0; right: 0; width: 100%; height: 100vh; border: none; z-index: 9999;"
></iframe>
```

### Available Voice Options
- `nigerian-male` (default)
- `nigerian-female`
- Custom voices (contact support)

## Admin Dashboard Features

### Login
1. Visit: https://bowssclmerw2.space.minimax.io
2. Sign up with email/password
3. Confirm email (check inbox)
4. Login to access dashboard

### Dashboard Sections

#### 1. CEO Message
Inspirational message from Austin Eguale about ODIADEV's mission to democratize voice AI for African businesses.

#### 2. Usage Metrics
- Total Requests
- Total Duration (seconds)
- Total Cost (USD)
- Average Latency (ms)

#### 3. API Key Management
- Generate new API keys
- View quota usage per key
- Copy keys to clipboard
- Monitor active/inactive status

#### 4. Recent Activity
- View recent TTS requests
- Track text, voice, duration, and cost
- Filter and analyze usage patterns

## Voice Pipeline

```
User speaks → Web Speech API (STT) 
    ↓
Text input → Groq LLM (llama-3.1-8b-instant)
    ↓
AI response → Minimax TTS API
    ↓
Audio playback → Browser Audio API
```

**Performance:**
- Target latency: <250ms (Groq LPU)
- Nigerian English optimized recognition
- 3G network compatible
- Offline capable with queued requests

## Nigerian English Optimization

### Speech Recognition
- Set to `en-NG` locale
- Optimized for Nigerian accent patterns
- Supports common Pidgin phrases

### LLM System Prompt
```
You are a helpful AI assistant optimized for Nigerian English and Pidgin. 
Provide clear, concise responses with cultural awareness. 
Keep responses under 100 words for fast TTS conversion.
```

### Voice Synthesis
- Trained Nigerian voice models
- Natural intonation and cadence
- Cultural context awareness

## Security & Compliance

### Row-Level Security (RLS)
All tables have RLS policies enabled:
- Users can only access their own data
- API keys are user-scoped
- TTS logs are protected per user

### API Key Management
- Secure key generation (32-byte random)
- Quota enforcement
- Usage tracking
- Active/inactive status control

### Rate Limiting
Implement at application level:
```javascript
// Example rate limiting logic
const requests = await getRecentRequests(userId, timeWindow);
if (requests.length > limit) {
  throw new Error('Rate limit exceeded');
}
```

## Cost Optimization

### Pricing Estimates
- **Groq:** ~$0.0001 per token
- **Minimax TTS:** ~$0.0001 per second
- **Supabase:** Free tier (upgrade for scale)

### Cost Control
1. Set quota limits on API keys
2. Monitor usage via dashboard
3. Alert on threshold exceeded
4. Implement caching for repeated requests

## Deployment Options

The ODIADEV AI applications can be deployed using several methods:

### Vercel Deployment (Recommended)

The project is pre-configured for deployment to Vercel with zero configuration needed. See [Vercel Deployment Guide](./VERCEL-DEPLOYMENT-GUIDE.md) for detailed instructions.

### Current Deployments

The applications are currently deployed and accessible at:
- Chat Widget: https://wi226k0g9688.space.minimax.io
- Admin Dashboard: https://bowssclmerw2.space.minimax.io

## Deployment Checklist

- [x] Database schema created
- [x] RLS policies configured
- [x] Edge Functions deployed
- [x] Chat widget built and deployed
- [x] Admin dashboard built and deployed
- [x] Vercel deployment configurations added
- [ ] Add GROQ_API_KEY to Supabase environment variables
- [ ] Add MINIMAX_API_KEY to Supabase environment variables
- [ ] Test all API endpoints
- [ ] Create first admin user
- [ ] Generate test API key
- [ ] Embed widget on test website

## Production Monitoring

### Key Metrics
- Request latency (target: <250ms)
- Error rates (target: <1%)
- Quota utilization
- Cost per user
- Active users
- Voice conversion success rate

### Logging
All requests logged in `tts_logs` table:
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as requests,
  SUM(duration) as total_duration,
  SUM(cost) as total_cost
FROM tts_logs
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Troubleshooting

### Widget Not Loading
1. Check CORS settings
2. Verify iframe URL is correct
3. Check browser console for errors

### API Key Invalid
1. Verify key format: `odia_...`
2. Check key is active in dashboard
3. Verify quota not exceeded

### TTS Not Playing
1. Check MINIMAX_API_KEY is set
2. Verify audio URL in response
3. Check browser autoplay policies

### Chat Not Responding
1. Check GROQ_API_KEY is set
2. Verify conversation history format
3. Check Edge Function logs

## Support & Documentation

### Getting Help
- **Email:** ceo@odia.dev
- **Company:** ODIADEV AI LTD
- **Website:** odia.dev

### Source Code
- Chat Widget: `/workspace/odiadev-chat-widget`
- Admin Dashboard: `/workspace/odiadev-admin-dashboard`
- Edge Functions: `/workspace/supabase/functions`

### Deployment Guides
- [Vercel Deployment Guide](./VERCEL-DEPLOYMENT-GUIDE.md) - Instructions for deploying to Vercel

## Next Steps

1. **Add API Keys:**
   - Go to Supabase Dashboard
   - Navigate to Edge Functions → Environment Variables
   - Add `GROQ_API_KEY` and `MINIMAX_API_KEY`

2. **Create Admin Account:**
   - Visit https://bowssclmerw2.space.minimax.io
   - Sign up with your email
   - Confirm email and login

3. **Generate API Key:**
   - Click "Generate New Key" in dashboard
   - Copy key for widget integration

4. **Test Integration:**
   - Embed widget in test page
   - Configure with your API key
   - Test voice input and TTS output

5. **Go Live:**
   - Embed widget on production website
   - Monitor usage in dashboard
   - Scale infrastructure as needed

---

**Built by ODIADEV AI LTD**
*Democratizing voice intelligence for African businesses*
