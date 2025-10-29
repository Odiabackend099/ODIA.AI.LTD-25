// Vercel serverless function to provide widget configuration
export default async function handler(request, response) {
  // Return the configuration from environment variables
  const config = {
    groqApiKey: process.env.GROQ_API_KEY || null,
    minimaxApiKey: process.env.MINIMAX_API_KEY || null,
    minimaxGroupId: process.env.MINIMAX_GROUP_ID || null,
    minimaxModel: process.env.MINIMAX_MODEL || 'speech-02-hd',
    voice: process.env.DEFAULT_VOICE || 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
    theme: 'light',
    autoPlayAudio: true
  };

  response.status(200).json(config);
}