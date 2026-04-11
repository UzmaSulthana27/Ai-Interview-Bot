# 🤖 AI Interview Bot

A full-stack AI-powered interview practice platform that helps developers prepare for technical interviews with real-time AI-generated questions and intelligent feedback.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-green)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-purple)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🎨 Frontend | [ai-interview-bot-nexus.vercel.app](https://ai-interview-bot-nexus.vercel.app) |
| ⚙️ Backend API | [ai-interview-bot-wmkk.onrender.com](https://ai-interview-bot-wmkk.onrender.com) |

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

- 🔐 **User Authentication** — Secure register and login with BCrypt password encryption
- 🎯 **Job Role Selection** — Choose from 8+ technical roles
- 🤖 **AI Question Generation** — Unlimited unique questions powered by Groq LLaMA 3.3
- 📊 **AI Feedback & Scoring** — Intelligent evaluation with score out of 10
- 💻 **Terminal Style UI** — Immersive code editor inspired interview experience
- ⌨️ **Typing Animation** — Questions appear with realistic typing effect
- 📈 **Progress Tracking** — Animated progress bar per session
- 📋 **Session History** — View and manage all past interview sessions
- 🗑️ **Delete Sessions** — Remove unwanted sessions from history
- 📱 **Mobile Responsive** — Fully optimized for all screen sizes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| React Router DOM | Page navigation |
| Axios | API calls |

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 17 | Programming language |
| Spring Boot 4.0.5 | Backend framework |
| Spring Data JPA | Database ORM |
| Spring Security | Authentication |
| BCrypt | Password hashing |
| Groq API (LLaMA 3.3) | AI integration |
| Docker | Containerization |

### Database & Cloud
| Technology | Purpose |
|-----------|---------|
| MySQL 8.0 | Relational database |
| Aiven Cloud | Managed MySQL hosting |
| Render | Backend deployment |
| Vercel | Frontend deployment |
| UptimeRobot | Backend monitoring |

---

## 📁 Project Structure

```
Ai-Interview-Bot/
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProgressBar.jsx
│       │   └── TerminalBox.jsx
│       └── pages/
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── HomePage.jsx
│           ├── InterviewPage.jsx
│           └── HistoryPage.jsx
│
└── backend/
    ├── src/main/java/com/interviewbot/backend/
    │   ├── config/
    │   │   ├── CorsConfig.java
    │   │   └── SecurityConfig.java
    │   ├── controller/
    │   │   ├── AuthController.java
    │   │   ├── InterviewController.java
    │   │   └── HealthController.java
    │   ├── model/
    │   │   ├── User.java
    │   │   ├── InterviewSession.java
    │   │   └── QuestionAnswer.java
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   ├── SessionRepository.java
    │   │   └── QARepository.java
    │   └── service/
    │       ├── AuthService.java
    │       ├── GroqService.java
    │       └── InterviewService.java
    ├── Dockerfile
    └── pom.xml
```

---

## 🚀 Getting Started

### Prerequisites

- Java JDK 17
- Node.js 18+
- MySQL 8.0
- Maven
- Git

### Clone the Repository

```bash
git clone https://github.com/UzmaSulthana27/Ai-Interview-Bot.git
cd Ai-Interview-Bot
```

### Setup Database

```sql
CREATE DATABASE interviewbot;
USE interviewbot;

CREATE TABLE users (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255)        NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interview_sessions (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT       NOT NULL,
  job_role   VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20)  DEFAULT 'intermediate',
  score      DECIMAL(4,2) DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE question_answers (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id  BIGINT NOT NULL,
  question    TEXT   NOT NULL,
  user_answer TEXT,
  ai_feedback TEXT,
  score       INT    DEFAULT 0,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id)
);

CREATE TABLE bookmarks (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT       NOT NULL,
  question    TEXT         NOT NULL,
  ai_feedback TEXT,
  topic       VARCHAR(100),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Setup Backend

Create `backend/src/main/resources/application.properties`:

```properties
spring.application.name=backend
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
groq.api.key=${GROQ_API_KEY}
server.port=8080
```

Set environment variables:

| Variable | Value |
|----------|-------|
| `DB_URL` | `jdbc:mysql://localhost:3306/interviewbot` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | `your_mysql_password` |
| `GROQ_API_KEY` | `your_groq_api_key` |

Run backend:
```bash
cd backend
./mvnw spring-boot:run
```

### Setup Frontend

```bash
cd frontend
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:8080/api
```

Run frontend:
```bash
npm run dev
```

Open `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Body |
|--------|---------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{name, email, password}` |
| POST | `/api/auth/login` | Login user | `{email, password}` |

### Interview

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/interview/start` | Start session + get AI question |
| POST | `/api/interview/answer` | Submit answer + get AI feedback |
| GET | `/api/interview/history/{userId}` | Get all past sessions |
| DELETE | `/api/interview/history/{sessionId}` | Delete a session |

### Health

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/health` | Check backend status |

---

## 🗄️ Database Schema

```
users                    interview_sessions
├── id (BIGINT PK)       ├── id (BIGINT PK)
├── name                 ├── user_id (FK → users)
├── email (UNIQUE)       ├── job_role
├── password (BCrypt)    ├── difficulty
└── created_at           ├── score
                         └── started_at

question_answers          bookmarks
├── id (BIGINT PK)        ├── id (BIGINT PK)
├── session_id (FK)       ├── user_id (FK → users)
├── question              ├── question
├── user_answer           ├── ai_feedback
├── ai_feedback           ├── topic
└── score                 └── created_at
```

---

## ☁️ Deployment

### Backend — Render
1. Connect GitHub repo on [render.com](https://render.com)
2. Set Root Directory: `backend`
3. Runtime: `Docker`
4. Add environment variables

### Frontend — Vercel
1. Connect GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory: `frontend`
3. Framework: `Vite`
4. Add `VITE_API_URL` environment variable

### Database — Aiven
1. Create free MySQL on [aiven.io](https://aiven.io)
2. Run schema SQL
3. Add IP whitelist: `0.0.0.0/0`

---

## 🔐 Environment Variables

### Backend (Render)

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `AIVEN_HOST` | Aiven MySQL hostname |
| `AIVEN_PORT` | Aiven MySQL port |
| `AIVEN_USERNAME` | Database username |
| `AIVEN_PASSWORD` | Database password |
| `GROQ_API_KEY` | Groq API key |

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Render backend URL + `/api` |

---

## 🧠 How It Works

```
User opens website
      ↓
Registers / Logs in
      ↓
Selects job role
      ↓
Spring Boot calls Groq AI
      ↓
AI generates unique question
      ↓
Question appears with typing animation
      ↓
User submits answer
      ↓
AI evaluates → feedback + score
      ↓
Next question auto-generated
      ↓
All saved to Aiven MySQL
      ↓
View / delete history anytime
```

---

## 🎯 Supported Job Roles

- Java Developer
- React Developer
- Python Developer
- Full Stack Developer
- Frontend Developer
- Backend Developer
- Data Analyst
- DevOps Engineer

---

## 🔮 Future Improvements

- [ ] Difficulty levels (Beginner / Intermediate / Senior)
- [ ] No-repeat question tracking
- [ ] Performance dashboard with charts
- [ ] Resume upload for tailored questions
- [ ] Voice answer support
- [ ] Company-specific interview modes
- [ ] Leaderboard system
- [ ] JWT authentication

---

## 👩‍💻 Author

**Uzma Sulthana**
- GitHub: [@UzmaSulthana27](https://github.com/UzmaSulthana27)

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — Free and fast LLaMA 3.3 API
- [Aiven](https://aiven.io) — Free managed MySQL database
- [Render](https://render.com) — Free backend hosting
- [Vercel](https://vercel.com) — Free frontend hosting

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ If you found this helpful, please give it a star!
