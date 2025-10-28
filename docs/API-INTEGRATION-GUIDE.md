# ODIADEV AI - API Integration Guide

## Quick Start

### 1. Get Your API Key
Visit the admin dashboard and generate an API key:
```
https://bowssclmerw2.space.minimax.io
```

### 2. Embed the Chat Widget
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>My Website Content</h1>
    
    <!-- Configure widget -->
    <script>
        window.ODIA_WIDGET = {
            apiKey: 'odia_your_key_here',
            theme: 'light',
            autoPlayAudio: true,
            voice: 'nigerian-male'
        };
    </script>
    
    <!-- Embed widget -->
    <iframe 
        src="https://wi226k0g9688.space.minimax.io" 
        style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
    ></iframe>
</body>
</html>
```

### 3. Test the Integration
Open your website and:
1. Click the microphone button
2. Speak in English or Nigerian Pidgin
3. AI responds with text
4. Audio plays automatically

## Direct API Usage

### Using JavaScript/TypeScript
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ectphyvfbkwaawtnzrlo.supabase.co',
  'YOUR_ANON_KEY'
);

// Chat with AI
async function chat(message, apiKey) {
  const { data, error } = await supabase.functions.invoke('chat-groq', {
    body: {
      message,
      apiKey,
      conversationHistory: []
    }
  });
  
  if (error) throw error;
  return data.data.response;
}

// Convert text to speech
async function textToSpeech(text, voice, apiKey) {
  const { data, error } = await supabase.functions.invoke('tts-minimax', {
    body: {
      text,
      voice,
      apiKey
    }
  });
  
  if (error) throw error;
  return data.data.audioUrl;
}

// Example usage
const response = await chat('Hello, how are you?', 'odia_your_key');
console.log(response);

const audioUrl = await textToSpeech('Hello world', 'nigerian-male', 'odia_your_key');
console.log(audioUrl);
```

### Using cURL
```bash
# Chat with AI
curl -X POST https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/chat-groq \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "message": "Hello, how are you?",
    "apiKey": "odia_your_key",
    "conversationHistory": []
  }'

# Text to Speech
curl -X POST https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/tts-minimax \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "text": "Hello world",
    "voice": "nigerian-male",
    "apiKey": "odia_your_key"
  }'
```

### Using Python
```python
import requests

SUPABASE_URL = "https://ectphyvfbkwaawtnzrlo.supabase.co"
ANON_KEY = "YOUR_ANON_KEY"
API_KEY = "odia_your_key"

def chat(message):
    response = requests.post(
        f"{SUPABASE_URL}/functions/v1/chat-groq",
        headers={
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "message": message,
            "apiKey": API_KEY,
            "conversationHistory": []
        }
    )
    return response.json()["data"]["response"]

def text_to_speech(text, voice="nigerian-male"):
    response = requests.post(
        f"{SUPABASE_URL}/functions/v1/tts-minimax",
        headers={
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "text": text,
            "voice": voice,
            "apiKey": API_KEY
        }
    )
    return response.json()["data"]["audioUrl"]

# Example usage
ai_response = chat("Tell me about Nigerian culture")
print(ai_response)

audio_url = text_to_speech(ai_response)
print(f"Audio URL: {audio_url}")
```

## Widget Configuration Options

### Theme Options
```javascript
window.ODIA_WIDGET = {
    theme: 'light', // 'light' or 'dark'
};
```

### Voice Options
```javascript
window.ODIA_WIDGET = {
    voice: 'nigerian-male', // 'nigerian-male' or 'nigerian-female'
};
```

### Auto-play Control
```javascript
window.ODIA_WIDGET = {
    autoPlayAudio: false, // User must click to play audio
};
```

### Complete Configuration
```javascript
window.ODIA_WIDGET = {
    apiKey: 'odia_abc123...',    // Required for tracking
    theme: 'dark',                // UI theme
    autoPlayAudio: true,          // Auto-play TTS
    voice: 'nigerian-female'      // Voice model
};
```

## Widget Styling

### Floating Bottom-Right
```html
<iframe 
    src="https://wi226k0g9688.space.minimax.io" 
    style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
    "
></iframe>
```

### Full-Screen
```html
<iframe 
    src="https://wi226k0g9688.space.minimax.io" 
    style="
        width: 100vw;
        height: 100vh;
        border: none;
    "
></iframe>
```

### Mobile-Optimized
```html
<iframe 
    src="https://wi226k0g9688.space.minimax.io" 
    style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 70vh;
        border: none;
        border-radius: 16px 16px 0 0;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
    "
></iframe>
```

## Error Handling

### JavaScript Error Handling
```javascript
try {
  const { data, error } = await supabase.functions.invoke('chat-groq', {
    body: { message: 'Hello', apiKey: 'odia_key' }
  });
  
  if (error) {
    console.error('API Error:', error);
    // Handle specific errors
    if (error.message.includes('quota exceeded')) {
      alert('API quota exceeded. Please upgrade your plan.');
    } else if (error.message.includes('Invalid')) {
      alert('Invalid API key');
    } else {
      alert('An error occurred. Please try again.');
    }
  } else {
    console.log('Response:', data.data.response);
  }
} catch (err) {
  console.error('Network error:', err);
  alert('Network error. Please check your connection.');
}
```

### Common Error Codes
- `CHAT_FAILED` - Groq API error or network issue
- `TTS_FAILED` - Minimax TTS error or network issue
- `KEY_GENERATION_FAILED` - API key creation error
- `STATS_FAILED` - Usage statistics retrieval error
- `VERIFICATION_FAILED` - API key verification error

## Rate Limiting

Current limits:
- No hard limits implemented
- Soft limits via API key quotas
- Recommended: Implement client-side throttling

Example client-side throttling:
```javascript
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

async function throttledChat(message, apiKey) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return await chat(message, apiKey);
}
```

## Best Practices

### 1. API Key Security
```javascript
// ✅ DO: Store API key securely
const API_KEY = process.env.ODIA_API_KEY;

// ❌ DON'T: Hardcode API key in frontend
const API_KEY = 'odia_abc123...';
```

### 2. Error Handling
```javascript
// ✅ DO: Handle all error cases
try {
  const response = await chat(message, apiKey);
  displayResponse(response);
} catch (error) {
  logError(error);
  showUserFriendlyMessage();
}

// ❌ DON'T: Ignore errors
const response = await chat(message, apiKey);
displayResponse(response);
```

### 3. Loading States
```javascript
// ✅ DO: Show loading indicators
setLoading(true);
const response = await chat(message, apiKey);
setLoading(false);
displayResponse(response);

// ❌ DON'T: Leave users waiting
const response = await chat(message, apiKey);
displayResponse(response);
```

### 4. Conversation Context
```javascript
// ✅ DO: Maintain conversation history
const history = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' }
];
const response = await chat('How are you?', apiKey, history);

// ❌ DON'T: Send isolated messages
const response = await chat('How are you?', apiKey, []);
```

## Support

Need help? Contact us:
- Email: ceo@odia.dev
- Dashboard: https://bowssclmerw2.space.minimax.io
- Documentation: See ODIADEV-COMPLETE-DOCUMENTATION.md
