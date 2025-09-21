import React, { useRef, useEffect, useState } from 'react';

class AdvancedVoiceProcessor {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.voiceSettings = {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      voice: null
    };
    this.learningData = {
      successfulRecognitions: 0,
      failedRecognitions: 0,
      userPreferences: {},
      commonPhrases: new Map()
    };
    this.init();
  }

  init() {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('Voice recognition started');
      };

      this.recognition.onresult = (event) => {
        this.handleRecognitionResult(event);
      };

      this.recognition.onerror = (event) => {
        this.handleRecognitionError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('Voice recognition ended');
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
    }
  }

  loadVoices() {
    if (this.synthesis) {
      const voices = this.synthesis.getVoices();
      // Prefer female voices for better user experience
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Woman') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen')
      );
      this.voiceSettings.voice = femaleVoice || voices[0];
    }
  }

  handleRecognitionResult(event) {
    const results = event.results;
    const transcript = results[0][0].transcript;
    const confidence = results[0][0].confidence;

    // Learn from successful recognition
    this.learningData.successfulRecognitions++;
    
    // Store common phrases for learning
    const words = transcript.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3) { // Only store meaningful words
        this.learningData.commonPhrases.set(
          word, 
          (this.learningData.commonPhrases.get(word) || 0) + 1
        );
      }
    });

    // Adjust recognition sensitivity based on confidence
    if (confidence < 0.7) {
      this.adjustRecognitionSensitivity();
    }

    return { transcript, confidence };
  }

  handleRecognitionError(event) {
    this.learningData.failedRecognitions++;
    console.error('Recognition error:', event.error);
    
    // Learn from errors and adjust settings
    switch(event.error) {
      case 'no-speech':
        this.voiceSettings.rate = Math.max(0.7, this.voiceSettings.rate - 0.1);
        break;
      case 'audio-capture':
        console.log('Microphone not available');
        break;
      case 'not-allowed':
        console.log('Microphone permission denied');
        break;
    }
  }

  adjustRecognitionSensitivity() {
    // Adjust recognition settings based on learning data
    const successRate = this.learningData.successfulRecognitions / 
      (this.learningData.successfulRecognitions + this.learningData.failedRecognitions);
    
    if (successRate < 0.5) {
      // Lower sensitivity for better accuracy
      this.recognition.maxAlternatives = 1;
    } else {
      // Higher sensitivity for more options
      this.recognition.maxAlternatives = 3;
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        return true;
      } catch (error) {
        console.error('Failed to start recognition:', error);
        return false;
      }
    }
    return false;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text, emotion = 'neutral') {
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.rate = this.voiceSettings.rate;
    utterance.pitch = this.voiceSettings.pitch;
    utterance.volume = this.voiceSettings.volume;
    utterance.voice = this.voiceSettings.voice;

    // Adjust voice based on emotion
    switch(emotion) {
      case 'positive':
        utterance.rate = Math.min(1.2, this.voiceSettings.rate + 0.2);
        utterance.pitch = Math.min(1.3, this.voiceSettings.pitch + 0.3);
        utterance.volume = Math.min(1.0, this.voiceSettings.volume + 0.1);
        break;
      case 'negative':
        utterance.rate = Math.max(0.6, this.voiceSettings.rate - 0.2);
        utterance.pitch = Math.max(0.7, this.voiceSettings.pitch - 0.2);
        utterance.volume = Math.max(0.6, this.voiceSettings.volume - 0.1);
        break;
      case 'excited':
        utterance.rate = Math.min(1.3, this.voiceSettings.rate + 0.3);
        utterance.pitch = Math.min(1.4, this.voiceSettings.pitch + 0.4);
        break;
    }

    // Add natural pauses for better speech
    utterance.text = this.addNaturalPauses(text);

    return new Promise((resolve, reject) => {
      utterance.onend = resolve;
      utterance.onerror = reject;
      this.synthesis.speak(utterance);
    });
  }

  addNaturalPauses(text) {
    // Add natural pauses after punctuation
    return text
      .replace(/\./g, '. ')
      .replace(/\?/g, '? ')
      .replace(/!/g, '! ')
      .replace(/,/g, ', ')
      .replace(/;/g, '; ');
  }

  getLearningStats() {
    return {
      successRate: this.learningData.successfulRecognitions / 
        (this.learningData.successfulRecognitions + this.learningData.failedRecognitions) || 0,
      totalInteractions: this.learningData.successfulRecognitions + this.learningData.failedRecognitions,
      commonPhrases: Array.from(this.learningData.commonPhrases.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  }

  updateUserPreferences(preferences) {
    this.learningData.userPreferences = { ...this.learningData.userPreferences, ...preferences };
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }
}

export default AdvancedVoiceProcessor;
