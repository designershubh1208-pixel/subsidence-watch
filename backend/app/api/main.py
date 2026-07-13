from fastapi import APIRouter
from app.api.routers import zones, reports, admin

api_router = APIRouter()

api_router.include_router(zones.router, tags=["zones"])
api_router.include_router(reports.router, tags=["reports"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
