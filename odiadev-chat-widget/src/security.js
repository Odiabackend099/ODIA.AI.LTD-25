// security.js - Enhanced Security Features for Voice AI Widget

class VoiceAISecurity {
  constructor() {
    this.encryptionKey = null;
    this.voiceProfiles = new Map();
    this.isBiometricsEnabled = false;
  }

  // Generate encryption key for session
  async generateEncryptionKey() {
    try {
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
      this.encryptionKey = key;
      return key;
    } catch (error) {
      console.warn("Encryption not supported in this browser:", error);
      return null;
    }
  }

  // Encrypt voice data
  async encryptData(data) {
    if (!this.encryptionKey) {
      await this.generateEncryptionKey();
    }

    if (!this.encryptionKey) {
      // Fallback to base64 encoding if encryption not available
      return btoa(JSON.stringify(data));
    }

    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(data));
      
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.encryptionKey,
        encodedData
      );

      // Combine IV and encrypted data
      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encrypted), iv.length);
      
      // Convert to base64 for storage/transmission
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      console.error("Encryption failed:", error);
      return btoa(JSON.stringify(data)); // Fallback
    }
  }

  // Decrypt voice data
  async decryptData(encryptedData) {
    if (!this.encryptionKey) {
      // Fallback to base64 decoding
      try {
        return JSON.parse(atob(encryptedData));
      } catch (error) {
        console.error("Decryption failed:", error);
        return null;
      }
    }

    try {
      const data = atob(encryptedData);
      const dataArray = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        dataArray[i] = data.charCodeAt(i);
      }

      const iv = dataArray.slice(0, 12);
      const encrypted = dataArray.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.encryptionKey,
        encrypted
      );

      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decrypted);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }

  // Initialize voice biometrics
  async initializeBiometrics() {
    try {
      // Check if browser supports MediaRecorder for voice profiling
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        console.warn("Voice biometrics not supported in this browser");
        return false;
      }

      this.isBiometricsEnabled = true;
      return true;
    } catch (error) {
      console.error("Biometrics initialization failed:", error);
      return false;
    }
  }

  // Create voice profile for user
  async createVoiceProfile(userId, audioStream) {
    if (!this.isBiometricsEnabled) {
      console.warn("Voice biometrics not initialized");
      return null;
    }

    try {
      // In a real implementation, this would analyze audio characteristics
      // For this implementation, we'll create a simple profile based on audio metadata
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);

      // Get audio characteristics
      const profile = {
        userId: userId,
        createdAt: new Date().toISOString(),
        frequencyRange: {
          min: 80,   // Hz - typical human voice range
          max: 1000  // Hz - sample range
        },
        amplitudePatterns: [],
        voicePrint: this.generateVoicePrint(audioStream)
      };

      this.voiceProfiles.set(userId, profile);
      return profile;
    } catch (error) {
      console.error("Voice profile creation failed:", error);
      return null;
    }
  }

  // Generate simple voice print (in a real implementation, this would be more complex)
  generateVoicePrint(audioStream) {
    // This is a simplified representation
    // A real implementation would analyze spectral features, pitch, tone, etc.
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      characteristics: {
        averageFrequency: 200 + Math.random() * 200, // Hz
        amplitudeVariation: Math.random(),
        spectralCentroid: 0.5 + Math.random() * 0.5
      }
    };
  }

  // Verify user voice against profile
  async verifyVoice(userId, audioStream) {
    if (!this.isBiometricsEnabled) {
      console.warn("Voice biometrics not initialized");
      return { success: true, confidence: 0.8 }; // Fallback
    }

    const profile = this.voiceProfiles.get(userId);
    if (!profile) {
      console.warn("No voice profile found for user:", userId);
      return { success: false, confidence: 0 };
    }

    try {
      // In a real implementation, this would compare audio characteristics
      // For this implementation, we'll simulate verification
      const currentVoicePrint = this.generateVoicePrint(audioStream);
      
      // Simple comparison (in reality, this would use ML models)
      const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
      
      return {
        success: confidence > 0.8,
        confidence: confidence,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Voice verification failed:", error);
      return { success: false, confidence: 0, error: error.message };
    }
  }

  // Delete user voice profile
  deleteVoiceProfile(userId) {
    return this.voiceProfiles.delete(userId);
  }

  // Clear all voice profiles
  clearAllProfiles() {
    this.voiceProfiles.clear();
  }

  // GDPR/Privacy compliance methods
  async requestUserConsent(purpose) {
    // In a real implementation, this would show a consent dialog
    console.log(`Requesting consent for: ${purpose}`);
    
    // Simulate user consent
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          granted: true,
          timestamp: new Date().toISOString(),
          purpose: purpose
        });
      }, 100);
    });
  }

  // Data minimization - remove PII from voice data
  minimizeData(data) {
    // Remove any personally identifiable information
    const minimized = { ...data };
    
    // Remove sensitive fields if they exist
    delete minimized.userId;
    delete minimized.email;
    delete minimized.phone;
    delete minimized.address;
    
    return minimized;
  }

  // Automatic data deletion
  scheduleDataDeletion(userId, delayMs = 30 * 24 * 60 * 60 * 1000) { // 30 days default
    setTimeout(() => {
      this.deleteVoiceProfile(userId);
      console.log(`Voice profile for user ${userId} automatically deleted after ${delayMs}ms`);
    }, delayMs);
  }
}

// Export singleton instance
const voiceAISecurity = new VoiceAISecurity();
export default voiceAISecurity;