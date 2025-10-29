# ODIADEV Voice AI Widget Setup Guide

## Issue Identified

The chat widget is not responding to clicks because it requires API keys to function properly. When API keys are not configured, the widget displays an error message instead of processing voice or text input.

## Solution

To get the widget working, you need to configure your Groq and Minimax API keys.

## Step-by-Step Setup

### 1. Get Your API Keys

#### Groq API Key
1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key for later use

#### Minimax API Key
1. Go to [https://www.minimax.chat](https://www.minimax.chat)
2. Sign up or log in to your account
3. Navigate to developer/API section
4. Create a new API key and get your Group ID
5. Copy both the API key and Group ID for later use

### 2. Configure the Widget

There are two ways to configure the widget:

#### Method 1: Using the Functional Test Page (Recommended for Testing)

1. Visit your deployed functional test page:
   ```
   https://your-deployed-url/widget-functional-test.html
   ```

2. Enter your API keys in the form:
   - Groq API Key
   - Minimax API Key
   - Minimax Group ID

3. Click "Configure Widget"

4. The widget iframe will reload with your configuration

5. Now you can test the voice features:
   - Click the microphone button to start speaking
   - Allow microphone access when prompted
   - Speak your message
   - The widget should transcribe your speech and respond

#### Method 2: Manual Configuration

Add this script to any page where you embed the widget:

```html
<!-- Configure API keys BEFORE loading the widget -->
<script>
window.ODIA_WIDGET = {
  groqApiKey: 'YOUR_GROQ_API_KEY_HERE',
  minimaxApiKey: 'YOUR_MINIMAX_API_KEY_HERE',
  minimaxGroupId: 'YOUR_MINIMAX_GROUP_ID_HERE',
  theme: 'light', // or 'dark'
  autoPlayAudio: true
};
</script>

<!-- Then load the widget -->
<iframe 
  src="/widget" 
  width="400" 
  height="600" 
  style="border: 1px solid #ccc; border-radius: 8px;">
</iframe>
```

### 3. Testing the Widget

After configuration, test these features:

1. **Voice Input**:
   - Click the microphone button (red when active)
   - Allow microphone permissions
   - Speak clearly
   - The widget should transcribe your speech

2. **Text Input**:
   - Type in the text box at the bottom
   - Press Enter or click the send button
   - The widget should respond

3. **Voice Output**:
   - The widget should speak responses using Minimax TTS
   - Use the stop/interrupt button to stop speech

## Troubleshooting

### Common Issues

1. **Buttons don't respond**:
   - Ensure API keys are configured
   - Check browser console for errors (F12)
   - Refresh the page after configuring keys

2. **Microphone not working**:
   - Check browser permissions
   - Ensure you're using HTTPS (required for microphone access)
   - Try a different browser

3. **No voice response**:
   - Check Minimax API key and Group ID
   - Verify speakers/audio are working
   - Check browser console for TTS errors

### Browser Requirements

- Modern browser (Chrome, Firefox, Edge, Safari)
- HTTPS connection (required for microphone access)
- JavaScript enabled
- Web Speech API support (built into modern browsers)

### Console Debugging

Open browser developer tools (F12) and check the Console tab for:
- Configuration logs
- Speech recognition events
- API call information
- Error messages

## Features

Once properly configured, the widget provides:

1. **Voice Recognition**:
   - Real-time speech-to-text transcription
   - Automatic silence detection
   - Nigerian English optimization

2. **AI Processing**:
   - Powered by Groq's llama-3.1-8b-instant model
   - Fast response times
   - Context-aware conversations

3. **Voice Synthesis**:
   - High-quality text-to-speech with Minimax
   - Natural sounding voices
   - Automatic audio playback

4. **Additional Features**:
   - Dark/light theme support
   - Conversation history
   - Streaming responses
   - Interruption handling

## Security Notes

- API keys are stored in the browser's window object
- Never expose your API keys in public repositories
- Use environment-specific keys for development vs production
- Monitor API usage in your provider dashboards

## Support

If you continue to experience issues:

1. Check browser console for specific error messages
2. Verify API keys are valid and have not expired
3. Ensure your API keys have proper permissions
4. Contact support with console error messages