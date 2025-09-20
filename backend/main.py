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
