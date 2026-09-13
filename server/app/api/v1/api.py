from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    ai
)

app_router = APIRouter()

app_router.include_router(auth.router, prefix="/auth", tags=['Authentication'])
app_router.include_router(ai.router, prefix="/ai", tags=['AI'])