# Code.Craft Agency — Full-Stack Monorepo

> Premium SaaS Agency Website | Next.js 14 + Django 5 + SQLite/PostgreSQL

---

## 🗂 Project Structure

```
.
├── frontend/   # Next.js 14 App Router (TypeScript, Tailwind CSS, Framer Motion)
└── backend/    # Django 5 + DRF (SQLite default, PostgreSQL optional, Celery/Redis optional)
```

---

## 🖥 How to Host on Localhost

This project runs as **two separate servers** — a Django API backend on port `8000` and a Next.js frontend on port `3000`. You need **two terminal windows** open at the same time.

### ✅ Prerequisites

| Tool | Min Version | Download |
|------|------------|---------|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.11+ | https://python.org |
| Git | any | https://git-scm.com |

> **PostgreSQL and Redis are optional.** The backend defaults to SQLite, so you can run everything locally with zero extra installs.

---

## 🔴 Terminal 1 — Backend (Django API)

Open a PowerShell/Command Prompt window in the project root and run:

```powershell
# Navigate to backend folder
cd "d:\CodeCraftAgency\My Webiste\backend"

# Step 1 — Create a Python virtual environment (first time only)
python -m venv venv

# Step 2 — Activate the virtual environment
.\venv\Scripts\Activate.ps1

# If you get a policy error, run this first (one-time fix):
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Step 3 — Install Python dependencies (first time only)
pip install -r requirements.txt

# Step 4 — Copy environment config (first time only)
copy .env.example .env
# No edits needed — SQLite is used by default (USE_POSTGRES=False)

# Step 5 — Apply database migrations (first time only)
python manage.py migrate

# Step 6 — (Optional) Create an admin account
python manage.py createsuperuser

# Step 7 — Start the Django development server
python manage.py runserver 8000
```

**Backend is now live at:** 🔗 http://localhost:8000

| URL | Description |
|-----|-------------|
| http://localhost:8000/api/projects/ | Portfolio projects API |
| http://localhost:8000/api/leads/ | Contact form leads API |
| http://localhost:8000/admin/ | Django admin panel |

---

## 🔵 Terminal 2 — Frontend (Next.js)

Open a **second** PowerShell/Command Prompt window:

```powershell
# Navigate to frontend folder
c

# Step 1 — Install Node.js dependencies (first time only)
npm install

# Step 2 — Copy environment config (first time only)
copy .env.local.example .env.local
# NEXT_PUBLIC_API_URL is already set to http://localhost:8000/api

# Step 3 — Start the Next.js development server
npm run dev
```

**Frontend is now live at:** 🔗 http://localhost:3000


## ▶ Quick Start (After First Setup)

Once you've done the initial setup, launching the site every time is just:

**Terminal 1 — Backend:**
```powershell
cd "d:\CodeCraftAgency\My Webiste\backend"
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

**Terminal 2 — Frontend:**
```powershell
cd "d:\CodeCraftAgency\My Webiste\frontend"
npm run dev
```

Then open **http://localhost:3000** in your browser. ✅

---

## 🗄 Database Options

### Default: SQLite (Zero Setup)

The backend uses **SQLite** by default — no database install required. Your data is stored in `backend/db.sqlite3`.

```env
# backend/.env
USE_POSTGRES=False   ← default, uses SQLite
```

### Optional: PostgreSQL

If you want to switch to PostgreSQL:

1. Install [PostgreSQL 15+](https://www.postgresql.org/download/)
2. Create a database:
   ```sql
   CREATE DATABASE codecraft_db;
   ```
3. Update `backend/.env`:
   ```env
   USE_POSTGRES=True
   DB_NAME=codecraft_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
4. Re-run migrations:
   ```powershell
   python manage.py migrate
   ```

---

## 🤖 Celery Background Tasks (Optional)

Only needed for async task processing. Requires Redis:

```powershell
# Start Redis via Docker (easiest on Windows)
docker run -d -p 6379:6379 redis:alpine

# Then start Celery worker (in a third terminal)
cd "d:\CodeCraftAgency\My Webiste\backend"
.\venv\Scripts\Activate.ps1
celery -A core worker --loglevel=info
```

---

## 🛠 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Activate.ps1 cannot be loaded` | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell as admin |
| `python` not found | Add Python to PATH during install or use `python3` |
| `npm: command not found` | Install Node.js from https://nodejs.org and restart terminal |
| `ModuleNotFoundError` | Make sure venv is activated (`.\venv\Scripts\Activate.ps1`) before running pip/manage.py |
| Port `3000` already in use | Run `npx kill-port 3000` or change port with `npm run dev -- -p 3001` |
| Port `8000` already in use | Run `python manage.py runserver 8001` and update `NEXT_PUBLIC_API_URL` in `.env.local` |
| CORS errors in browser | Confirm `CORS_ALLOWED_ORIGINS=http://localhost:3000` is set in `backend/.env` |
| Frontend can't reach API | Check `NEXT_PUBLIC_API_URL=http://localhost:8000/api` in `frontend/.env.local` |

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS 3, Framer Motion 11 |
| Backend | Django 5, Django REST Framework |
| Database | SQLite (default) / PostgreSQL 15 (optional) |
| Cache/Queue | Redis + Celery (optional) |
| Icons | Lucide React |

---

## 📁 Environment Files Reference

| File | Purpose |
|------|---------|
| `backend/.env.example` | Template — copy to `.env` |
| `backend/.env` | Active backend config (SECRET_KEY, DB settings, CORS) |
| `frontend/.env.local.example` | Template — copy to `.env.local` |
| `frontend/.env.local` | Active frontend config (API URL) |
