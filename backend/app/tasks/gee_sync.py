import logging
import json
from datetime import datetime

from app.db.session import AsyncSessionLocal
from app.repositories.zone import zone_repo
from app.services.gee import gee_service

logger = logging.getLogger(__name__)

async def sync_all_zones_with_gee():
    """
    Background task to update all zone risk levels using the GEE service.
    This creates its own isolated database transaction.
    """
    logger.info("Starting background GEE synchronization...")
    
    async with AsyncSessionLocal() as db:
        try:
            # 1. Fetch all zones with their GeoJSON boundary string
            zones_with_geojson = await zone_repo.get_all_zones_with_geojson(db)
            
            # 2. Iterate through each zone
            for zone, geojson_str in zones_with_geojson:
                if not geojson_str:
                    logger.warning(f"Zone {zone.name} has no valid boundary geometry. Skipping.")
                    continue
                    
                # 3. Parse GeoJSON string to Python Dict
                geojson_dict = json.loads(geojson_str)
                
                # 4. Calculate Risk via GEE
                logger.info(f"Calculating risk for zone: {zone.name} (ID: {zone.id})")
                new_risk = gee_service.calculate_risk_for_zone(geojson_dict)
                
                # 5. Update Database
                if zone.risk_level != new_risk:
                    logger.info(f"Zone {zone.name} risk changed: {zone.risk_level.name} -> {new_risk.name}")
                    await zone_repo.update_risk_level(db, zone.id, new_risk)
                    zone.updated_at = datetime.utcnow()
                else:
                    logger.info(f"Zone {zone.name} risk unchanged: {zone.risk_level.name}")
            
            # 6. Commit all changes for this sync batch
            await db.commit()
            logger.info("GEE synchronization complete and committed.")
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error during GEE sync. Transaction rolled back. Reason: {e}")
