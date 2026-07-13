from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.repositories.zone import zone_repo
from app.schemas.zone import Zone as ZoneSchema
from app.models.zone import RiskLevel

class ZoneService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    def _map_risk_level_to_color(self, risk: RiskLevel) -> str:
        """
        Maps the backend semantic risk level to the frontend MVP color contract.
        """
        mapping = {
            RiskLevel.CRITICAL: "red",
            RiskLevel.HIGH: "red",
            RiskLevel.MEDIUM: "yellow",
            RiskLevel.LOW: "green"
        }
        return mapping.get(risk, "green")

    async def get_zones_for_map(self) -> List[ZoneSchema]:
        """
        Fetches all zones and formats them according to the MVP frontend contract.
        """
        raw_zones = await zone_repo.get_all_zones_with_centroids(self.db)
        
        formatted_zones = []
        for zone, lat, lon in raw_zones:
            formatted_zones.append(ZoneSchema(
                zone_id=str(zone.id),
                name=zone.name,
                latitude=lat or 0.0,
                longitude=lon or 0.0,
                risk_level=self._map_risk_level_to_color(zone.risk_level),
                last_updated=zone.updated_at.isoformat()
            ))
            
        return formatted_zones

    async def approve_zone_review(self, zone_id: str, new_risk: RiskLevel) -> None:
        import uuid
        parsed_id = uuid.UUID(zone_id)
        await zone_repo.update_risk_level(self.db, parsed_id, new_risk)
        await zone_repo.set_review_flag(self.db, parsed_id, requires_review=False)
        await self.db.commit()

    async def reject_zone_review(self, zone_id: str) -> None:
        import uuid
        parsed_id = uuid.UUID(zone_id)
        await zone_repo.set_review_flag(self.db, parsed_id, requires_review=False)
        await self.db.commit()
