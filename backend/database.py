from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Table, MetaData, Text, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime
from config import settings

# Database setup
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB setup (optional)
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    MONGODB_URL = settings.MONGODB_URL
    mongo_client = AsyncIOMotorClient(MONGODB_URL)
    mongo_db = mongo_client.career_advisor_db
except ImportError:
    # MongoDB not available, use None
    mongo_client = None
    mongo_db = None

# PostgreSQL Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    district = Column(String)
    education_level = Column(String)  # Add this field
    role = Column(String, default="student")  # Add this field
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class College(Base):
    __tablename__ = "colleges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    district = Column(String, index=True)
    address = Column(String)
    website = Column(String)
    contact = Column(String)
    description = Column(Text)
    facilities = Column(Text)
    
    courses = relationship("Course", back_populates="college")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    duration = Column(String)
    eligibility = Column(String)
    college_id = Column(Integer, ForeignKey("colleges.id"))
    
    college = relationship("College", back_populates="courses")

class Scholarship(Base):
    __tablename__ = "scholarships"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    provider = Column(String)
    eligibility = Column(Text)
    amount = Column(Float)
    deadline = Column(DateTime)
    website = Column(String)
    description = Column(Text)

class Timeline(Base):
    __tablename__ = "timelines"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    event_type = Column(String, index=True)  # admission, exam, scholarship
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    description = Column(Text)
    url = Column(String)

# Database initialization function
def init_db():
    Base.metadata.create_all(bind=engine)

# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB collections
aptitude_results_collection = mongo_db.aptitude_results
career_recommendations_collection = mongo_db.career_recommendations
user_profiles_collection = mongo_db.user_profiles
chatbot_conversations_collection = mongo_db.chatbot_conversations