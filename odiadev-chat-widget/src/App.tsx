import React from 'react';
import { Mic, MicOff, Send, Volume2, Loader2 } from 'lucide-react';

// Define types
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OdiaWidgetConfig {
  apiKey?: string;
  voice?: string;
  autoPlayAudio?: boolean;
  theme?: 'light' | 'dark';
  groqApiKey?: string;
  minimaxApiKey?: string;
  minimaxGroupId?: string;
  minimaxModel?: string;
}

// Declare global window object
declare global {
  interface Window {
    ODIA_WIDGET?: OdiaWidgetConfig;
  }
}

function App() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [config] = React.useState<OdiaWidgetConfig>(() => window.ODIA_WIDGET || {});
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<any>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Initialize speech recognition with Nigerian English
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-NG'; // Nigerian English
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Call Groq chat endpoint directly
      const groqApiKey = config.groqApiKey || 'YOUR_GROQ_API_KEY';
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const messagesForGroq = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant optimized for Nigerian English and Pidgin. Provide clear, concise responses with cultural awareness. Keep responses under 100 words for fast TTS conversion. You know all about the company staff, projects, and etc.'
        },
        ...conversationHistory,
        { role: 'user', content: inputText }
      ];

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messagesForGroq,
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!groqResponse.ok) {
        throw new Error(`Groq API error: ${groqResponse.status}`);
      }

      const groqData = await groqResponse.json();
      const aiResponse = groqData.choices[0]?.message?.content || 'Sorry, I could not process that.';
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-play TTS if enabled
      if (config.autoPlayAudio !== false) {
        await playTTS(aiResponse);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const playTTS = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      // Call Minimax TTS API directly
      const minimaxApiKey = config.minimaxApiKey || 'YOUR_MINIMAX_API_KEY';
      const minimaxGroupId = config.minimaxGroupId || 'YOUR_MINIMAX_GROUP_ID';
      const minimaxModel = config.minimaxModel || 'speech-02-hd';
      
      const ttsResponse = await fetch('https://api.minimax.chat/v1/tts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${minimaxApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          voice: config.voice || 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc', // Austyn african male default
          speed: 1.0,
          pitch: 1.0,
          model: minimaxModel,
          group_id: minimaxGroupId
        })
      });

      if (!ttsResponse.ok) {
        throw new Error(`Minimax TTS error: ${ttsResponse.status}`);
      }

      const ttsData = await ttsResponse.json();
      const audioUrl = ttsData.audio_url || ttsData.url;
      
      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }

    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const theme = config.theme || 'light';
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">ODIADEV Voice AI</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Nigerian English Optimized
            </p>
          </div>
          {(config.groqApiKey || config.minimaxApiKey) && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`}></div>
              <span className="text-xs">Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Mic className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Start a conversation with voice or text
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`px-4 py-3 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-end gap-2">
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`p-3 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-500 text-white'
                : isDark
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type or speak your message..."
            rows={1}
            className={`flex-1 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
          
          {isSpeaking && (
            <div className="p-3">
              <Volume2 className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} />
    </div>
  );
}

export default App;