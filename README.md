# ENTITLE: Autonomous Civic Rights Agent

ENTITLE is an AI-powered platform designed to help citizens discover and claim government schemes, benefits, and unclaimed assets they are entitled to. It features an autonomous conversational agent that collects user details and cross-references them against a database of 1,200+ schemes.

## Project Structure

This repository is a monorepo containing both the frontend and backend applications:

- **`entitle-frontend/`**: The Next.js (React) frontend application. Provides the user interface, chat experience, and dashboard.
- **`entitle-backend/`**: The Django (Python) backend API. Handles the AI agent orchestration, eligibility engine, profile management, and database operations.

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Redis
- Groq API Key (for the LLM)

### 1. Backend Setup

```bash
cd entitle-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create a .env file based on .env.example
cp .env.example .env
# Edit .env and add your GROQ_API_KEY, DATABASE_URL, and REDIS_URL

# Run migrations and start the server
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd entitle-frontend
npm install

# Create a .env.local file based on .env.example
cp .env.example .env.local
# Make sure NEXT_PUBLIC_API_URL points to your local backend (e.g., http://localhost:8000/api)

npm run dev
```

## Deployment

The application is pre-configured for deployment on **Vercel** (frontend) and **Render** (backend).

### Backend (Render)
1. Go to your Render Dashboard and create a new **Blueprint**.
2. Connect this repository. Render will read the `render.yaml` file in the root directory and automatically configure a PostgreSQL database and a Python web service.
3. In the Render dashboard for the `entitle-backend` service, manually add your `GROQ_API_KEY` to the Environment Variables.

### Frontend (Vercel)
1. Go to Vercel and create a new Project.
2. Import this repository.
3. **Important:** Set the **Root Directory** to `entitle-frontend`. Vercel will automatically detect the Next.js framework.
4. Add the following Environment Variables:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed Render backend (e.g., `https://entitle-backend.onrender.com/api`)
   - `NEXT_PUBLIC_APP_NAME`: `ENTITLE`

### Post-Deployment
After both are deployed, make sure to update the `CORS_ALLOWED_ORIGINS` environment variable on your Render backend to include your Vercel frontend URL (e.g., `https://your-frontend.vercel.app`) so the frontend can communicate with the backend API.
