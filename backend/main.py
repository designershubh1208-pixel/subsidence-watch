from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router

from contextlib import asynccontextmanager
from app.core.firebase import init_firebase
from app.tasks.scheduler import start_scheduler, stop_scheduler

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.limiter import limiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    start_scheduler()
    yield
    stop_scheduler()

app = FastAPI(
    title="Subsidence Watch API",
    description="Production API for Subsidence Watch (PRD #2)",
    version="1.0.0",
    lifespan=lifespan,
)

# Register SlowAPI
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS setup to allow frontend (e.g., localhost:3000) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP, allow all origins. In production, restrict to frontend domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
