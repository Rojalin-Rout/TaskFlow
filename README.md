# TaskFlow — Task Management Web Application

A full-stack task management application built for Full-Stack Developer Practical Assessment.

## Features
- Dashboard metrics: total, pending, in progress, completed
- Create, view, edit, and delete tasks
- Search by task title or description
- Filter by status and priority
- Sort by due date / newest
- Responsive UI with task details modal
- MySQL persistence through phpMyAdmin
- Express REST API with validation and consistent errors
- Loading, empty, success, and error states

## Tech stack
- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express
- Database: MySQL
- DB management: phpMyAdmin
- API: REST / JSON

## Project structure
```
task-management-app/
├── frontend/              # React/Vite UI
├── backend/               # Express REST API
├── database/
│   └── schema.sql         # DB schema + sample data
├── docs/
│   ├── PROJECT_DOCUMENTATION.md
│   └── API.md
├── .gitignore
└── README.md
```

## Requirements
Install:
- Node.js 18+ (20+ recommended)
- npm
- MySQL (XAMPP)
- phpMyAdmin (optional but recommended for visual DB management)

## Run locally

### 1. Create the database
Start MySQL from XAMPP, open phpMyAdmin, and:
1. Select **Import**.
2. Choose `database/schema.sql`.
3. Click **Go**.

The SQL file creates the `taskflow_db` database and `tasks` table, and inserts a few demo tasks. If you prefer, create the database and run the SQL manually in the phpMyAdmin SQL tab.

### 2. Configure the backend
Open a terminal in `backend`:
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and update your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow_db
```
Start backend:
```bash
npm run dev
```
API health check: `http://localhost:5000/api/health`

### 3. Configure and run frontend
Open a second terminal:
```bash
cd frontend
npm install
```
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Run:
```bash
npm run dev
```
Open the Vite URL shown in terminal (usually `http://localhost:5173`).

## Common troubleshooting
- **ECONNREFUSED / API not reachable:** make sure MySQL and the backend are running.
- **Access denied for MySQL user:** check `DB_USER` and `DB_PASSWORD` in `backend/.env`.
- **Unknown database:** import `database/schema.sql` again or create `taskflow_db`.
- **Port in use:** change backend `PORT`, then update `VITE_API_URL`.
- **Frontend cannot reach API:** verify backend is running and `VITE_API_URL` is correct.

## API
See [`docs/API.md`](docs/API.md) for endpoint details and examples.

## Assessment mapping
- Planning and architecture: [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md)
- Frontend screens: dashboard, task list, task form, details modal
- Backend: REST CRUD, search/filter, validation, status codes
- Database: MySQL schema with timestamps
- Quality: frontend/backend validation and user feedback
- Testing: manual test checklist in project documentation

## GitHub upload
```bash
git init
git add .
git commit -m "Initial TaskFlow task management app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow-app.git
git push -u origin main
```
