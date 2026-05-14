# 🤖 AI Interview Bot

A full-stack AI interview practice platform where users can simulate technical interviews, get AI-generated follow-up questions, receive instant feedback, track performance, and analyze resumes.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-green)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-purple)

---

## 🌐 Live Demo

| Service | URL |
|--------|-----|
| 🎨 Frontend | [astra-ai00.vercel.app](https://astra-ai00.vercel.app/) |
| ⚙️ Backend API | [ai-interview-bot-wmkk.onrender.com](https://ai-interview-bot-wmkk.onrender.com) |

---

## ✨ Latest Features

- 🔐 **Authentication flow** (Signup/Login) with BCrypt password hashing
- 🧭 **Protected routes** for dashboard, interviews, history, analytics, resume, and settings
- 🎯 **Role-based interview practice** (Q/A + MCQ formats)
- 🧠 **AI-generated questions and feedback** powered by Groq
- 📄 **Resume upload + AI analysis** (skills, experience summary, suggested topics)
- 📊 **Analytics page** with performance metrics and role breakdown
- 🧾 **Interview history management** (view and delete by user)
- 👤 **User profile API + per-user bio** (saved and loaded from backend)
- 🌙 **Modern responsive UI** with dark theme support (Tailwind + Framer Motion)

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM 7
- Axios
- Tailwind CSS
- Framer Motion

### Backend

- Java 17
- Spring Boot 3.4.1
- Spring Web
- Spring Data JPA
- Spring Security (currently permissive config)
- MySQL Connector/J
- Lombok
- Apache PDFBox
- Groq API (LLaMA 3.3 model via OpenAI-compatible endpoint)

### Infra / Deployment

- MySQL (Aiven or local)
- Render (backend)
- Vercel (frontend)

---

## 📁 Project Structure (Updated)

```text
Ai-Interview-Bot/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiService.js
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── interview/
│   │   │   ├── layout/
│   │   │   └── Sections/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── data/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   ├── ResumePage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── src/main/java/com/interviewbot/backend/
    │   ├── config/
    │   │   ├── SecurityConfig.java
    │   │   └── WebConfig.java
    │   ├── controller/
    │   │   ├── AuthController.java
    │   │   ├── InterviewController.java
    │   │   ├── ResumeController.java
    │   │   ├── AnalyticsController.java
    │   │   ├── UserController.java
    │   │   └── HealthController.java
    │   ├── model/
    │   │   ├── User.java
    │   │   ├── InterviewSession.java
    │   │   ├── QuestionAnswer.java
    │   │   └── ResumeAnalysis.java
    │   ├── repository/
    │   │   └── ResumeAnalysisRepository.java
    │   ├── respository/   (legacy package name in codebase)
    │   │   ├── UserRepository.java
    │   │   ├── SessionRepository.java
    │   │   └── QARepository.java
    │   └── service/
    │       ├── AuthService.java
    │       ├── GroqService.java
    │       └── InterviewService.java
    ├── run-local.ps1
    └── pom.xml
```

---

## 🚀 Getting Started

### 1) Clone Repo

```bash
git clone https://github.com/UzmaSulthana27/Ai-Interview-Bot.git
cd Ai-Interview-Bot
```

### 2) Backend Setup

#### Prerequisites

- Java 17
- Maven (or use `mvnw`)
- MySQL

#### Environment

Create `backend/src/main/resources/application-local.properties` (recommended for local):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/interview_bot
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
groq.api.key=your_groq_api_key
server.port=8080
```

Or use env vars with `application.properties`:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `GROQ_API_KEY`
- `SPRING_PROFILES_ACTIVE=local` (if using local profile)

#### Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

Windows PowerShell helper:

```powershell
cd backend
./run-local.ps1
```

### 3) Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Run frontend:

```bash
npm run dev
```

Open: `http://localhost:5173`

---

## 📡 API Endpoints (Current)

### Auth (`/api/auth`)

- `POST /signup` — signup with `{ fullName, email, password }`
- `POST /register` — legacy register with `{ name, email, password }`
- `POST /login` — login with `{ email, password }`

### Interview (`/api/interview`)

- `POST /start` — params: `jobRole`, `userId`, `difficulty`, `format`, `useResume`
- `POST /answer` — body: `{ sessionId, question, answer, format, jobRole, difficulty, ... }`
- `GET /history/{userId}` — interview history
- `DELETE /history/{sessionId}?userId=...` — delete session
- `GET /stats/{userId}` — total sessions, avg score, roles practiced

### Resume (`/api/resume`)

- `POST /upload` — multipart: `file`, `userId`
- `GET /latest/{userId}` — latest saved resume analysis JSON

### Analytics (`/api/analytics`)

- `GET /performance/{userId}` — aggregated metrics for analytics page

### User Profile (`/api/user`)

- `GET /{userId}/profile` — get profile (fullName, email, bio)
- `PUT /{userId}/profile` — update profile (currently bio-focused)

### Utility (`/api`)

- `GET /health` — health check
- `GET /dashboard/stats` — dashboard summary
- `GET /admin/clear-db` — admin utility endpoint (use carefully)

---

## 🧠 Interview Flow

```text
User logs in
   ↓
Select role + difficulty + format (Q/A or MCQ)
   ↓
Backend creates session
   ↓
Groq generates question
   ↓
User submits answer
   ↓
Groq evaluates answer + backend stores Q&A
   ↓
Next question generated based on previous context
   ↓
History + stats + analytics updated
```

---

## 👩‍💻 Supported Roles (UI)

- Java Developer
- React Developer
- Python Developer
- Full Stack Developer
- Frontend Developer
- Backend Developer
- Data Analyst
- DevOps Engineer
- Mobile Developer
- UI/UX Designer
- QA Engineer
- Data Scientist
- Cloud Architect
- Security Engineer
- Product Manager
- ML Engineer

---

## 🔐 Environment Variables

### Backend

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `GROQ_API_KEY`
- `SPRING_PROFILES_ACTIVE` (`local` / `prod`)

### Frontend

- `VITE_API_URL` (example: `http://localhost:8080/api`)

---

## 📝 Notes

- Resume extraction is strongest for **PDF** files (PDFBox).
- `.doc/.docx` are accepted by UI, but text extraction quality may vary.
- Current auth uses app-managed session state with stored token; **JWT can be added as a future upgrade**.

---

## 🔮 Roadmap Ideas

- [ ] JWT + refresh tokens
- [ ] Stronger role/difficulty adaptive question engine
- [ ] Better `.docx` parsing support (Apache POI)
- [ ] More detailed scoring rubric and charts
- [ ] Company-specific interview modes
- [ ] Voice-based interview input

---

## 👩‍💻 Author

**Uzma Sulthana**  
GitHub: [@UzmaSulthana27](https://github.com/UzmaSulthana27)

---

## 📄 License

MIT License (add a `LICENSE` file if not already present).

---

⭐ If this project helped you, consider starring the repo.
