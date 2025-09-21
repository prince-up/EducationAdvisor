import re
import json
import random
import math
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from collections import defaultdict, deque
import logging

logger = logging.getLogger(__name__)

class AdvancedChatbot:
    def __init__(self):
        self.conversation_memory = defaultdict(lambda: deque(maxlen=10))  # Store last 10 conversations per user
        self.user_preferences = defaultdict(dict)
        self.learning_data = defaultdict(list)
        self.emotion_keywords = {
            'positive': ['happy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'like'],
            'negative': ['sad', 'worried', 'confused', 'frustrated', 'angry', 'disappointed', 'hate', 'difficult'],
            'neutral': ['okay', 'fine', 'alright', 'normal', 'regular', 'standard']
        }
        
        # Advanced intent patterns with confidence weights
        self.intent_patterns = {
            'greeting': {
                'patterns': [
                    r'\b(hello|hi|hey|good morning|good afternoon|good evening)\b',
                    r'\b(how are you|how do you do)\b',
                    r'\b(nice to meet you|pleased to meet you)\b'
                ],
                'weight': 0.9,
                'responses': [
                    "Hello! I'm your advanced AI assistant. How can I help you today?",
                    "Hi there! I'm here to assist you with career guidance and educational planning.",
                    "Welcome! I can help you with colleges, scholarships, and career advice."
                ]
            },
            'colleges': {
                'patterns': [
                    r'\b(college|university|institution|admission|courses|degree)\b',
                    r'\b(engineering|medical|arts|commerce|science)\b',
                    r'\b(jammu|srinagar|kashmir|district)\b',
                    r'\b(undergraduate|postgraduate|bachelor|master)\b'
                ],
                'weight': 0.8,
                'responses': [
                    "I can help you find the perfect college! What field of study interests you?",
                    "Let me assist you with college information. Are you looking for specific courses or locations?",
                    "I have detailed information about colleges across J&K. What would you like to know?"
                ]
            },
            'scholarships': {
                'patterns': [
                    r'\b(scholarship|financial aid|funding|grant|money|tuition)\b',
                    r'\b(merit|need-based|government|private)\b',
                    r'\b(afford|expensive|cost|fee)\b'
                ],
                'weight': 0.8,
                'responses': [
                    "I can help you find scholarships! What's your current education level?",
                    "Let me search for funding opportunities. Are you looking for merit-based or need-based scholarships?",
                    "I have information about various scholarship programs. What field of study are you pursuing?"
                ]
            },
            'career_guidance': {
                'patterns': [
                    r'\b(career|job|profession|future|what should i do)\b',
                    r'\b(aptitude|quiz|test|guidance|counseling)\b',
                    r'\b(confused|unsure|don\'t know|help me decide)\b'
                ],
                'weight': 0.8,
                'responses': [
                    "I can help you discover your career path! Let's start with your interests and strengths.",
                    "Career planning is exciting! What subjects or activities do you enjoy most?",
                    "I'll help you find the perfect career match. Are you ready to take our aptitude test?"
                ]
            },
            'emotional_support': {
                'patterns': [
                    r'\b(stressed|anxious|worried|nervous|scared)\b',
                    r'\b(difficult|hard|challenging|struggling)\b',
                    r'\b(help|support|advice|guidance)\b'
                ],
                'weight': 0.7,
                'responses': [
                    "I understand this can be overwhelming. You're not alone - I'm here to help you through this.",
                    "It's completely normal to feel this way. Let's take it one step at a time.",
                    "I'm here to support you. What specific aspect would you like help with?"
                ]
            }
        }
        
        # Context-aware response templates
        self.context_responses = {
            'follow_up': {
                'colleges': "Based on our previous discussion about colleges, would you like to know about admission requirements or specific courses?",
                'scholarships': "Since we talked about scholarships, are you interested in application deadlines or eligibility criteria?",
                'career': "Following up on our career discussion, would you like to explore specific job opportunities or skill requirements?"
            },
            'clarification': "I want to make sure I understand correctly. Are you asking about {topic}?",
            'encouragement': "That's a great question! Let me help you with that.",
            'proactive': "Based on what you've told me, I think you might also be interested in {suggestion}."
        }

    def detect_emotion(self, text: str) -> str:
        """Detect user's emotional state from text"""
        text_lower = text.lower()
        emotion_scores = {}
        
        for emotion, keywords in self.emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            emotion_scores[emotion] = score
        
        if not emotion_scores or max(emotion_scores.values()) == 0:
            return 'neutral'
        
        return max(emotion_scores, key=emotion_scores.get)

    def calculate_intent_confidence(self, text: str, intent: str) -> float:
        """Calculate confidence score for intent detection"""
        patterns = self.intent_patterns[intent]['patterns']
        text_lower = text.lower()
        
        matches = 0
        total_patterns = len(patterns)
        
        for pattern in patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                matches += 1
        
        base_confidence = matches / total_patterns
        weight = self.intent_patterns[intent]['weight']
        
        # Boost confidence for multiple matches
        if matches > 1:
            base_confidence *= 1.2
        
        return min(base_confidence * weight, 1.0)

    def detect_intent_advanced(self, text: str, user_id: str = "default") -> Tuple[str, float]:
        """Advanced intent detection with context awareness"""
        text_lower = text.lower()
        
        # Get conversation history for context
        recent_messages = list(self.conversation_memory[user_id])
        
        # Calculate confidence for each intent
        intent_scores = {}
        for intent, data in self.intent_patterns.items():
            confidence = self.calculate_intent_confidence(text, intent)
            
            # Boost confidence based on conversation context
            if recent_messages:
                last_intent = self._extract_intent_from_history(recent_messages[-1])
                if intent == last_intent:
                    confidence *= 1.3  # Context boost
            
            intent_scores[intent] = confidence
        
        # Find best intent
        best_intent = max(intent_scores, key=intent_scores.get)
        best_confidence = intent_scores[best_intent]
        
        # If confidence is too low, try to infer from context
        if best_confidence < 0.3 and recent_messages:
            context_intent = self._infer_from_context(text, recent_messages)
            if context_intent:
                return context_intent, 0.6
        
        return best_intent, best_confidence

    def _extract_intent_from_history(self, message: Dict) -> Optional[str]:
        """Extract intent from conversation history"""
        if 'intent' in message:
            return message['intent']
        return None

    def _infer_from_context(self, text: str, history: List[Dict]) -> Optional[str]:
        """Infer intent from conversation context"""
        # Look for follow-up indicators
        follow_up_words = ['also', 'and', 'what about', 'how about', 'tell me more', 'more about']
        if any(word in text.lower() for word in follow_up_words):
            # Return the most recent intent
            for message in reversed(history):
                if 'intent' in message:
                    return message['intent']
        return None

    def generate_contextual_response(self, intent: str, text: str, user_id: str = "default", emotion: str = "neutral") -> str:
        """Generate response considering context and emotion"""
        recent_messages = list(self.conversation_memory[user_id])
        
        # Get base response
        base_responses = self.intent_patterns[intent]['responses']
        response = random.choice(base_responses)
        
        # Add emotional tone
        if emotion == 'negative':
            response = f"I understand this might be challenging. {response}"
        elif emotion == 'positive':
            response = f"That's exciting! {response}"
        
        # Add context awareness
        if recent_messages:
            last_intent = self._extract_intent_from_history(recent_messages[-1])
            if last_intent == intent:
                # This is a follow-up question
                follow_up = self.context_responses['follow_up'].get(intent, "")
                if follow_up:
                    response += f" {follow_up}"
        
        # Add proactive suggestions
        if intent in ['colleges', 'scholarships', 'career_guidance']:
            suggestion = self._get_proactive_suggestion(intent, recent_messages)
            if suggestion:
                response += f" {self.context_responses['proactive'].format(suggestion=suggestion)}"
        
        return response

    def _get_proactive_suggestion(self, intent: str, history: List[Dict]) -> Optional[str]:
        """Get proactive suggestions based on conversation history"""
        suggestions = {
            'colleges': 'scholarship opportunities for your chosen field',
            'scholarships': 'career guidance to help you plan your future',
            'career_guidance': 'specific colleges that offer programs in your area of interest'
        }
        return suggestions.get(intent)

    def learn_from_interaction(self, user_id: str, user_message: str, bot_response: str, intent: str, confidence: float):
        """Learn from user interactions to improve responses"""
        interaction = {
            'timestamp': datetime.now(),
            'user_message': user_message,
            'bot_response': bot_response,
            'intent': intent,
            'confidence': confidence
        }
        
        self.learning_data[user_id].append(interaction)
        
        # Keep only last 50 interactions per user
        if len(self.learning_data[user_id]) > 50:
            self.learning_data[user_id] = self.learning_data[user_id][-50:]

    def get_personalized_response(self, user_id: str, text: str) -> Dict:
        """Get personalized response based on user history and preferences"""
        # Detect emotion
        emotion = self.detect_emotion(text)
        
        # Detect intent with advanced processing
        intent, confidence = self.detect_intent_advanced(text, user_id)
        
        # Generate contextual response
        response = self.generate_contextual_response(intent, text, user_id, emotion)
        
        # Store in conversation memory
        conversation_entry = {
            'timestamp': datetime.now(),
            'user_message': text,
            'intent': intent,
            'confidence': confidence,
            'emotion': emotion
        }
        self.conversation_memory[user_id].append(conversation_entry)
        
        # Learn from this interaction
        self.learn_from_interaction(user_id, text, response, intent, confidence)
        
        return {
            'response': response,
            'intent': intent,
            'confidence': confidence,
            'emotion': emotion,
            'context_aware': len(self.conversation_memory[user_id]) > 1
        }

    def get_user_insights(self, user_id: str) -> Dict:
        """Get insights about user's interests and preferences"""
        if user_id not in self.learning_data:
            return {"message": "No data available yet"}
        
        interactions = self.learning_data[user_id]
        
        # Analyze interests
        intent_counts = defaultdict(int)
        for interaction in interactions:
            intent_counts[interaction['intent']] += 1
        
        # Get most common interests
        top_interests = sorted(intent_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return {
            'total_interactions': len(interactions),
            'top_interests': top_interests,
            'recent_emotions': [i['emotion'] for i in interactions[-5:]],
            'conversation_length': len(self.conversation_memory[user_id])
        }

# Global instance
advanced_chatbot = AdvancedChatbot()
