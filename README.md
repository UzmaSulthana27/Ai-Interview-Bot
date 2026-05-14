# 🟢 Astra AI: The Terminal Interviewer

> **Status:** ACTIVE_NODE  
> **Uptime:** 99.9%  
> **Current Version:** 2.1.0-STABLE  
> **Primary Objective:** Master technical interviews through high-fidelity AI simulations.

---

## ⚡ System Overview

**Astra AI** is a state-of-the-art technical interview simulation platform. Built with a **Hacker/Terminal aesthetic**, it leverages advanced LLMs to provide realistic, role-specific interview experiences. From resume analysis to performance tracking, Astra AI is your ultimate command center for career growth.

![Astra AI Banner](https://img.shields.io/badge/AESTHETIC-HACKER--TERMINAL-00ffa3?style=for-the-badge&logo=probot&logoColor=000000)
![Groq](https://img.shields.io/badge/AI--ENGINE-GROQ--LLAMA3.3-00ffa3?style=for-the-badge)
![Tech](https://img.shields.io/badge/STACK-SPRING--BOOT--%26--REACT-00ffa3?style=for-the-badge)

---

## 🛰️ Core Modules

### 1. 🧠 AI_AGENT_CORE (Mock Interviews)
*   **Role-Specific Simulations**: 16+ professional paths including Java, MERN, and System Design.
*   **Adaptive Questioning**: AI adjusts follow-up questions based on your previous responses.
*   **Dual Formats**: Choose between standard **Q/A Text** or rapid-fire **Multiple Choice (MCQ)**.
*   **Terminal Interface**: Real-time typing animations and an immersive console UI.

### 2. 📄 SEMANTIC_PARSER (Resume Analysis)
*   **Skill Extraction**: Automatically identifies technical skills from PDF/Word resumes.
*   **Experience Mapping**: Generates a summary of your professional trajectory.
*   **Topic Suggestion**: Tailors the interview pool to your specific experience.

### 3. 📊 DATA_ANALYTICS (Performance Hub)
*   **Score Tracking**: Visualize your progress over time.
*   **Skill Breakdown**: Identify strengths and weak points across different roles.
*   **History Vault**: Review past sessions and feedback to iterate on your answers.

### 4. 💎 ACCESS_MODES (Subscription System)
*   **FREE_TRIAL**: 3 full interview sessions for every new user.
*   **PREMIUM_LINK**: Unlimited sessions, advanced role selection, and deeper analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion (Animations) |
| **Backend** | Java 17, Spring Boot 3.4.1, Spring Data JPA, Hibernate |
| **Intelligence** | Groq LLaMA 3.3 (70B Model), Apache PDFBox |
| **Database** | MySQL 8.0+ |
| **Security** | BCrypt Hashing, Permissive CORS/Web Security |

---

## 🚀 Deployment Instructions

### 1) Initialize Repository
```bash
git clone https://github.com/UzmaSulthana27/Ai-Interview-Bot.git
cd Ai-Interview-Bot
```

### 2) Backend Setup (Java 17 Required)
Create `backend/src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/interview_bot
spring.datasource.username=root
spring.datasource.password=your_password
groq.api.key=your_groq_key
server.port=8080
```
Run with: `./mvnw spring-boot:run`

### 3) Frontend Setup (Node.js Required)
```bash
cd frontend
npm install
npm run dev
```

---

## 👩‍💻 Supported Job Roles

`[JAVA_DEV]` `[REACT_DEV]` `[PYTHON_DEV]` `[FULLSTACK_DEV]` `[MERN_DEV]` `[FRONTEND_DEV]` `[BACKEND_DEV]` `[DEVOPS_ENG]` `[MOBILE_DEV]` `[UIUX_DESIGN]` `[QA_ENG]` `[DATA_SCIENTIST]` `[CLOUD_ARCH]` `[SYSTEM_DESIGN]` `[SECURITY_ENG]` `[ML_ENG]`

---

## 📝 Configuration Notes
*   **Port Mapping**: Frontend defaults to `5173`, Backend to `8080`.
*   **Env Variables**: Ensure `GROQ_API_KEY` is exported for the AI Agent to function.
*   **Browsers**: Optimized for Chromium-based browsers for best animation performance.

---

## 👩‍💻 Author
**Uzma Sulthana**  
GitHub: [@UzmaSulthana27](https://github.com/UzmaSulthana27)

---

⭐ **Star this repo if you survived the interview.**
