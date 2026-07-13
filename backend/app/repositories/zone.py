from typing import List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from app.models.zone import Zone, RiskLevel
from app.repositories.base import CRUDBase
import uuid

class CRUDZone(CRUDBase[Zone]):
    async def get_all_zones_with_centroids(self, db: AsyncSession) -> List[Any]:
        """
        Fetch all zones and their centroids for the frontend map.
        Uses PostGIS ST_Centroid to calculate the center of the MultiPolygon boundary.
        """
        stmt = select(
            self.model,
            func.ST_Y(func.ST_Centroid(self.model.boundary)).label("latitude"),
            func.ST_X(func.ST_Centroid(self.model.boundary)).label("longitude")
        )
        result = await db.execute(stmt)
        return list(result.all())

    async def get_all_zones_with_geojson(self, db: AsyncSession) -> List[Any]:
        """
        Fetch all zones and export their boundary to GeoJSON.
        """
        stmt = select(
            self.model,
            func.ST_AsGeoJSON(self.model.boundary).label("geojson")
        )
        result = await db.execute(stmt)
        return list(result.all())

    async def get_zones_requiring_review(self, db: AsyncSession) -> List[Zone]:
        """
        Fetch all zones that have been flagged for admin review.
        """
        stmt = select(self.model).where(self.model.requires_review == True)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def update_risk_level(self, db: AsyncSession, zone_id: uuid.UUID, risk_level: RiskLevel) -> None:
        """
        Updates the risk level of a zone.
        """
        stmt = update(self.model).where(self.model.id == zone_id).values(risk_level=risk_level)
        await db.execute(stmt)
        await db.flush()

    async def set_review_flag(self, db: AsyncSession, zone_id: uuid.UUID, requires_review: bool) -> None:
        """
        Sets the review flag on or off.
        """
        stmt = update(self.model).where(self.model.id == zone_id).values(requires_review=requires_review)
        await db.execute(stmt)
        await db.flush()

zone_repo = CRUDZone(Zone)
