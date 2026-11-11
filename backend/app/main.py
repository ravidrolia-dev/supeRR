from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.api import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Professional Cricket Scouting & Pressure Intelligence API for Rajasthan Royals SupeRR Selector Season 2",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "Beyond Performance. Measuring Who Delivers Under Pressure.",
        "documentation": "/docs",
        "api_prefix": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

