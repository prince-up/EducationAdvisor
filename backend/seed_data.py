# Seed data for the application
from database import get_db, engine, Base
import database as db

def seed_database(db_session=None):
    """Initialize the database with seed data"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Add seed data if needed
    # This function will be called when the application starts
    pass

# Export the seed function
__all__ = ["seed_database"]