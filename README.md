# Acuity — AI Interview Platform

Acuity is a full-stack AI-powered interview preparation platform designed to help candidates practice and improve their performance across **technical, behavioral, HR, and system design interviews**.

The platform provides structured interview sessions, an AI-powered question generation pipeline, a searchable question bank, performance tracking, interview history, and authentication.

## Screenshots

> Replace the screenshot paths below with screenshots from the deployed application.

| Landing Page                                         | Dashboard                                           |
| ---------------------------------------------------- | --------------------------------------------------- |
| ![Acuity landing page](docs/screenshots/landing.png) | ![Acuity dashboard](docs/screenshots/dashboard.png) |

| Question Bank                                               | Interview Session                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| ![Acuity question bank](docs/screenshots/question-bank.png) | ![Acuity interview session](docs/screenshots/interview.png) |

| Interview Results                                         | Interview History                                         |
| --------------------------------------------------------- | --------------------------------------------------------- |
| ![Acuity interview results](docs/screenshots/results.png) | ![Acuity interview history](docs/screenshots/history.png) |

---

## Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Access-token refresh
* Protected application routes
* Authenticated API requests

### 🤖 AI-Powered Question Generation

Acuity uses the **Groq API** to generate interview questions dynamically.

Questions are generated based on:

* Category

  * Technical
  * Behavioral
  * HR
  * System Design
* Difficulty

  * Beginner
  * Intermediate
  * Advanced
* Topic

The generation pipeline includes:

* Topic-specific generation rules
* Difficulty-specific generation rules
* Category validation
* Difficulty validation
* Topic validation
* Exact duplicate detection
* Near-duplicate detection

Generated questions are stored in PostgreSQL and served to the frontend through the Django REST API.

### 📚 Question Bank

The Question Bank provides a centralized collection of interview questions.

Users can:

* Search questions
* Filter by category
* Filter by difficulty
* View question topics
* Browse paginated results
* Practice a selected question

Questions are dynamically fetched from the backend rather than being hardcoded in React.

### 🎯 Interview Sessions

* Create interview practice sessions
* Select interview roles and difficulty
* Practice questions from the Question Bank
* Complete interview sessions
* Submit answers for evaluation
* View session results

### 📊 Dashboard

The dashboard provides an overview of interview activity and performance, including:

* Total sessions
* Average performance
* Best performance
* Recent interview activity
* Progress information

### 📝 Interview History

Users can review previously completed interview sessions and their results.

### 📄 Resume Management

Acuity includes a dedicated resume section for managing resumes used during interview preparation.

### 📱 Responsive Interface

The application is designed to provide a consistent experience across desktop and smaller screen sizes.

---

# Architecture

```text
                         ┌─────────────────────┐
                         │    React + Vite     │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │ Django REST API     │
                         │      Backend        │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             ┌────────────┐  ┌────────────┐  ┌────────────┐
             │ PostgreSQL │  │    Groq    │  │    JWT     │
             │    Neon    │  │    API     │  │    Auth    │
             └────────────┘  └────────────┘  └────────────┘
```

## AI Question Generation Flow

```text
Groq API
   │
   ▼
Django Management Command
   │
   ▼
Generate Question
   │
   ├── Category Validation
   ├── Difficulty Validation
   ├── Topic Validation
   ├── Exact Duplicate Check
   └── Near-Duplicate Check
   │
   ▼
QuestionBankItem
   │
   ▼
Neon PostgreSQL
   │
   ▼
Django REST API
   │
   ▼
React Question Bank
```

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* TanStack React Query
* Socket.IO Client
* Lucide React

## Backend

* Python 3.11
* Django
* Django REST Framework
* Simple JWT
* Gunicorn
* uv

## Database

* PostgreSQL
* Neon

## AI

* Groq API
* `openai/gpt-oss-20b`

## Deployment

* Render — Frontend
* Render — Backend
* Neon — PostgreSQL

---

# Project Structure

```text
Acuity/
│
├── backend/
│   ├── config/
│   ├── sessions/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── generate_questions.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── ...
│   │
│   ├── manage.py
│   ├── pyproject.toml
│   └── ...
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── questions/
│   │   ├── resumes/
│   │   └── sessions/
│   │
│   ├── hooks/
│   │
│   └── ...
│
├── docs/
│   └── screenshots/
│
├── package.json
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* Python 3.11
* uv
* A Groq API key
* PostgreSQL database for local development

---

## 1. Clone the Repository

```bash
git clone https://github.com/Ujjvl-hub/Acuity.git
cd Acuity
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install Python dependencies:

