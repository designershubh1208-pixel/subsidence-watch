from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.zone import Zone
from app.dependencies import get_db
from app.services.zone import ZoneService

router = APIRouter()

@router.get("/zones", response_model=List[Zone])
async def get_zones(db: AsyncSession = Depends(get_db)):
    """
    Returns the list of zones from the database.
    Centroids are automatically calculated from the zone boundary polygons.
    """
    service = ZoneService(db)
    return await service.get_zones_for_map()
