import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import database as db
from main import app
from config import settings

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        database = TestingSessionLocal()
        yield database
    finally:
        database.close()

app.dependency_overrides[db.get_db] = override_get_db

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

def test_get_colleges():
    response = client.get("/api/colleges/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_login_invalid_credentials():
    response = client.post(
        "/api/token",
        data={"username": "invalid", "password": "invalid"}
    )
    assert response.status_code == 401

def test_register_user():
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "district": "Jammu",
        "education_level": "high_school",
        "role": "student"
    }
    response = client.post("/api/users/", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"

if __name__ == "__main__":
    pytest.main([__file__])
