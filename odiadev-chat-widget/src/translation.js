// translation.js - Real-time Translation for Voice AI Widget

class VoiceAITranslation {
  constructor() {
    this.supportedLanguages = [
      { code: 'en', name: 'English', dialects: ['nigerian', 'general'] },
      { code: 'pcm', name: 'Nigerian Pidgin', dialects: ['lagos', 'general'] },
      { code: 'ha', name: 'Hausa', dialects: ['general'] },
      { code: 'yo', name: 'Yoruba', dialects: ['general'] },
      { code: 'sw', name: 'Swahili', dialects: ['general'] }
    ];
    
    this.currentSourceLanguage = 'en';
    this.currentTargetLanguage = 'pcm';
    this.isTranslationEnabled = false;
    
    // Translation cache to improve performance
    this.translationCache = new Map();
    this.cacheSizeLimit = 100;
  }

  // Initialize translation service
  async initialize() {
    try {
      // Check if browser supports required features
      if (!window.fetch) {
        console.warn("Fetch API not supported in this browser");
        return false;
      }

      this.isTranslationEnabled = true;
      console.log("Translation service initialized successfully");
      return true;
    } catch (error) {
      console.error("Translation initialization failed:", error);
      return false;
    }
  }

  // Set source and target languages
  setLanguages(source, target) {
    if (this.isValidLanguage(source) && this.isValidLanguage(target)) {
      this.currentSourceLanguage = source;
      this.currentTargetLanguage = target;
      return true;
    }
    return false;
  }

  // Validate if language is supported
  isValidLanguage(languageCode) {
    return this.supportedLanguages.some(lang => 
      lang.code === languageCode || 
      lang.dialects.includes(languageCode)
    );
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Translate text using external API (simulated)
  async translateText(text, sourceLang = null, targetLang = null) {
    const source = sourceLang || this.currentSourceLanguage;
    const target = targetLang || this.currentTargetLanguage;
    
    // Check cache first
    const cacheKey = `${source}:${target}:${text}`;
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }
    
    if (!this.isTranslationEnabled) {
      console.warn("Translation service not initialized");
      return text; // Return original text as fallback
    }
    
    try {
      // In a real implementation, this would call a translation API
      // For this implementation, we'll simulate translation
      
      const translatedText = this.simulateTranslation(text, source, target);
      
      // Cache the translation
      this.cacheTranslation(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // Return original text as fallback
    }
  }

  // Simulate translation (in a real implementation, this would call an API)
  simulateTranslation(text, sourceLang, targetLang) {
    // This is a simplified simulation
    // A real implementation would use neural machine translation
    
    const translations = {
      'en:pcm': {
        'Hello': 'How far',
        'How are you?': 'How you dey?',
        'Good morning': 'Morning o',
        'Thank you': 'Thank you o',
        'Goodbye': 'Bye bye',
        'Yes': 'Yes o',
        'No': 'No be that',
        'I understand': 'I sabi',
        'Please': 'Abeg',
        'Sorry': 'Sorry o'
      },
      'pcm:en': {
        'How far': 'Hello',
        'How you dey?': 'How are you?',
        'Morning o': 'Good morning',
        'Thank you o': 'Thank you',
        'Bye bye': 'Goodbye',
        'Yes o': 'Yes',
        'No be that': 'No',
        'I sabi': 'I understand',
        'Abeg': 'Please',
        'Sorry o': 'Sorry'
      }
    };
    
    const langPair = `${sourceLang}:${targetLang}`;
    if (translations[langPair] && translations[langPair][text]) {
      return translations[langPair][text];
    }
    
    // If no direct translation, return with language indicator
    return `[${targetLang}] ${text}`;
  }

  // Cache translation to improve performance
  cacheTranslation(key, translation) {
    // Limit cache size
    if (this.translationCache.size >= this.cacheSizeLimit) {
      // Remove oldest entry
      const firstKey = this.translationCache.keys().next().value;
      this.translationCache.delete(firstKey);
    }
    
    this.translationCache.set(key, translation);
  }

  // Clear translation cache
  clearCache() {
    this.translationCache.clear();
  }

  // Translate speech-to-text result
  async translateSpeechResult(speechResult) {
    if (!speechResult || !speechResult.transcript) {
      return speechResult;
    }
    
    try {
      const translatedTranscript = await this.translateText(
        speechResult.transcript,
        this.currentSourceLanguage,
        this.currentTargetLanguage
      );
      
      return {
        ...speechResult,
        transcript: translatedTranscript,
        originalTranscript: speechResult.transcript,
        sourceLanguage: this.currentSourceLanguage,
        targetLanguage: this.currentTargetLanguage
      };
    } catch (error) {
      console.error("Speech result translation failed:", error);
      return speechResult;
    }
  }

  // Translate text-to-speech input
  async translateTTSInput(text) {
    try {
      // Translate from target language back to source language for processing
      const translatedText = await this.translateText(
        text,
        this.currentTargetLanguage,
        this.currentSourceLanguage
      );
      
      return {
        text: translatedText,
        originalText: text,
        sourceLanguage: this.currentSourceLanguage,
        targetLanguage: this.currentTargetLanguage
      };
    } catch (error) {
      console.error("TTS input translation failed:", error);
      return {
        text: text,
        originalText: text,
        sourceLanguage: this.currentSourceLanguage,
        targetLanguage: this.currentTargetLanguage
      };
    }
  }

  // Detect language of text (simulated)
  async detectLanguage(text) {
    // In a real implementation, this would use a language detection API
    // For this implementation, we'll use simple heuristics
    
    // Check for common Nigerian Pidgin words
    const pidginIndicators = ['how you dey', 'abeg', 'o', 'sabi'];
    const pidginCount = pidginIndicators.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    if (pidginCount > 1) {
      return { language: 'pcm', confidence: 0.8 };
    }
    
    // Default to English
    return { language: 'en', confidence: 0.7 };
  }

  // Enable/disable translation
  setTranslationEnabled(enabled) {
    this.isTranslationEnabled = enabled;
  }

  // Add new language support
  addLanguage(languageCode, languageName, dialects = []) {
    if (!this.supportedLanguages.some(lang => lang.code === languageCode)) {
      this.supportedLanguages.push({
        code: languageCode,
        name: languageName,
        dialects: dialects
      });
      return true;
    }
    return false;
  }

  // Remove language support
  removeLanguage(languageCode) {
    const index = this.supportedLanguages.findIndex(lang => lang.code === languageCode);
    if (index > -1) {
      this.supportedLanguages.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Export singleton instance
const voiceAITranslation = new VoiceAITranslation();
export default voiceAITranslation;