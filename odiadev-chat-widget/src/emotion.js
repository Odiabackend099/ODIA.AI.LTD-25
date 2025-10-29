// emotion.js - Emotion Detection for Voice AI Widget

class VoiceAIEmotion {
  constructor() {
    this.isEmotionDetectionEnabled = false;
    this.emotionModel = null;
    this.audioContext = null;
  }

  // Initialize emotion detection
  async initialize() {
    try {
      // Check if browser supports required APIs
      if (!window.AudioContext && !window.webkitAudioContext) {
        console.warn("AudioContext not supported in this browser");
        return false;
      }

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isEmotionDetectionEnabled = true;
      
      console.log("Emotion detection initialized successfully");
      return true;
    } catch (error) {
      console.error("Emotion detection initialization failed:", error);
      return false;
    }
  }

  // Analyze audio stream for emotional cues
  async analyzeEmotion(audioStream) {
    if (!this.isEmotionDetectionEnabled) {
      console.warn("Emotion detection not initialized");
      // Return neutral emotion as fallback
      return {
        emotion: "neutral",
        confidence: 0.5,
        intensity: 0.5
      };
    }

    try {
      // Create audio analysis nodes
      const source = this.audioContext.createMediaStreamSource(audioStream);
      const analyser = this.audioContext.createAnalyser();
      
      // Configure analyser
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);

      // Get audio data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Analyze emotional cues from audio features
      const features = this.extractAudioFeatures(dataArray, analyser);
      const emotion = this.classifyEmotion(features);
      
      return emotion;
    } catch (error) {
      console.error("Emotion analysis failed:", error);
      // Return neutral emotion as fallback
      return {
        emotion: "neutral",
        confidence: 0.5,
        intensity: 0.5
      };
    }
  }

  // Extract audio features for emotion analysis
  extractAudioFeatures(dataArray, analyser) {
    // Calculate various audio features
    let sum = 0;
    let max = 0;
    let min = 255;
    
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
      if (dataArray[i] > max) max = dataArray[i];
      if (dataArray[i] < min) min = dataArray[i];
    }
    
    const average = sum / dataArray.length;
    const amplitudeVariation = max - min;
    
    // Calculate spectral centroid (brightness)
    let spectralSum = 0;
    let weightedSum = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      spectralSum += dataArray[i];
      weightedSum += dataArray[i] * i;
    }
    
    const spectralCentroid = spectralSum > 0 ? weightedSum / spectralSum : 0;
    
    // Calculate zero-crossing rate approximation
    let zeroCrossings = 0;
    for (let i = 1; i < dataArray.length; i++) {
      if ((dataArray[i-1] < 128 && dataArray[i] >= 128) || 
          (dataArray[i-1] >= 128 && dataArray[i] < 128)) {
        zeroCrossings++;
      }
    }
    
    return {
      averageAmplitude: average,
      amplitudeVariation: amplitudeVariation,
      spectralCentroid: spectralCentroid,
      zeroCrossings: zeroCrossings,
      maxAmplitude: max,
      minAmplitude: min
    };
  }

  // Classify emotion based on audio features
  classifyEmotion(features) {
    // This is a simplified emotion classification
    // A real implementation would use ML models
    
    const {
      averageAmplitude,
      amplitudeVariation,
      spectralCentroid,
      zeroCrossings
    } = features;
    
    // Determine emotion based on audio characteristics
    let emotion = "neutral";
    let confidence = 0.7;
    let intensity = 0.5;
    
    // High amplitude variation might indicate excitement or anger
    if (amplitudeVariation > 150) {
      if (averageAmplitude > 150) {
        emotion = "excited";
        intensity = Math.min(1.0, amplitudeVariation / 200);
      } else {
        emotion = "angry";
        intensity = Math.min(1.0, amplitudeVariation / 200);
      }
    }
    // Low amplitude might indicate sadness or calmness
    else if (averageAmplitude < 50) {
      if (spectralCentroid < 500) {
        emotion = "sad";
        intensity = 1.0 - (averageAmplitude / 50);
      } else {
        emotion = "calm";
        intensity = 1.0 - (averageAmplitude / 50);
      }
    }
    // Medium amplitude with high zero crossings might indicate happiness
    else if (zeroCrossings > 300) {
      emotion = "happy";
      intensity = Math.min(1.0, zeroCrossings / 500);
    }
    
    // Adjust confidence based on feature clarity
    if (amplitudeVariation > 100 || amplitudeVariation < 30) {
      confidence = 0.9;
    } else {
      confidence = 0.6;
    }
    
    return {
      emotion: emotion,
      confidence: confidence,
      intensity: intensity,
      features: features
    };
  }

  // Get emotional response suggestions based on detected emotion
  getEmotionalResponse(emotionResult) {
    const { emotion, intensity } = emotionResult;
    
    const responseModifiers = {
      happy: {
        tone: "enthusiastic",
        pace: "moderate",
        wordChoice: "positive"
      },
      excited: {
        tone: "energetic",
        pace: "fast",
        wordChoice: "exuberant"
      },
      sad: {
        tone: "gentle",
        pace: "slow",
        wordChoice: "comforting"
      },
      angry: {
        tone: "calm",
        pace: "steady",
        wordChoice: "de-escalating"
      },
      calm: {
        tone: "smooth",
        pace: "relaxed",
        wordChoice: "soothing"
      },
      neutral: {
        tone: "balanced",
        pace: "natural",
        wordChoice: "clear"
      }
    };
    
    return responseModifiers[emotion] || responseModifiers.neutral;
  }

  // Adjust TTS parameters based on detected emotion
  adjustTTSForEmotion(ttsParams, emotionResult) {
    const modifiers = this.getEmotionalResponse(emotionResult);
    
    // Adjust TTS parameters based on emotion
    const adjustedParams = { ...ttsParams };
    
    switch (modifiers.tone) {
      case "enthusiastic":
        adjustedParams.speed = ttsParams.speed ? ttsParams.speed * 1.1 : 1.1;
        adjustedParams.pitch = ttsParams.pitch ? ttsParams.pitch + 0.1 : 0.1;
        break;
      case "energetic":
        adjustedParams.speed = ttsParams.speed ? ttsParams.speed * 1.2 : 1.2;
        adjustedParams.pitch = ttsParams.pitch ? ttsParams.pitch + 0.2 : 0.2;
        break;
      case "gentle":
        adjustedParams.speed = ttsParams.speed ? ttsParams.speed * 0.9 : 0.9;
        adjustedParams.pitch = ttsParams.pitch ? ttsParams.pitch - 0.1 : -0.1;
        break;
      case "calm":
        adjustedParams.speed = ttsParams.speed ? ttsParams.speed * 0.8 : 0.8;
        adjustedParams.pitch = ttsParams.pitch ? ttsParams.pitch - 0.2 : -0.2;
        break;
      case "smooth":
        adjustedParams.speed = ttsParams.speed ? ttsParams.speed * 0.95 : 0.95;
        break;
    }
    
    return adjustedParams;
  }

  // Enable/disable emotion detection
  setEmotionDetection(enabled) {
    this.isEmotionDetectionEnabled = enabled;
  }

  // Cleanup resources
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isEmotionDetectionEnabled = false;
  }
}

// Export singleton instance
const voiceAIEmotion = new VoiceAIEmotion();
export default voiceAIEmotion;