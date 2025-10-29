# Vercel Environment Variables Setup

To properly configure the ODIADEV Voice AI widget with your API keys, you need to set environment variables in your Vercel project.

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables" in the left sidebar
5. Add the following environment variables:

### Required Environment Variables

```
GROQ_API_KEY=your_groq_api_key_here
MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_GROUP_ID=your_minimax_group_id_here
MINIMAX_MODEL=speech-02-hd
DEFAULT_VOICE=moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc
```

## API Key Details

### Groq API Key
- Get from: https://console.groq.com
- Used for: LLM processing with llama-3.1-8b-instant
- Environment variable: `GROQ_API_KEY`

### Minimax API Configuration
- Get from: https://www.minimax.chat
- Used for: Text-to-speech synthesis
- Environment variables:
  - `MINIMAX_API_KEY`: Your Minimax API key
  - `MINIMAX_GROUP_ID`: Your Minimax group ID
  - `MINIMAX_MODEL`: speech-02-hd (recommended)
  - `DEFAULT_VOICE`: moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc (Odia African male default)

## Available Voices

1. **Odia African Male (Default)**:
   - Voice ID: `moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc`
   - Environment variable: `DEFAULT_VOICE`

2. **Joslyn African Female**:
   - Voice ID: `moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc`
   - To use this voice, set `DEFAULT_VOICE` to this ID

3. **African Female Voice**:
   - Voice ID: `moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82`
   - To use this voice, set `DEFAULT_VOICE` to this ID

## Testing Your Configuration

After setting up the environment variables:

1. Redeploy your application
2. Visit `/widget-functional-test.html`
3. Click "Load from Environment" to test the configuration
4. The widget should now work with your API keys

## Security Notes

- Environment variables are securely stored by Vercel
- They are not exposed to the frontend
- Never commit API keys to your repository
- Use Vercel's environment variables for production deployments

## Troubleshooting

If the widget is not working:

1. Check that all environment variables are correctly set
2. Verify your API keys are valid and have not expired
3. Check the Vercel deployment logs for any errors
4. Look at the browser console for client-side errors