import logging
import random
import json
from datetime import datetime, timedelta
from typing import Dict, Any

from app.models.zone import RiskLevel
from app.core.config import settings

logger = logging.getLogger(__name__)

class GEEService:
    def __init__(self):
        self._ee_initialized = False
        try:
            import ee
            # Check if credentials path is provided in config or env
            if settings.EE_SERVICE_ACCOUNT_JSON:
                credentials = ee.ServiceAccountCredentials('', settings.EE_SERVICE_ACCOUNT_JSON)
                ee.Initialize(credentials)
            else:
                # Attempt default initialization (e.g., if running on GCP with default creds)
                ee.Initialize()
                
            self._ee_initialized = True
            self.ee = ee
            logger.info("Successfully initialized Google Earth Engine.")
        except Exception as e:
            logger.warning(f"Failed to initialize Google Earth Engine. Falling back to mock generator. Reason: {e}")

    def calculate_risk_for_zone(self, geojson_geometry: Dict[str, Any]) -> RiskLevel:
        """
        Takes a GeoJSON geometry dictionary and returns a calculated RiskLevel.
        If GEE is unavailable, falls back to a random risk level.
        """
        if not self._ee_initialized:
            # PRD Requirement: Fallback to a random risk generator so pipeline doesn't crash.
            mock_risk = random.choice(list(RiskLevel))
            logger.info(f"[GEE Fallback Mock] Generated simulated risk level: {mock_risk.name}")
            return mock_risk

        try:
            # Actual GEE Logic
            polygon = self.ee.Geometry(geojson_geometry)
            
            # Fetch Sentinel-1 GRD (Ground Range Detected) data for the last 30 days
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
            
            collection = (self.ee.ImageCollection('COPERNICUS/S1_GRD')
                          .filterBounds(polygon)
                          .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
                          .filter(self.ee.Filter.eq('instrumentMode', 'IW'))
                          .select('VV'))
            
            # Calculate the mean backscatter over time for the region
            mean_image = collection.mean()
            stats = mean_image.reduceRegion(
                reducer=self.ee.Reducer.mean(),
                geometry=polygon,
                scale=10,
                maxPixels=1e9
            )
            
            # Extract the VV polarization value
            # InSAR technically requires SLC (Single Look Complex) data and complex phase processing.
            # GRD amplitude is used here as a simulated proxy metric for pipeline completeness.
            mean_vv = stats.get('VV').getInfo()
            
            if mean_vv is None:
                logger.warning("GEE returned no valid Sentinel-1 data for this region. Defaulting to LOW risk.")
                return RiskLevel.LOW
                
            logger.info(f"GEE Sentinel-1 Mean VV Backscatter: {mean_vv}")
            
            # Map the backscatter coefficient to a RiskLevel (Simulated thresholds)
            # Typically VV is between -25 and 0 dB. 
            if mean_vv < -15:
                return RiskLevel.CRITICAL
            elif mean_vv < -12:
                return RiskLevel.HIGH
            elif mean_vv < -8:
                return RiskLevel.MEDIUM
            else:
                return RiskLevel.LOW
                
        except Exception as e:
            logger.error(f"Error during GEE calculation: {e}. Falling back to mock generator.")
            return random.choice(list(RiskLevel))

# Singleton instance
gee_service = GEEService()
