# Voice-Enabled AI Chatbot for Digital Career Advisor

## 🎯 Features

### ✅ Voice Recognition & Speech Synthesis
- **Voice Input**: Users can speak directly to the chatbot
- **Voice Output**: Chatbot responds with audio
- **Multi-language Support**: English and regional language support
- **Real-time Processing**: Instant voice-to-text conversion

### ✅ Intelligent Responses
- **Context-Aware**: Understands conversation context
- **Intent Detection**: Recognizes user queries about colleges, scholarships, careers
- **Knowledge Base**: Comprehensive information about J&K educational system
- **Personalized Guidance**: Tailored advice based on user needs

### ✅ User Experience
- **Floating Widget**: Always accessible on homepage
- **Modern UI**: Beautiful, responsive chat interface
- **Mobile-Friendly**: Works on all devices
- **Accessibility**: Screen reader compatible

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Windows
setup_chatbot.bat

# Linux/Mac
chmod +x setup_chatbot.sh
./setup_chatbot.sh
```

### 2. Start the Application
```bash
# Terminal 1 - Backend
cd backend
python run.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Access the Chatbot
- Open your browser to `http://localhost:3000`
- Look for the floating "AI Assistant" button
- Click to open the chatbot
- Use voice or text to interact

## 🎤 Voice Commands

### Example Questions You Can Ask:
- **Colleges**: "Tell me about colleges in Jammu"
- **Scholarships**: "What scholarships are available for engineering students?"
- **Career**: "What career options do I have after 12th science?"
- **General**: "How does this platform help students?"

### Voice Features:
- Click the microphone icon to start speaking
- Speak clearly and wait for processing
- The chatbot will respond both in text and voice
- Use "Stop" or click mic again to stop recording

## 🧠 Knowledge Base

The chatbot understands and can help with:

### 🏫 Colleges & Universities
- University of Jammu and Kashmir
- Government Medical Colleges
- Engineering Institutes
- Admission processes and requirements

### 💰 Scholarships & Financial Aid
- Government scholarship programs
- Private funding opportunities
- Application procedures
- Eligibility criteria

### 🎯 Career Guidance
- Career aptitude testing
- Popular career paths
- Educational requirements
- Skill development

### 📚 Educational Planning
- Course selection after 10th/12th
- Higher education options
- Timeline planning
- Goal setting

## 🔧 Technical Details

### Frontend Components:
- `VoiceChatbot.js` - Main chatbot component
- `VoiceChatbot.css` - Styling and animations
- Speech recognition using Web Speech API
- Text-to-speech synthesis

### Backend API:
- `/api/chatbot` - Main chatbot endpoint
- Intent detection and response generation
- Comprehensive knowledge base integration
- Context-aware conversation handling

### Browser Compatibility:
- ✅ Chrome/Edge (Full voice support)
- ✅ Firefox (Limited voice support)
- ✅ Safari (Basic voice support)
- ✅ Mobile browsers (Text input recommended)

## 🎨 Customization

### Adding New Responses:
Edit `backend/chatbot_knowledge.py` to add more detailed responses:

```python
COMPREHENSIVE_KNOWLEDGE["new_topic"] = {
    "keywords": ["keyword1", "keyword2"],
    "responses": ["Response 1", "Response 2"]
}
```

### Styling Changes:
Modify `frontend/components/VoiceChatbot.css` for custom styling:
- Colors and themes
- Animation effects
- Layout adjustments
- Mobile responsiveness

## 🚨 Troubleshooting

### Voice Not Working:
1. Check browser permissions for microphone
2. Ensure HTTPS connection (required for voice)
3. Try refreshing the page
4. Use Chrome/Edge for best compatibility

### API Errors:
1. Verify backend is running on port 8000
2. Check CORS settings in backend
3. Ensure all dependencies are installed

### Performance Issues:
1. Clear browser cache
2. Restart both frontend and backend
3. Check network connectivity

## 📱 Mobile Usage

For mobile devices:
- Voice input may be limited
- Use text input for best experience
- Ensure stable internet connection
- Allow microphone permissions when prompted

## 🔒 Privacy & Security

- Voice data is processed locally in browser
- No voice recordings are stored
- Conversation history is temporary
- All data is encrypted in transit

---

**Made with ❤️ for Jammu & Kashmir Students**

*The voice chatbot is designed to make career guidance accessible and engaging for all students, regardless of their technical background.*
