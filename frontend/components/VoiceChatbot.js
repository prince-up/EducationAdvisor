import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from './VoiceChatbot.module.css';
import AdvancedVoiceProcessor from './VoiceProcessor';

const VoiceChatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you find information about colleges, scholarships, career guidance, and more. You can type or speak to me!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [suggestions, setSuggestions] = useState([]);
  const [emotion, setEmotion] = useState('neutral');
  const [contextAware, setContextAware] = useState(false);
  const [voiceStats, setVoiceStats] = useState(null);
  
  const messagesEndRef = useRef(null);
  const voiceProcessor = useRef(null);

  // Initialize advanced voice processor
  useEffect(() => {
    voiceProcessor.current = new AdvancedVoiceProcessor();
    
    if (voiceProcessor.current.isSupported()) {
      setSpeechSupported(true);
      setRecognitionSupported(true);
      
      // Set up voice recognition result handling
      if (voiceProcessor.current.recognition) {
        voiceProcessor.current.recognition.onresult = (event) => {
          const result = voiceProcessor.current.handleRecognitionResult(event);
          if (result && result.transcript) {
            setInputText(result.transcript);
            setIsListening(false);
            handleSendMessage(result.transcript);
          }
        };

        voiceProcessor.current.recognition.onerror = (event) => {
          voiceProcessor.current.handleRecognitionError(event);
          setIsListening(false);
          addMessage("Sorry, I couldn't understand that. Please try again.", true);
        };

        voiceProcessor.current.recognition.onend = () => {
          setIsListening(false);
        };
      }
      
      // Update voice stats periodically
      const updateStats = () => {
        setVoiceStats(voiceProcessor.current.getLearningStats());
      };
      
      const interval = setInterval(updateStats, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text, isBot = false) => {
    const newMessage = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const speakText = async (text) => {
    if (!speechSupported || isSpeaking || !voiceProcessor.current) return;

    setIsSpeaking(true);
    try {
      await voiceProcessor.current.speak(text, 'neutral');
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const speakTextWithEmotion = async (text, emotion) => {
    if (!speechSupported || isSpeaking || !voiceProcessor.current) return;

    setIsSpeaking(true);
    try {
      await voiceProcessor.current.speak(text, emotion);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!recognitionSupported || isListening || !voiceProcessor.current) return;
    
    setIsListening(true);
    const success = voiceProcessor.current.startListening();
    
    if (!success) {
      setIsListening(false);
      addMessage("Sorry, I couldn't start listening. Please check your microphone permissions.", true);
    }
  };

  const stopListening = () => {
    if (isListening && voiceProcessor.current) {
      voiceProcessor.current.stopListening();
      setIsListening(false);
    }
  };

  const handleSendMessage = async (message = inputText) => {
    if (!message.trim()) return;

    const userMessage = addMessage(message, false);
    setInputText('');
    setIsLoading(true);

    try {
      // Call advanced chatbot API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_history: messages.slice(-5), // Send last 5 messages for context
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMessage = addMessage(data.response, true);
      
      // Update advanced features
      setSuggestions(data.suggestions || []);
      setEmotion(data.emotion || 'neutral');
      setContextAware(data.context_aware || false);
      
      // Speak the bot response with emotion-based voice
      setTimeout(() => speakTextWithEmotion(data.response, data.emotion), 500);
      
    } catch (error) {
      console.error('Advanced chatbot error:', error);
      const errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      addMessage(errorMessage, true);
      setTimeout(() => speakText(errorMessage), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={styles.voiceChatbotContainer}>
        {!isOpen && (
          <Button
            variant="primary"
            className={styles.chatToggleBtn}
            onClick={toggleChat}
            size="lg"
          >
            <i className="bi bi-chat-dots me-2"></i>
            AI Assistant
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className={styles.chatWindow}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">
                  <i className="bi bi-robot me-2"></i>
                  AI Assistant
                </h6>
                <small className="text-muted">Voice & Text Support</small>
              </div>
              <div className="d-flex align-items-center">
                {recognitionSupported && (
                  <Badge bg={isListening ? "danger" : "success"} className="me-2">
                    <i className="bi bi-mic-fill"></i>
                  </Badge>
                )}
                {speechSupported && (
                  <Badge bg={isSpeaking ? "warning" : "info"}>
                    <i className="bi bi-volume-up-fill"></i>
                  </Badge>
                )}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={toggleChat}
                  className="ms-2"
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              </div>
            </Card.Header>

            <Card.Body className={styles.chatMessages}>
              <div className={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
                  >
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>{message.text}</div>
                      <div className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.message} ${styles.botMessage}`}>
                    <div className={styles.messageContent}>
                      <div className={`${styles.messageText} d-flex align-items-center`}>
                        <Spinner size="sm" className="me-2" />
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card.Body>

            <Card.Footer>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">💡 Quick suggestions:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setInputText(suggestion);
                          handleSendMessage(suggestion);
                        }}
                        className="me-1 mb-1"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type your question or click mic to speak..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isListening || isLoading}
                />
                {recognitionSupported && (
                  <Button
                    variant={isListening ? "danger" : "outline-primary"}
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                  >
                    <i className={`bi ${isListening ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading || isListening}
                >
                  <i className="bi bi-send"></i>
                </Button>
              </InputGroup>
              
              {/* Advanced indicators */}
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    💡 Try asking: "Tell me about colleges in Jammu" or "What scholarships are available?"
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {emotion !== 'neutral' && (
                    <Badge bg={emotion === 'positive' ? 'success' : emotion === 'negative' ? 'warning' : 'info'}>
                      {emotion === 'positive' ? '😊' : emotion === 'negative' ? '😔' : '😐'} {emotion}
                    </Badge>
                  )}
                  {contextAware && (
                    <Badge bg="info">
                      <i className="bi bi-brain me-1"></i>Context Aware
                    </Badge>
                  )}
                  {voiceStats && voiceStats.successRate > 0 && (
                    <Badge bg="secondary">
                      <i className="bi bi-graph-up me-1"></i>
                      {Math.round(voiceStats.successRate * 100)}% Voice
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
        )}
      </div>
    </>
  );
};

export default VoiceChatbot;
