# ClutchIQ Deployment Guide: Render & Vercel
**Platform:** Rajasthan Royals SupeRR Selector Season 2 — ClutchIQ
**Architecture:** Decoupled FastAPI Backend (Render) + React Vite SPA (Vercel)

---

## 1. Prerequisites: Git Repository

If you haven't already committed and pushed this repository to GitHub/GitLab:

```bash
git init
git add .
git commit -m "feat: complete ClutchIQ production platform with light theme redesign"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

---

## 2. Deploy Backend to Render

### Option A: Automatic Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New** &rarr; **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` at the root of the repository:
   - **Service Name:** `clutch-iq-api`
   - **Environment:** Python
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
5. Click **Apply**.
6. Once deployed, note your Render public backend URL (e.g., `https://clutch-iq-api.onrender.com`).

### Option B: Manual Web Service
1. Click **New** &rarr; **Web Service**.
2. Connect your repo and set:
   - **Name:** `clutch-iq-api`
   - **Root Directory:** *(leave blank, or set to repo root)*
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `PYTHON_VERSION`: `3.11.0`
3. Click **Deploy Web Service**.
4. Test your backend live: `https://<YOUR_RENDER_SUBDOMAIN>.onrender.com/api/health` &rarr; should return `{"status":"ok"}`.

---

## 3. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `frontend`.
   - **Build and Output Settings:**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - **Environment Variables:**
     - Add `VITE_API_URL` = `https://<YOUR_RENDER_SUBDOMAIN>.onrender.com` (your backend URL from Step 2, without trailing slash).
5. Click **Deploy**.
6. Vercel will build the frontend and serve it at a public URL (e.g., `https://clutch-iq.vercel.app`).
7. `frontend/vercel.json` will automatically route all SPA client paths (`/batters`, `/bowlers`, `/players`, etc.) to `index.html`.

---

## 4. Verification Checklist

1. **Backend Health Check:**
   - Visit `https://<RENDER_BACKEND_URL>/api/health` &rarr; `{"status":"ok"}`
   - Visit `https://<RENDER_BACKEND_URL>/docs` &rarr; Swagger UI loads
2. **Frontend Connectivity:**
   - Open `https://<VERCEL_FRONTEND_URL>/`
   - Confirm KPIs, top batters, and top bowlers load data from the Render API without CORS errors.
   - Navigate to `/batters`, `/bowlers`, `/players`, and `/compare` to verify client-side routing and live data filtering.

