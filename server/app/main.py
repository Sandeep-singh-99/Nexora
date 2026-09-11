from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth_router
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform startup database initialization
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

# Configure CORS Middleware for Web clients
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Router
app.include_router(auth_router, prefix="/auth")


@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "Welcome to Nexora API",
        "version": settings.VERSION,
    }
