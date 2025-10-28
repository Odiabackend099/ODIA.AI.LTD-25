# ODIADEV AI - Environment Setup Guide

## Required API Keys

You need to obtain and configure the following API keys before the system is fully operational.

### 1. Groq API Key (Required)

**Purpose:** Powers the LLM chat functionality

**How to Get:**
1. Visit https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy the key (starts with `gsk_...`)

**Add to Supabase:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select project: `ectphyvfbkwaawtnzrlo`
3. Navigate to: Project Settings → Edge Functions → Environment Variables
4. Add new variable:
   - Name: `GROQ_API_KEY`
   - Value: `gsk_your_actual_key_here`
5. Click "Save"

**Optional Configuration:**
- Name: `GROQ_MODEL`
- Value: `llama-3.1-8b-instant` (default) or other Groq models

### 2. Minimax TTS API Key (Required)

**Purpose:** Powers the text-to-speech voice synthesis

**How to Get:**
1. Contact your TTS provider or use your existing Minimax credentials
2. You mentioned TTS URL: `https://minimax-tts-odiadev.onrender.com/tts`
3. Obtain API key for authentication

**Add to Supabase:**
1. Same steps as above, but add:
   - Name: `MINIMAX_API_KEY`
   - Value: `your_minimax_key_here`
2. Also add:
   - Name: `MINIMAX_TTS_URL`
   - Value: `https://minimax-tts-odiadev.onrender.com/tts`

## Supabase Configuration

### Automatic Variables (Already Set)
These are automatically configured by Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

### Database Setup (Already Complete)
✅ Tables created:
- profiles
- api_keys
- tts_logs

✅ RLS Policies configured:
- User data protection
- API key scoping
- Log privacy

✅ Database functions:
- increment_api_key_usage

## Edge Functions Deployment Status

All Edge Functions are deployed and active:

1. **chat-groq** ✅
   - URL: https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/chat-groq
   - Status: ACTIVE
   - Function ID: 88cf6002-401b-4620-ab44-248c28edcebc

2. **tts-minimax** ✅
   - URL: https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/tts-minimax
   - Status: ACTIVE
   - Function ID: bc2af39b-eaa7-4e54-82ae-50f9917026dd

3. **api-key-generate** ✅
   - URL: https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/api-key-generate
   - Status: ACTIVE
   - Function ID: 268a7d61-23a9-4ff5-ba71-b1af4cf25155

4. **usage-stats** ✅
   - URL: https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/usage-stats
   - Status: ACTIVE
   - Function ID: 1c084916-d793-4fad-abd3-d2ce6529a73c

5. **verify-api-key** ✅
   - URL: https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/verify-api-key
   - Status: ACTIVE
   - Function ID: 7c32c42a-f3ae-4fd2-b47f-298ae6400162

## Frontend Deployments

### Chat Widget ✅
- **URL:** https://wi226k0g9688.space.minimax.io
- **Type:** Voice+Text Chat Interface
- **Status:** Deployed and Ready

**Features:**
- Nigerian English speech recognition
- Real-time Groq chat
- Minimax TTS playback
- Light/Dark theme support

### Admin Dashboard ✅
- **URL:** https://bowssclmerw2.space.minimax.io
- **Type:** Usage Analytics Dashboard
- **Status:** Deployed and Ready

**Features:**
- User authentication
- API key management
- Usage statistics
- CEO messaging
- Recent activity logs

## Testing Checklist

### Before Adding API Keys
- [ ] Visit admin dashboard: https://bowssclmerw2.space.minimax.io
- [ ] Create user account
- [ ] Confirm email
- [ ] Note: Chat and TTS won't work until API keys are added

### After Adding API Keys
- [ ] Log into admin dashboard
- [ ] Generate test API key
- [ ] Test chat widget: https://wi226k0g9688.space.minimax.io
- [ ] Try voice input (microphone)
- [ ] Try text input
- [ ] Verify AI responses
- [ ] Verify TTS audio playback
- [ ] Check usage logs in dashboard

## Step-by-Step Setup

