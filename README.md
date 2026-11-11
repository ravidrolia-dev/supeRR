# ClutchIQ — Professional Cricket Scouting & Pressure Performance Intelligence Platform
### Rajasthan Royals SupeRR Selector Season 2

ClutchIQ is a full-stack sports analytics web platform engineered for Rajasthan Royals SupeRR Selector Season 2. It operationalizes a defensible, context-aware mathematical definition of cricket pressure, quantifying clutch performance for 180 qualified batters and 222 qualified bowlers across 853 elite T20 matches (371 IPL, 482 T20I).

---

## 1. Architecture Overview

ClutchIQ is structured as a decoupled full-stack application:
- **Backend:** High-performance asynchronous REST API powered by **FastAPI**, **Pandas**, **NumPy**, and **Pydantic**.
- **Frontend:** Responsive analytics workstation built with **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Recharts**, and **Lucide React**.

```
RR_Solution/
├── backend/
│   ├── app/
│   │   ├── config.py             # Server settings & path configurations
│   │   ├── main.py               # FastAPI entrypoint & CORS middleware
│   │   ├── routes/
│   │   │   └── api.py            # REST endpoints for analytics & players
│   │   ├── schemas/
│   │   │   └── schemas.py         # Pydantic schemas for strict validation
│   │   └── services/
│   │       ├── analytics_service.py # Overview KPIs & pressure intelligence
│   │       ├── data_loader.py       # High-speed memory caching singleton
│   │       ├── player_service.py    # Player dossier & comparison engine
│   │       └── ranking_service.py   # Top 10 official ranking tables
│   ├── Procfile                  # Render / Heroku process definition
│   └── requirements.txt          # Production Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/layout/    # Top Navbar & Global Navigation Sidebar
│   │   ├── pages/
│   │   │   ├── Overview.tsx      # Executive Overview & KPI Dashboard
│   │   │   ├── Batters.tsx       # Top 10 Batters (Combined, IPL, T20I)
│   │   │   ├── Bowlers.tsx       # Top 10 Bowlers (Combined, IPL, T20I)
│   │   │   ├── PlayerExplorer.tsx# Individual forensic player dossiers
│   │   │   ├── PlayerComparison.tsx# Head-to-head benchmarking & CI overlap
│   │   │   ├── PressureIntelligence.tsx # BPI & BowlerPI architecture
│   │   │   ├── BowlingIntelligence.tsx  # Wicket sensitivity & decomposition
│   │   │   └── Methodology.tsx   # Mathematical formulas & audit standards
│   │   ├── services/api.ts       # Typed Axios API client
│   │   ├── App.tsx               # Client-side router configuration
│   │   └── index.css             # Dark theme Tailwind styling
│   ├── vercel.json               # Vercel SPA client rewrite rules
│   └── package.json
└── render.yaml                   # Backend deployment configuration
```

---

## 2. Core Methodology & Mathematical Rigor

### Pressure Indices (Pre-Delivery Dynamic Leverage)
- **Batter Pressure Index ($\text{BPI} \in [0, 100]$):** Evaluates pre-delivery required run rate deficits, resource scarcity (wickets in hand, legal balls remaining), and win probability leverage.
- **Bowler Pressure Index ($\text{BowlerPI} \in [0, 100]$):** Captures match leverage, defending small totals, and death phase volatility against power hitters.
- **High-Pressure Threshold:** $\text{PI} \ge 65.0$, comprising 45,825 legal balls (24.7% of all recorded balls).

### Empirical Bayes Shrinkage
To prevent small-sample distortions while rewarding sustained high-pressure excellence:
$$\theta_{\text{shrunk}} = \theta_{\text{raw}} \times \left( \frac{n_{\text{legal}}}{n_{\text{legal}} + k} \right), \quad k = 150.0$$

### Cricket Accounting & Decomposition
Bowling value strictly adheres to double-entry cricket accounting:
$$\text{Raw RBE} = \frac{\text{Weighted Runs Saved} + V_w \times \text{Pressure-Weighted Net Wickets Added}}{n_{\text{legal}}} \times 100$$
Where $V_w = 15.0$ represents the empirical run replacement value of a wicket in T20 match states.

---

## 3. Local Installation & Development

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```
Open `http://localhost:3000` in your browser. All `/api` requests are automatically proxied to `http://localhost:8000`.

### Production Build
```bash
cd frontend
npm run build
```
Build output is generated into `frontend/dist/`.

---

## 4. End-to-End Test Verification

Run the automated endpoint verification suite:
```bash
python -c "
import sys
sys.path.insert(0, 'backend')
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
assert client.get('/api/health').status_code == 200
assert client.get('/api/overview').status_code == 200
assert client.get('/api/rankings/batters?competition=combined').status_code == 200
assert client.get('/api/rankings/bowlers?competition=combined').status_code == 200
assert client.get('/api/players/6396').status_code == 200
print('ClutchIQ backend verification: ALL PASS!')
"
```

