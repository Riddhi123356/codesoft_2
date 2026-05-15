# 🎯 QuizForge — Full Stack Quiz Platform

A full-featured quiz platform built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
quiz-maker/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── server.js
│   └── .env.example
└── frontend/         # React app
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── utils/
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v16+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on **http://localhost:5000**

#### `.env` variables:
| Variable     | Description                        |
|--------------|------------------------------------|
| PORT         | Server port (default 5000)         |
| MONGO_URI    | MongoDB connection string          |
| JWT_SECRET   | Secret key for JWT signing         |
| JWT_EXPIRE   | Token expiry (default 7d)          |

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

> The frontend proxies `/api` requests to `http://localhost:5000` via the `"proxy"` field in `package.json`.

---

## 🌐 Features

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| 🏠 Home Page         | Hero section, stats, featured quizzes, feature overview  |
| 📋 Quiz Listing      | Browse, filter by category/difficulty, search            |
| ✏️ Quiz Creation     | Multi-question builder with collapsible cards            |
| ✏️ Quiz Editing      | Full edit support for your own quizzes                   |
| 🎯 Quiz Taking       | One question at a time, timer support, dot navigation    |
| 📊 Results           | Score, grade, per-question review, leaderboard           |
| 📁 My Quizzes        | Dashboard to manage your created quizzes                 |
| 👤 User Profile      | Stats, attempt history                                   |
| 🔐 Authentication    | Register, login, JWT-based protected routes              |
| 📱 Responsive        | Mobile-first design, works on all screen sizes           |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/register   | Register new user  |
| POST   | /api/auth/login      | Login              |
| GET    | /api/auth/me         | Get current user   |

### Quizzes
| Method | Endpoint               | Auth     | Description              |
|--------|------------------------|----------|--------------------------|
| GET    | /api/quizzes           | Optional | List all public quizzes  |
| GET    | /api/quizzes/my        | Required | Get my quizzes           |
| GET    | /api/quizzes/:id       | Optional | Get quiz (no answers)    |
| GET    | /api/quizzes/:id/full  | Required | Get quiz with answers    |
| POST   | /api/quizzes           | Required | Create quiz              |
| PUT    | /api/quizzes/:id       | Required | Update quiz              |
| DELETE | /api/quizzes/:id       | Required | Delete quiz              |

### Attempts
| Method | Endpoint               | Auth     | Description              |
|--------|------------------------|----------|--------------------------|
| POST   | /api/attempts          | Optional | Submit quiz attempt      |
| GET    | /api/attempts/quiz/:id | Public   | Leaderboard for a quiz   |
| GET    | /api/attempts/my       | Required | My attempt history       |

---

## 🛠 Tech Stack

**Frontend:** React 18, React Router v6, Axios, React Hot Toast, React Icons

**Backend:** Node.js, Express.js, Mongoose, JWT, Bcrypt.js

**Database:** MongoDB

---

## 📦 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve static files from Express (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/build')));
# app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```
