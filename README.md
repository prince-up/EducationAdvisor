# Career Advisor Application

A full-stack application for career advising with backend (FastAPI) and frontend (Next.js).

## Docker Setup Instructions

This project is fully dockerized for easy setup and deployment. Follow these simple steps to get started:

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine
- Git for cloning the repository

### Quick Start

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development

- Both frontend and backend code are mounted as volumes, so changes will be reflected immediately
- The containers will automatically restart if they crash

### Stopping the Application

To stop the application, press `Ctrl+C` in the terminal where docker-compose is running, or run:
```
docker-compose down
```

### Rebuilding Containers

If you make changes to the Dockerfiles or need to rebuild the containers:
```
docker-compose up --build
```

## Manual Setup (Without Docker)

If you prefer to run the application without Docker:

### Backend Setup

```
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```