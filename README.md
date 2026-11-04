# 🎓 ABC Career Connect

> **Next-Generation Campus Placement & Recruitment Management System**  
> A unified, enterprise-grade platform linking ambitious students, corporate recruiters, and college placement administration for seamless career recruitment.

---

## 📌 Badges & Tech Stack

![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Python](https://img.shields.io/badge/Language-Python%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Status](https://img.shields.io/badge/System_Status-Active%20%26%20Tested-success?style=for-the-badge)

---

## 📖 Executive Summary

**ABC Career Connect** automates and streamlines institutional campus recruitment. It eliminates manual spreadsheet tracking by delivering real-time eligibility verification (CGPA, backlogs, department restrictions), automated hiring pipelines, interactive digital resumes, and instant placement analytics.

---

## 🏛️ System Architecture

```text
                           ┌──────────────────────────────┐
                           │      ABC Career Connect      │
                           │   React 18 + Vite Frontend   │
                           └──────────────┬───────────────┘
                                          │  REST APIs
                                          ▼
                           ┌──────────────────────────────┐
                           │       FastAPI Backend        │
                           │     Uvicorn ASGI Engine      │
                           └──────────────┬───────────────┘
                                          │  SQLAlchemy ORM
                                          ▼
                           ┌──────────────────────────────┐
                           │       SQLite Database        │
                           │   (Students, Drives, Apps)   │
                           └──────────────────────────────┘
```

---

## ✨ Features by Stakeholder Portal

### 1. 🎓 Student Portal (`/student`)
* **Live Dashboard**: Personalized greeting with live stats on active campus drives, eligible opportunities, submitted applications, and released offer letters.
* **Campus Drives Engine**: Explore all announced drives with interactive criteria verification (CGPA, backlogs, eligible departments) and 1-click apply.
* **4-Stage Hiring Journey Tracker**: Visual status stepper tracking:
  `1. Application Submitted` ➔ `2. Profile Shortlisted` ➔ `3. Technical & HR Interview` ➔ `4. Final Selection & Offer`.
* **Recruiter Feedback Callouts**: Instant view of recruiter notices, interview schedules, and official offer dispatch messages.
* **Executive Portfolio Dashboard**: Manage Sem 1–8 SGPA matrix, overall CGPA, backlogs counter, interactive skill tag cloud, cloud resume preview, LinkedIn, and GitHub links.

### 2. 🏢 Corporate Recruiter Portal (`/recruiter`)
* **Corporate Workspace**: Overview of active recruitment campaigns, applicant pipelines, shortlisting ratios, and total hires.
* **Job Drives Publisher**: Launch tailored recruitment drives with custom packages (CTC), criteria limits, job descriptions, and drive schedules.
* **Candidate Review Pipeline**: Evaluate student applicants with instant access to CGPA records, skill tags, and cloud resume links.
* **Stage Progression Actions**: Advance candidates seamlessly through `Shortlist`, `Interview`, `Select / Offer`, or `Reject` with optional candidate notes.
* **Company Profile**: Maintain organization details and recruiter credentials.

### 3. 🛡️ Placement Admin Portal (`/admin`)
* **Command Center**: Real-time university-wide metrics across students, corporate partners, active recruiters, job drives, and candidate applications.
* **Student Records Manager**: Search, filter, edit, delete, and bulk onboard students using Excel/CSV templates (`.xlsx`, `.csv`).
* **Corporate Partners Directory**: Manage corporate relationships and recruiter accounts.
* **Recruitment Analytics & Reports**: Live demographic reports covering:
  - Department-wise student distribution
  - Academic year distributions
  - Company-wise hiring rates
  - College-wide placement percentages
* **Audit Notification Feed**: Chronological log of student registrations, drive announcements, and offer dispatches.

---

## 🔑 Pre-Seeded Demo Credentials

The database includes ready-to-test seed accounts for all user roles:

| Portal | Role | Username / ID | Password | Key Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Placement Admin | `mukesh@gmail.com` | `mukesh@123` | Master institutional control |
| **Recruiter** | Corporate Partner | `google@gmail.com` | `google@123` | Google Campus Recruiter |
| **Recruiter** | Corporate Partner | `microsoft@gmail.com` | `microsoft@123` | Microsoft Campus Recruiter |
| **Student** | Student | `23331A05D3` | `student@123` | Vamsi Krishna (CSE, 9.2 CGPA, Placed at TCS) |
| **Student** | Student | `23331A05D4` | `student@123` | Rahul Verma (CSE, 8.4 CGPA, Interview Round) |
| **Student** | Student | `23331A05D5` | `student@123` | Mukesh Kumar (CSE, 7.8 CGPA, Under Review) |

> 💡 **Tip:** The sign-in page (`/login`) includes an **"Auto-fill Demo"** button that populates credentials with one click.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.0` or higher
- **npm** or **pnpm**

---

### Step 1: Backend Setup (FastAPI)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install required dependencies
pip install -r requirements.txt

# 3. (Optional) Initialize / re-seed the SQLite database with test data
python -m app.seed

# 4. Start the backend ASGI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

* Backend API will run at: `http://127.0.0.1:8000`
* Interactive OpenAPI Documentation: `http://127.0.0.1:8000/docs`

---

### Step 2: Frontend Setup (React + Vite)

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Vite local development server
npm run dev
```

* Web Application will be live at: `http://localhost:5173`

---

## 📁 Repository Directory Structure

```text
├── backend/
│   ├── app/
│   │   ├── models/           # SQLAlchemy DB models (Admin, Student, Recruiter, Drive, Application)
│   │   ├── routes/           # REST API Route controllers (admin, recruiter, student, bulk-upload)
│   │   ├── schemas/          # Pydantic request/response validation schemas
│   │   ├── utils/            # Bcrypt password hashing & auth helpers
│   │   ├── database.py       # SQLite engine & session management
│   │   ├── main.py           # FastAPI application root & CORS middleware
│   │   └── seed.py           # Rich database initialization script
│   ├── ABC.db                # SQLite database storage
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Corporate partner logos & brand assets
│   │   ├── components/       # Reusable UI widgets (Header, Card, Table, SearchBar, Modal, Steppers)
│   │   ├── pages/
│   │   │   ├── Admin/        # Placement admin dashboard, drives, recruiters, reports, notifications
│   │   │   ├── recruiter/    # Recruiter workspace, drive publisher, applicant reviews
│   │   │   ├── Student/      # Student portal, campus drives, hiring pipeline, portfolio editor
│   │   │   ├── Home.jsx      # High-impact landing page
│   │   │   └── Login.jsx     # Unified authentication card
│   │   ├── services/         # Axios API service clients
│   │   ├── App.jsx           # React Router route registry
│   │   └── index.css         # Design system tokens & typography
│   ├── package.json          # Node dependencies & build scripts
│   └── vite.config.js        # Vite bundler configuration
│
└── README.md                 # Project documentation
```

---

## 📡 Core API Endpoints Reference

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/admin/login` | Admin | Placement Administrator authentication |
| `GET` | `/admin/dashboard/stats` | Admin | Real-time aggregated university metrics |
| `GET` | `/admin/students` | Admin | Retrieve all registered student records |
| `GET` | `/admin/drives` | Admin / All | List all campus recruitment drives |
| `POST` | `/admin/drives` | Admin | Create or announce a new placement drive |
| `GET` | `/admin/applications` | Admin | View all student applications across companies |
| `PUT` | `/admin/applications/{id}/status` | Admin | Update candidate hiring stage |
| `GET` | `/admin/reports/placement-percentage` | Admin | Get university-wide placement rate |
| `POST` | `/student/login` | Student | Student authentication via Roll Number |
| `GET` | `/student/drives` | Student | List active drives with automated eligibility match |
| `POST` | `/student/apply` | Student | Submit verified application for a drive |
| `GET` | `/student/applications` | Student | Track ongoing application pipeline stages |
| `PUT` | `/student/profile` | Student | Update semester SGPA, skills, and resume links |
| `POST` | `/recruiter/login` | Recruiter | Corporate Recruiter authentication |
| `GET` | `/recruiter/applicants` | Recruiter | Review applicants for company's drives |
| `PUT` | `/recruiter/applicants/{id}/status`| Recruiter | Advance candidate stages (`Shortlist`/`Offer`) |

---

## 🔒 Security & Data Integrity
- **Password Protection**: Passwords are securely hashed using `bcrypt` via `passlib`.
- **CORS Protection**: Configured with FastAPI's `CORSMiddleware` to allow verified local client connections.
- **Transactional Rollbacks**: Database operations use SQLAlchemy scoped sessions with safe rollback handling.

---

## 📄 License
This project is developed for educational and institutional placement automation purposes.
#   A B C - C a r e e r - C o n n e c t  
 