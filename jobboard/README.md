# 💼 JobBoard — Full Stack Job Portal

A full-featured job board application built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🚀 Features

- **Home Page** — Hero section, category browse, featured jobs, search bar
- **Job Listings** — Filter by keyword, location, category, type, experience, work mode
- **Job Detail** — Full job info, inline application form with resume upload
- **Employer Dashboard** — Post/edit/delete jobs, view & manage applications, update status
- **Candidate Dashboard** — Track applications, saved jobs, profile & resume management
- **Authentication** — JWT-based secure login/register for employers and candidates
- **Email Notifications** — Nodemailer notifications on application submit and status change
- **File Uploads** — Resume and avatar upload via Multer
- **Mobile Responsive** — Fully responsive design

---

## 📁 Project Structure

```
jobboard/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   └── email.js
│   ├── uploads/         ← auto-created for file uploads
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   └── JobCard.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── JobsPage.js
    │   │   ├── JobDetailPage.js
    │   │   ├── LoginPage.js        ← also exports RegisterPage
    │   │   ├── RegisterPage.js
    │   │   ├── PostJobPage.js      ← also exports EditJobPage
    │   │   ├── EditJobPage.js
    │   │   ├── EmployerDashboard.js
    │   │   └── CandidateDashboard.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

### 1. Clone and Install

```bash
# Install all dependencies at once
npm run install-all
```

Or manually:
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Email (optional — use Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:3000
UPLOAD_PATH=./uploads
```

### 3. Run the Application

```bash
# Run both frontend and backend concurrently
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend (port 5000)
npm run start:backend

# Terminal 2 - Frontend (port 3000)
npm run start:frontend
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (with filters) |
| GET | `/api/jobs/featured` | Featured jobs |
| GET | `/api/jobs/categories` | Job count by category |
| GET | `/api/jobs/:id` | Job detail |
| POST | `/api/jobs` | Create job (employer) |
| PUT | `/api/jobs/:id` | Update job (employer) |
| DELETE | `/api/jobs/:id` | Delete job (employer) |
| GET | `/api/jobs/employer/my-jobs` | Employer's jobs |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply for a job |
| GET | `/api/applications/my-applications` | Candidate's applications |
| GET | `/api/applications/job/:jobId` | Job applications (employer) |
| PUT | `/api/applications/:id/status` | Update status (employer) |
| DELETE | `/api/applications/:id` | Withdraw application |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/save-job/:jobId` | Toggle save job |
| GET | `/api/users/saved-jobs` | Get saved jobs |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Axios |
| Styling | Custom CSS with CSS Variables |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Email | Nodemailer |
| Validation | express-validator |

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on your Google account
2. Go to Google Account → Security → App passwords
3. Generate a password for "Mail"
4. Use that password as `EMAIL_PASS` in `.env`

---

## 🏗️ Production Deployment

1. Build the frontend: `cd frontend && npm run build`
2. Serve the `build/` folder with Express or Nginx
3. Set `NODE_ENV=production` in backend `.env`
4. Use MongoDB Atlas for production database
5. Use environment variables for all secrets

---

## 📌 Notes

- File uploads are stored in `backend/uploads/` — use cloud storage (S3) in production
- JWT tokens expire in 7 days by default
- The proxy in `frontend/package.json` routes API calls to `localhost:5000` in development
