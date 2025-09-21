from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import database as db
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import auth
from auth import get_current_user
import seed_data
from config import settings
import logging
import traceback
import re
import random
from chatbot_knowledge import get_detailed_response
from advanced_chatbot import advanced_chatbot

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for J&K students career guidance platform",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {
            "name": "auth",
            "description": "Authentication operations",
        },
        {
            "name": "users",
            "description": "User management operations",
        },
        {
            "name": "colleges",
            "description": "College information operations",
        },
        {
            "name": "scholarships",
            "description": "Scholarship information operations",
        },
        {
            "name": "quiz",
            "description": "Quiz and assessment operations",
        },
    ]
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc) if settings.DEBUG else "Something went wrong"}
    )

# Initialize database and seed data on startup
@app.on_event("startup")
def startup_db_client():
    db.Base.metadata.create_all(bind=db.engine)
    session = db.SessionLocal()
    try:
        seed_data.seed_database(session)
        logger.info("Database initialized with seed data!")
    finally:
        session.close()

# Dependency to get the database session
def get_db():
    db_session = db.SessionLocal()
    try:
        yield db_session
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        db_session.rollback()
        raise HTTPException(status_code=500, detail="Database connection error")
    finally:
        db_session.close()

# Pydantic models for API
class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    district: Optional[str] = None
    education_level: Optional[str] = None
    role: str = "student"

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    district: Optional[str] = None
    education_level: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CollegeBase(BaseModel):
    name: str
    district: str
    address: str
    website: str
    contact: str
    description: str
    facilities: str

class College(CollegeBase):
    id: int
    
    class Config:
        from_attributes = True

class ChatbotMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []
    user_id: Optional[str] = "default"

class ChatbotResponse(BaseModel):
    response: str
    intent: str
    confidence: float
    emotion: Optional[str] = "neutral"
    context_aware: Optional[bool] = False
    suggestions: Optional[List[str]] = []

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Digital Career Advisor API for J&K Students",
        "version": settings.VERSION,
        "docs": "/docs"
    }

