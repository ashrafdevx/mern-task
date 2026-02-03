## MERN Hotel Booking – Full Stack App

This project is a full-stack MERN application with a **React + Vite** frontend and an **Express + MongoDB** backend.  
The backend can work in two modes:

- **Database mode** – uses MongoDB (Atlas or local) via `MONGODB_URI`
- **Fallback mode (no DB)** – if MongoDB is not reachable, it **automatically reads and writes data using local JSON files** in `backend/data`.

The frontend is designed to keep working even when the backend or DB are down by using safe fallback data for some sections.

---

## Project Structure

```text
mern-task/
├── backend/   # Node.js + Express REST API (MongoDB + JSON fallback)
└── frontend/  # React + Vite SPA (Booking / About pages)
```

Key folders:

- `backend/data` – local JSON storage used **when DB is not connected**
- `backend/config/db.config.js` – MongoDB connection + fallback detection
- `frontend/src/lib/api.ts` – all API calls from the frontend

---

## Prerequisites

- Node.js (LTS recommended)
- npm
- (Optional) A MongoDB instance or MongoDB Atlas URI

---

## Installation

From the repository root:

```bash
# Install backend + frontend dependencies
cd mern-task
npm install --prefix backend
npm install --prefix frontend

# OR (after the root package.json exists)
npm install
```

---

## Running frontend and backend together (concurrently)

From the repository root:

```bash
# Run both backend and frontend dev servers together
npm run dev
```

What this does:

- Starts backend dev server: `npm run dev --prefix backend` (default `http://localhost:5000`)
- Starts frontend dev server: `npm run dev --prefix frontend` (default `http://localhost:5173`)

You can also run them individually:

```bash
# Only backend (from root)
npm run dev:backend

# Only frontend (from root)
npm run dev:frontend
```

---

## Environment configuration

### Backend (`backend/.env`)

Copy `.env.example` to `.env` in the `backend` folder and adjust:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.r776p5d.mongodb.net/your-db-name
CORS_ORIGIN=http://localhost:5173
```

- When `MONGODB_URI` is **valid and reachable**, the API uses **MongoDB**.
- When `MONGODB_URI` is **missing or MongoDB is down**, the API **does NOT use the database** – it falls back to **local JSON files**.

### Frontend (`frontend/.env` or Vite env)

Set the API base URL:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:5000/api` in development.

---

## Data flow and fallback behavior

- **Normal (DB) mode**
  - Backend connects to MongoDB using `MONGODB_URI`.
  - Collections for experts, hotels, and appointments are used.
  - Responses typically include `metadata.source: "database"`.

- **Fallback (no DB) mode**
  - If MongoDB connection fails, backend logs that it is running in **fallback (JSON file) mode**.
  - All reads and writes use:
    - `backend/data/expertStaff.json`
    - `backend/data/hotels.json`
    - `backend/data/appointments.json`
  - `GET /api/health` returns `"database": "fallback"`.
  - Responses include `metadata.source: "local-file"`.

The frontend is aware of failures and also has its own **safe fallback data** (for example, in `frontend/src/lib/api.ts`) so that pages keep showing reasonable content even if the backend is not reachable.

---

## Basic usage

1. **Start both servers**

   ```bash
   npm run dev
   ```

2. Open the frontend in your browser:

   - `http://localhost:5173`

3. The frontend will call the backend at:

   - `http://localhost:5000/api` (or `VITE_API_URL` if set)

4. Check backend health:

   ```bash
   curl http://localhost:5000/api/health
   ```

   This will tell you whether it is using the **database** or **fallback local files**.

---

## Deployment notes

- **Frontend (Vercel)**:
  - Deploy the `frontend` folder.
  - Set `VITE_API_URL` to your deployed backend URL (e.g. `https://your-backend.com/api`).

- **Backend**:
  - Deploy to a Node-friendly host (Render, Railway, VPS, etc.) or refactor into serverless handlers for Vercel.
  - Set `MONGODB_URI`, `PORT`, and `CORS_ORIGIN` environment variables.
  - If MongoDB is down in production, the backend will automatically use the **local JSON files** – no DB required for basic read/write behavior.

This gives you a complete flow to run and develop **frontend + backend together** and clearly explains that when the **database is not available, data is served from local JSON files instead of MongoDB**.

