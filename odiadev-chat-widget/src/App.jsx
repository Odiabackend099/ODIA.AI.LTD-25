import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, Volume2, Loader2, Square } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInterrupting, setIsInterrupting] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [config, setConfig] = useState({
    groqApiKey: 'YOUR_GROQ_API_KEY',
    minimaxApiKey: 'YOUR_MINIMAX_API_KEY',
    minimaxGroupId: 'YOUR_MINIMAX_GROUP_ID',
    minimaxModel: 'speech-02-hd',
    voice: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
    theme: 'light',
    autoPlayAudio: true
  });
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const groqAbortControllerRef = useRef(null);
  const ttsAbortControllerRef = useRef(null);
  const responseBufferRef = useRef([]);
  const isStreamingRef = useRef(false);
  const currentAudioQueueRef = useRef([]);

  // Voice Activity Detection parameters
  const VAD_THRESHOLD = 0.01;
  const SILENCE_DURATION = 1500; // ms

  // Load configuration from API or window object
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // First check if config is provided via window object
        if (window.ODIA_WIDGET) {
          setConfig(prev => ({
            ...prev,
            ...window.ODIA_WIDGET
          }));
          return;
        }
        
        // Try to load from API endpoint
        const response = await fetch('/api/widget-config');
        if (response.ok) {
          const apiConfig = await response.json();
          // Only update if we have actual values (not null)
          setConfig(prev => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(apiConfig).filter(([_, v]) => v !== null)
            )
          }));
        }
      } catch (error) {
        console.log('Could not load configuration from API, using defaults');
      }
    };
    
    loadConfig();
  }, []);

  // Debug logging
  console.log('Widget loaded with config:', config);

  // Initialize speech recognition with Nigerian English
  useEffect(() => {
    console.log('Initializing speech recognition...');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-NG'; // Nigerian English
      
      recognition.onresult = (event) => {
        console.log('Speech recognition result:', event);
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          setInputText(prev => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        if (isListening) {
          recognition.start();
        }
      };
      
      recognitionRef.current = recognition;
      console.log('Speech recognition initialized successfully');
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
    
    return () => {
      console.log('Cleaning up speech recognition');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      cleanupAudioResources();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  // Cleanup audio resources
  const cleanupAudioResources = () => {
    console.log('Cleaning up audio resources');
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  // Voice Activity Detection
  const initializeVAD = async () => {
    console.log('Initializing VAD...');
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      sourceRef.current.connect(analyserRef.current);
      
      const detectVoice = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length / 255;
        
        // Voice activity detection
        if (average > VAD_THRESHOLD) {
          // Voice detected, reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        } else {
          // Silence detected
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              if (isListening) {
                console.log('Silence detected, stopping listening');
                stopListening();
              }
            }, SILENCE_DURATION);
          }
        }
        
        requestAnimationFrame(detectVoice);
      };
      
      detectVoice();
      console.log('VAD initialized successfully');
    } catch (error) {
      console.error('VAD initialization error:', error);
    }
  };

  const startListening = async () => {
    console.log('Start listening called');
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    try {
      if (isSpeaking) {
        interruptSpeech();
      }
      
      setIsListening(true);
      setInputText('');
      recognitionRef.current.start();
      console.log('Speech recognition started');
      
      // Initialize VAD
      await initializeVAD();
    } catch (error) {
      console.error('Error starting listening:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    console.log('Stop listening called');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    cleanupAudioResources();
    
    if (inputText.trim()) {
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    console.log('Toggle listening called, current state:', isListening);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Interrupt current speech
  const interruptSpeech = () => {
    console.log('Interrupt speech called');
    setIsInterrupting(true);
    setIsSpeaking(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
    }
    
    // Clear audio queue
    currentAudioQueueRef.current = [];
    
    setTimeout(() => {
      setIsInterrupting(false);
    }, 100);
  };

  // Streaming handler for Groq API
  const streamGroqResponse = async (userMessage) => {
    try {
      console.log('Streaming Groq response for message:', userMessage);
      // Check if API keys are configured
      const groqApiKey = config.groqApiKey || 'YOUR_GROQ_API_KEY';
      const hasGroqKey = groqApiKey && groqApiKey !== 'YOUR_GROQ_API_KEY';
      
      if (!hasGroqKey) {
        throw new Error('GROQ_API_KEY not configured');
      }
      
      setIsProcessing(true);
      isStreamingRef.current = true;
      setStreamingResponse('');
      responseBufferRef.current = [];
      
      // Create AbortController for this request
      groqAbortControllerRef.current = new AbortController();
      
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const messagesForGroq = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant optimized for Nigerian English and Pidgin. Provide clear, concise responses with cultural awareness. Respond in short segments for streaming.'
        },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      // Using Groq's streaming endpoint
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messagesForGroq,
          max_tokens: 200,
          temperature: 0.7,
          stream: true
        }),
        signal: groqAbortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                accumulatedResponse += content;
                setStreamingResponse(accumulatedResponse);
                
                // Buffer response for TTS
                responseBufferRef.current.push(content);
                
                // Generate TTS for segments
                if (accumulatedResponse.endsWith('.') || accumulatedResponse.endsWith('!') || accumulatedResponse.endsWith('?') || accumulatedResponse.length > 50) {
                  if (config.autoPlayAudio !== false) {
                    await generateAndPlayTTS(accumulatedResponse);
                    responseBufferRef.current = [];
                    accumulatedResponse = '';
                  }
                }
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
      
      // Play remaining content
      if (accumulatedResponse && config.autoPlayAudio !== false) {
        await generateAndPlayTTS(accumulatedResponse);
      }
      
      // Add final message to chat
      const assistantMessage = {
        role: 'assistant',
        content: accumulatedResponse || streamingResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingResponse('');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Streaming aborted');
      } else {
        console.error('Streaming error:', error);
        let errorMessageContent = 'Sorry, there was an error processing your request.';
        
        if (error.message.includes('GROQ_API_KEY')) {
          errorMessageContent = 'GROQ API key not configured. Please set GROQ_API_KEY in environment variables or window.ODIA_WIDGET configuration.';
        } else if (error.message.includes('API error')) {
          errorMessageContent = `API error: ${error.message}`;
        }
        
        const errorMessage = {
          role: 'assistant',
          content: errorMessageContent,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      isStreamingRef.current = false;
      setIsProcessing(false);
      setStreamingResponse('');
    }
  };

  // Generate and play TTS with streaming
  const generateAndPlayTTS = async (text) => {
    if (!text.trim()) return;
    
    try {
      console.log('Generating TTS for text:', text);
      // Check if Minimax API keys are configured
      const minimaxApiKey = config.minimaxApiKey || 'YOUR_MINIMAX_API_KEY';
      const minimaxGroupId = config.minimaxGroupId || 'YOUR_MINIMAX_GROUP_ID';
      const hasMinimaxKey = minimaxApiKey && minimaxApiKey !== 'YOUR_MINIMAX_API_KEY';
      
      if (!hasMinimaxKey) {
        console.warn('Minimax API key not configured - skipping TTS');
        return;
      }
      
      setIsSpeaking(true);
      ttsAbortControllerRef.current = new AbortController();
      
      const minimaxModel = config.minimaxModel || 'speech-02-hd';
      const voice = config.voice || 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc';
      
      const ttsResponse = await fetch('https://api.minimax.chat/v1/tts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${minimaxApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          voice: voice,
          speed: 1.0,
          pitch: 1.0,
          model: minimaxModel,
          group_id: minimaxGroupId
        }),
        signal: ttsAbortControllerRef.current.signal
      });

      if (!ttsResponse.ok) {
        throw new Error(`Minimax TTS error: ${ttsResponse.status}`);
      }

      const ttsData = await ttsResponse.json();
      const audioUrl = ttsData.audio_url || ttsData.url;
      
      if (audioUrl && audioRef.current) {
        // Queue audio for playback
        currentAudioQueueRef.current.push(audioUrl);
        
        // Play if not already playing
        if (currentAudioQueueRef.current.length === 1) {
          await playAudioQueue();
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('TTS error:', error);
        // Don't show TTS errors to user since it's not critical for text chat
      }
    }
  };

  // Play audio queue
  const playAudioQueue = async () => {
    while (currentAudioQueueRef.current.length > 0 && !isInterrupting) {
      const audioUrl = currentAudioQueueRef.current[0];
      
      try {
        audioRef.current.src = audioUrl;
        await new Promise((resolve, reject) => {
          audioRef.current.onended = resolve;
          audioRef.current.onerror = reject;
          audioRef.current.play().catch(reject);
        });
      } catch (error) {
        console.error('Audio playback error:', error);
      }
      
      // Remove played audio from queue
      currentAudioQueueRef.current.shift();
    }
    
    if (currentAudioQueueRef.current.length === 0) {
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    console.log('Handle send message called with text:', inputText);
    if (!inputText.trim() || isProcessing) return;

    // Check if API keys are configured
    const hasGroqKey = config.groqApiKey && config.groqApiKey !== 'YOUR_GROQ_API_KEY';
    const hasMinimaxKey = config.minimaxApiKey && config.minimaxApiKey !== 'YOUR_MINIMAX_API_KEY';
    
    if (!hasGroqKey || !hasMinimaxKey) {
      const errorMessage = {
        role: 'assistant',
        content: 'API keys not configured. Please set environment variables or configure via window.ODIA_WIDGET.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, {role: 'user', content: inputText, timestamp: new Date()}, errorMessage]);
      setInputText('');
      return;
    }

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Use streaming for response
    await streamGroqResponse(inputText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isListening) {
        stopListening();
      } else {
        handleSendMessage();
      }
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
          <div className="flex items-center gap-2">
            {(config.groqApiKey && config.groqApiKey !== 'YOUR_GROQ_API_KEY') && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`}></div>
                <span className="text-xs">Connected</span>
              </div>
            )}
            {isListening && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Listening</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs">Thinking</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-blue-500" />
                <span className="text-xs">Speaking</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isListening && (
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
        
        {/* Streaming response */}
        {streamingResponse && (
          <div className="flex justify-start">
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <p className="text-sm">{streamingResponse}</p>
              <div className="flex items-center mt-1">
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                <span className="text-xs text-gray-400">Typing...</span>
              </div>
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
            className={`p-3 rounded-lg transition-colors relative ${
              isListening
                ? 'bg-red-500 text-white'
                : isDark
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isListening && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </button>
          
          {isListening && (
            <button
              onClick={stopListening}
              className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <Square className="w-5 h-5" />
            </button>
          )}
          
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
          
          {(isSpeaking || isInterrupting) && (
            <button
              onClick={interruptSpeech}
              className="p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Square className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <audio ref={audioRef} onEnded={() => {
        if (currentAudioQueueRef.current.length > 0) {
          playAudioQueue();
        } else {
          setIsSpeaking(false);
        }
      }} />
    </div>
  );
}

export default App;