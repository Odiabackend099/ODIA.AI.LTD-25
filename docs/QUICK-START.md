# ODIADEV AI - Quick Start Guide

## 5-Minute Setup

### Step 1: Add API Keys (2 minutes)

1. **Get Groq API Key:**
   - Visit: https://console.groq.com
   - Sign up/Login
   - Create API key
   - Copy key (starts with `gsk_`)

2. **Add to Supabase:**
   - Go to: https://supabase.com/dashboard
   - Select project: `ectphyvfbkwaawtnzrlo`
   - Navigate to: Project Settings → Edge Functions → Environment Variables
   - Click "Add variable"
   - Add:
     ```
     Name: GROQ_API_KEY
     Value: gsk_your_key_here
     ```
   - Add:
     ```
     Name: MINIMAX_API_KEY
     Value: your_minimax_key_here
     ```
   - Add:
     ```
     Name: MINIMAX_TTS_URL
     Value: https://minimax-tts-odiadev.onrender.com/tts
     ```
   - Click "Save"

### Step 2: Create Admin Account (1 minute)

1. Visit: https://bowssclmerw2.space.minimax.io
2. Click "Sign Up"
3. Enter email and password
4. Check email for confirmation
5. Click link and login

### Step 3: Generate API Key (30 seconds)

1. In dashboard, click "Generate New Key"
2. Copy the generated key (starts with `odia_`)
3. Store securely

### Step 4: Test Widget (1 minute)

Create `test.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>ODIADEV Test</title>
</head>
<body>
    <h1>Testing ODIADEV Voice AI</h1>
    
    <script>
        window.ODIA_WIDGET = {
            apiKey: 'PASTE_YOUR_ODIA_KEY_HERE',
            theme: 'light',
            autoPlayAudio: true,
            voice: 'nigerian-male'
        };
    </script>
    
    <iframe 
        src="https://wi226k0g9688.space.minimax.io" 
        style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999;"
    ></iframe>
</body>
</html>
```

Open in browser and:
1. Click microphone button
2. Say "Hello, how are you?"
3. Wait for AI response
4. Audio plays automatically

### Step 5: Go Live (30 seconds)

Add to your production website:
```html
<script>
    window.ODIA_WIDGET = {
        apiKey: 'odia_your_production_key',
        theme: 'light',
        autoPlayAudio: true,
        voice: 'nigerian-male'
    };
</script>

<iframe 
    src="https://wi226k0g9688.space.minimax.io" 
    style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999;"
></iframe>
```

## That's It!

You now have a fully functional voice AI system with:
- Nigerian English speech recognition
- Sub-250ms AI responses
- Professional TTS voices
- Usage tracking
- API key management

## Key URLs

- **Chat Widget:** https://wi226k0g9688.space.minimax.io
- **Admin Dashboard:** https://bowssclmerw2.space.minimax.io
- **Supabase Project:** https://ectphyvfbkwaawtnzrlo.supabase.co

## Need Help?

- Email: ceo@odia.dev
- Full Documentation: See `/workspace/docs/ODIADEV-COMPLETE-DOCUMENTATION.md`
- Integration Guide: See `/workspace/docs/API-INTEGRATION-GUIDE.md`
- Setup Guide: See `/workspace/docs/ENVIRONMENT-SETUP.md`

---

**ODIADEV AI LTD**  
*Democratizing voice intelligence for African businesses*