```bash
uv sync
```

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your_django_secret_key
DATABASE_URL=your_postgresql_connection_string
GROQ_API_KEY=your_groq_api_key
```

Never commit real API keys, passwords, or database credentials.

Run migrations:

```bash
uv run python manage.py migrate
```

Create an admin user:

```bash
uv run python manage.py createsuperuser
```

Start the Django development server:

```bash
uv run python manage.py runserver
```

The backend will typically be available at:

```text
http://127.0.0.1:8000
```

---

## 3. Frontend Setup

Open another terminal at the project root:

```bash
cd Acuity
```

Install dependencies:

```bash
npm install
```

Create a frontend `.env` file if required:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Open the URL provided by Vite.

---

# Generate Interview Questions

Acuity includes a Django management command that uses Groq to generate questions.

Generate one question:

```bash
uv run python manage.py generate_questions
```

Generate multiple questions:

```bash
uv run python manage.py generate_questions --count 10
```

The generator automatically selects an appropriate category, difficulty, and topic.

Before saving a question, the system checks:

```text
Generated Question
       │
       ▼
Valid Category?
       │
       ▼
Valid Difficulty?
       │
       ▼
Valid Topic?
       │
       ▼
Exact Duplicate?
       │
       ▼
Near Duplicate?
       │
       ▼
Save to PostgreSQL
```

---

# Question Bank API

The Question Bank is powered by the Django REST API.

Endpoint:

```text
GET /api/sessions/questions/
```

Examples:

```text
/api/sessions/questions/?search=database
```

```text
/api/sessions/questions/?category=Technical
```

```text
/api/sessions/questions/?difficulty=Beginner
```

```text
/api/sessions/questions/?category=Technical&difficulty=Intermediate
```

The frontend consumes these API responses dynamically.

No interview questions are hardcoded inside the Question Bank UI.

---

# Authentication

Acuity uses JWT authentication through Django REST Framework Simple JWT.

Authentication flow:

```text
User Login
    │
    ▼
Access Token
    │
    ▼
Authenticated API Requests
    │
    ▼
Token Refresh
```

Protected endpoints require authentication.

---

# Application Flow

```text
Login / Register
       │
       ▼
    Dashboard
       │
       ├───────────────┐
       │               │
       ▼               ▼
Question Bank      Interview Sessions
       │               │
       ▼               ▼
   Practice         Interview
       │               │
       └───────┬───────┘
               ▼
            Results
               │
               ▼
            History
               │
               ▼
           Dashboard
```

---

# Testing

Run Django tests:

```bash
uv run python manage.py test
```

Run Django system checks:

```bash
uv run python manage.py check
```

Create a production frontend build:

```bash
npm run build
```

---

# Deployment

Acuity is deployed using:

```text
Frontend  → Render
Backend   → Render
Database  → Neon PostgreSQL
AI        → Groq API
```

Production architecture:

```text
                    Internet
                       │
                       ▼
              Render Frontend
                 React + Vite
                       │
                       │ HTTPS
                       ▼
              Render Backend
               Django REST API
                 │         │
                 │         │
                 ▼         ▼
          Neon PostgreSQL  Groq
```

Environment variables are configured separately for the deployed frontend and backend.

---

# Environment Variables

## Frontend

```env
VITE_API_BASE_URL=
```

## Backend

```env
SECRET_KEY=
DATABASE_URL=
GROQ_API_KEY=
```

Do not commit `.env` files or expose API credentials in the repository.

---

# Screenshots

To add screenshots to the README:

```text
docs/
└── screenshots/
    ├── landing.png
    ├── dashboard.png
    ├── question-bank.png
    ├── interview.png
    ├── results.png
    └── history.png
```

Capture screenshots from the deployed application and place them in this directory.

---

# Future Improvements

* Voice-based interview practice
* More advanced AI answer evaluation
* Resume-based personalized interviews
* Personalized question recommendations
* Topic-wise performance analytics
* Interview progress tracking
* Improved AI-generated feedback
* Expanded system design practice
* Real-time interview capabilities
* More detailed performance reports

---

# Contributing

Contributions, suggestions, and bug reports are welcome.

For significant changes, open an issue first to discuss the proposed change.

---

# Author

**Ujjwal Kumar**

BTech CSE

GitHub: [@Ujjvl-hub](https://github.com/Ujjvl-hub)

---

# License

No license has currently been specified for this project.

If you intend to publish Acuity as an open-source project, add an appropriate `LICENSE` file.