# Authentication endpoints
@app.post("/api/token", response_model=Token, tags=["auth"])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db_session: Session = Depends(get_db)):
    try:
        user = auth.authenticate_user(db_session, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

# User endpoints
@app.post("/api/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["users"])
def create_user(user: UserCreate, db_session: Session = Depends(get_db)):
    try:
        db_user = db_session.query(db.User).filter(db.User.username == user.username).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        db_email = db_session.query(db.User).filter(db.User.email == user.email).first()
        if db_email:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = auth.get_password_hash(user.password)
        new_user = db.User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            district=user.district,
            education_level=user.education_level,
            role=user.role
        )
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User creation error: {str(e)}")
        db_session.rollback()
        raise HTTPException(status_code=500, detail="User creation failed")

@app.get("/api/users/me", response_model=UserResponse, tags=["users"])
def read_users_me(current_user: db.User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    return current_user

@app.get("/api/colleges/", response_model=List[College], tags=["colleges"])
def get_colleges(db_session: Session = Depends(get_db)):
    try:
        colleges = db_session.query(db.College).all()
        return colleges
    except Exception as e:
        logger.error(f"Colleges fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch colleges")

@app.get("/api/colleges/{college_id}", response_model=College)
def get_college(college_id: int, db_session: Session = Depends(get_db)):
    college = db_session.query(db.College).filter(db.College.id == college_id).first()
    if college is None:
        raise HTTPException(status_code=404, detail="College not found")
    return college

# Chatbot knowledge base
CHATBOT_KNOWLEDGE = {
    "greeting": [
        "Hello! I'm your AI assistant for the Digital Career Advisor platform. How can I help you today?",
        "Hi there! I'm here to help you with career guidance, college information, scholarships, and more. What would you like to know?",
        "Welcome! I can assist you with finding colleges, scholarships, career advice, and educational opportunities. What can I help you with?"
    ],
    "colleges": {
        "keywords": ["college", "university", "institution", "admission", "courses", "degree", "engineering", "medical", "arts"],
        "responses": [
            "We have information about various colleges and universities across Jammu & Kashmir. You can find details about admission processes, courses offered, facilities, and contact information. Would you like to know about colleges in a specific district?",
            "Our platform provides comprehensive information about colleges including admission requirements, course offerings, and campus facilities. What type of course or college are you interested in?",
            "I can help you find colleges based on your interests, location preferences, or career goals. What field of study interests you most?"
        ]
    },
    "scholarships": {
        "keywords": ["scholarship", "financial aid", "funding", "grant", "money", "financial assistance", "tuition"],
        "responses": [
            "We have a comprehensive database of scholarships available for J&K students. These include government scholarships, private funding, and merit-based awards. What type of scholarship are you looking for?",
            "There are many scholarship opportunities for students from Jammu & Kashmir. I can help you find scholarships based on your academic performance, financial need, or specific criteria. What's your current education level?",
            "Our scholarship database includes various funding options for different courses and levels of study. Are you looking for undergraduate, postgraduate, or research scholarships?"
        ]
    },
    "career_guidance": {
        "keywords": ["career", "job", "profession", "aptitude", "quiz", "guidance", "counseling", "future"],
        "responses": [
            "I can help you with career guidance through our comprehensive aptitude test. This will help you discover your strengths and find the perfect career match. Would you like to take the career quiz?",
            "Our career guidance system uses advanced assessment tools to help you find the right career path. The quiz covers various aspects like interests, skills, and personality traits. Ready to explore your career options?",
            "Career planning is crucial for your future success. Our platform offers personalized career recommendations based on your interests and abilities. Let's start with a career assessment!"
        ]
    },
    "general_info": {
        "keywords": ["help", "information", "about", "what", "how", "platform", "website"],
        "responses": [
            "Digital Career Advisor is a comprehensive platform designed specifically for Jammu & Kashmir students. We provide career guidance, college information, scholarship opportunities, and educational resources to help you succeed in your academic and professional journey.",
            "Our platform offers four main services: Career Aptitude Testing, College Explorer, Scholarship Finder, and Educational Timeline Planning. Each service is tailored to help J&K students make informed decisions about their future.",
            "We're here to support students from Jammu & Kashmir with all aspects of their educational journey. From choosing the right career path to finding funding opportunities, we've got you covered!"
        ]
    }
}

def detect_intent(message: str) -> tuple:
    """Detect the intent of the user's message"""
    message_lower = message.lower()
    
    # Check for greeting
    greeting_words = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
    if any(word in message_lower for word in greeting_words):
        return "greeting", 0.9
    
    # Check for college-related queries
    college_score = sum(1 for keyword in CHATBOT_KNOWLEDGE["colleges"]["keywords"] if keyword in message_lower)
    if college_score > 0:
        return "colleges", min(0.8, college_score * 0.2)
    
    # Check for scholarship-related queries
    scholarship_score = sum(1 for keyword in CHATBOT_KNOWLEDGE["scholarships"]["keywords"] if keyword in message_lower)
    if scholarship_score > 0:
        return "scholarships", min(0.8, scholarship_score * 0.2)
    
    # Check for career guidance queries
    career_score = sum(1 for keyword in CHATBOT_KNOWLEDGE["career_guidance"]["keywords"] if keyword in message_lower)
    if career_score > 0:
        return "career_guidance", min(0.8, career_score * 0.2)
    
    # Default to general info
    return "general_info", 0.5

def generate_response(intent: str, confidence: float, message: str) -> str:
    """Generate appropriate response based on intent"""
    # Try to get detailed response first
    detailed_response = get_detailed_response(intent, message)
    if detailed_response:
        return detailed_response
    
    # Fallback to basic responses
    if intent == "greeting":
        return random.choice(CHATBOT_KNOWLEDGE["greeting"])
    
    elif intent == "colleges":
        response = random.choice(CHATBOT_KNOWLEDGE["colleges"]["responses"])
        # Add specific college information if mentioned
        if any(district in message.lower() for district in ["jammu", "srinagar", "kashmir"]):
            response += " I can provide specific information about colleges in the districts you mentioned."
        return response
    
    elif intent == "scholarships":
        return random.choice(CHATBOT_KNOWLEDGE["scholarships"]["responses"])
    
    elif intent == "career_guidance":
        return random.choice(CHATBOT_KNOWLEDGE["career_guidance"]["responses"])
    
    else:
        return random.choice(CHATBOT_KNOWLEDGE["general_info"]["responses"])

@app.post("/api/chatbot", response_model=ChatbotResponse, tags=["chatbot"])
def chatbot_response(chat_message: ChatbotMessage, db_session: Session = Depends(get_db)):
    """Handle chatbot queries with advanced AI processing"""
    try:
        message = chat_message.message.strip()
        user_id = chat_message.user_id or "default"
        
        if not message:
            return ChatbotResponse(
                response="I'm here to help! Please ask me about colleges, scholarships, career guidance, or any other educational topics.",
                intent="general_info",
                confidence=0.5,
                emotion="neutral",
                context_aware=False
            )
        
        # Use advanced chatbot for processing
        result = advanced_chatbot.get_personalized_response(user_id, message)
        
        # Add suggestions based on intent
        suggestions = []
        if result['intent'] == 'colleges':
            suggestions = ["Tell me about admission requirements", "What courses are available?", "Show me colleges in my district"]
        elif result['intent'] == 'scholarships':
            suggestions = ["What are the eligibility criteria?", "When are the deadlines?", "How do I apply?"]
        elif result['intent'] == 'career_guidance':
            suggestions = ["Take the aptitude test", "What careers match my interests?", "How do I plan my future?"]
        
        logger.info(f"Advanced chatbot query: '{message}' -> Intent: {result['intent']}, Confidence: {result['confidence']}, Emotion: {result['emotion']}")
        
        return ChatbotResponse(
            response=result['response'],
            intent=result['intent'],
            confidence=result['confidence'],
            emotion=result['emotion'],
            context_aware=result['context_aware'],
            suggestions=suggestions
        )
        
    except Exception as e:
        logger.error(f"Advanced chatbot error: {str(e)}")
        return ChatbotResponse(
            response="I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
            intent="error",
            confidence=0.0,
            emotion="neutral",
            context_aware=False
        )

@app.get("/api/chatbot/insights/{user_id}", tags=["chatbot"])
def get_user_insights(user_id: str):
    """Get user interaction insights and preferences"""
    try:
        insights = advanced_chatbot.get_user_insights(user_id)
        return insights
    except Exception as e:
        logger.error(f"Insights error: {str(e)}")
        return {"error": "Unable to retrieve insights"}