### Step 1: Add Groq API Key
```bash
# 1. Get key from https://console.groq.com
# 2. Go to Supabase Dashboard
# 3. Project Settings → Edge Functions → Environment Variables
# 4. Add:
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### Step 2: Add Minimax API Key
```bash
# 1. Get your Minimax credentials
# 2. Same location as Step 1
# 3. Add:
MINIMAX_API_KEY=your_minimax_key
MINIMAX_TTS_URL=https://minimax-tts-odiadev.onrender.com/tts
```

### Step 3: Create Admin Account
```bash
# 1. Visit: https://bowssclmerw2.space.minimax.io
# 2. Click "Sign Up"
# 3. Enter email and password
# 4. Check email for confirmation
# 5. Click confirmation link
# 6. Log in
```

### Step 4: Generate API Key
```bash
# 1. In dashboard, click "Generate New Key"
# 2. Copy the generated key (starts with odia_)
# 3. Store securely
```

### Step 5: Test Chat Widget
```html
<!-- Create test.html -->
<!DOCTYPE html>
<html>
<head>
    <title>ODIADEV Voice AI Test</title>
</head>
<body>
    <h1>Testing ODIADEV Voice AI</h1>
    
    <script>
        window.ODIA_WIDGET = {
            apiKey: 'odia_your_generated_key',
            theme: 'light',
            autoPlayAudio: true,
            voice: 'nigerian-male'
        };
    </script>
    
    <iframe 
        src="https://wi226k0g9688.space.minimax.io" 
        style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
    ></iframe>
</body>
</html>
```

### Step 6: Test Voice Pipeline
1. Open test.html in browser
2. Click microphone button
3. Speak: "Hello, how are you?"
4. Wait for AI response (text appears)
5. Audio should play automatically
6. Check dashboard for usage logs

## Troubleshooting

### Chat Widget Not Responding
**Symptom:** No response after sending message

**Solution:**
1. Check browser console for errors
2. Verify GROQ_API_KEY is set in Supabase
3. Check Edge Function logs:
   - Supabase Dashboard → Edge Functions → chat-groq → Logs

### TTS Not Playing
**Symptom:** Text response appears but no audio

**Solution:**
1. Check browser console for audio errors
2. Verify MINIMAX_API_KEY is set
3. Verify MINIMAX_TTS_URL is correct
4. Check browser autoplay settings
5. Check Edge Function logs for tts-minimax

### API Key Invalid
**Symptom:** "Invalid API key" error

**Solution:**
1. Regenerate key in dashboard
2. Verify key format: `odia_...`
3. Check key is active (not expired)
4. Verify quota not exceeded

### Speech Recognition Not Working
**Symptom:** Microphone button does nothing

**Solution:**
1. Grant microphone permissions in browser
2. Use HTTPS (required for Web Speech API)
3. Check browser compatibility (Chrome/Edge recommended)
4. Try typing instead of speaking

### Dashboard Login Issues
**Symptom:** Cannot log in after signup

**Solution:**
1. Check email for confirmation link
2. Click confirmation link
3. Try password reset if needed
4. Check Supabase Authentication logs

## Environment Variables Summary

```bash
# In Supabase Dashboard → Edge Functions → Environment Variables

# Required for Chat
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-8b-instant

# Required for TTS
MINIMAX_API_KEY=...
MINIMAX_TTS_URL=https://minimax-tts-odiadev.onrender.com/tts

# Automatically Set (No Action Needed)
SUPABASE_URL=https://ectphyvfbkwaawtnzrlo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
```

## Security Checklist

- [ ] API keys stored in environment variables (not code)
- [ ] RLS policies enabled on all tables
- [ ] User authentication required for dashboard
- [ ] API key quotas configured
- [ ] CORS properly configured
- [ ] HTTPS enabled on all endpoints

## Performance Checklist

- [ ] Target latency <250ms achieved
- [ ] Nigerian English recognition accurate
- [ ] TTS audio quality acceptable
- [ ] Widget loads quickly on 3G
- [ ] Database queries optimized

## Production Readiness

Current Status: **Ready for API Keys**

To Go Live:
1. ✅ Database schema complete
2. ✅ RLS policies configured
3. ✅ Edge Functions deployed
4. ✅ Frontend applications deployed
5. ⏳ Add GROQ_API_KEY (required)
6. ⏳ Add MINIMAX_API_KEY (required)
7. ⏳ Create admin account
8. ⏳ Generate and test API key
9. ⏳ Embed widget on production site
10. ⏳ Monitor usage and costs

## Support

Need help with setup?
- Email: ceo@odia.dev
- Admin Dashboard: https://bowssclmerw2.space.minimax.io
- Documentation: See ODIADEV-COMPLETE-DOCUMENTATION.md
