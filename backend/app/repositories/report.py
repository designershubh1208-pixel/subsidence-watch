from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from datetime import datetime, timedelta
import uuid

from app.models.report import Report, IssueType
from app.models.zone import Zone
from app.schemas.report import ReportCreate
from app.repositories.base import CRUDBase

class CRUDReport(CRUDBase[Report]):
    async def create_with_geometry(self, db: AsyncSession, *, obj_in: ReportCreate) -> Report:
        """
        Creates a new report and converts the raw lat/long into a PostGIS point.
        """
        db_obj = self.model(
            latitude=obj_in.latitude,
            longitude=obj_in.longitude,
            issue_type=IssueType(obj_in.issue_type),
            photo_url=obj_in.photo_url,
            phone_number=obj_in.phone_number,
            # Create a PostGIS geometry point (Longitude, Latitude), SRID 4326
            location=f"SRID=4326;POINT({obj_in.longitude} {obj_in.latitude})"
        )
        db.add(db_obj)
        await db.flush()
        return db_obj

    async def assign_zone(self, db: AsyncSession, report: Report) -> Optional[uuid.UUID]:
        """
        Finds if the report falls within any existing zone using PostGIS ST_Contains.
        If so, assigns the zone_id to the report.
        """
        stmt = select(Zone.id).where(
            func.ST_Contains(Zone.boundary, func.ST_GeomFromEWKT(report.location))
        ).limit(1)
        
        result = await db.execute(stmt)
        zone_id = result.scalar_one_or_none()
        
        if zone_id:
            report.zone_id = zone_id
            await db.flush()
            
        return zone_id

    async def count_reports_in_zone_last_14_days(self, db: AsyncSession, zone_id: uuid.UUID) -> int:
        """
        Counts how many reports exist in a specific zone over the last 14 days.
        """
        fourteen_days_ago = datetime.utcnow() - timedelta(days=14)
        stmt = select(func.count(self.model.id)).where(
            self.model.zone_id == zone_id,
            self.model.created_at >= fourteen_days_ago
        )
        result = await db.execute(stmt)
        return result.scalar_one() or 0

report_repo = CRUDReport(Report)
