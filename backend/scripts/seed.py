import asyncio
import sys
import os

# Ensure the backend directory is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import AsyncSessionLocal
from app.models.zone import Zone, RiskLevel
from app.models.report import Report, IssueType

MOCK_ZONES_DATA = [
    {"name": "Raniganj Central", "lat": 23.6160, "lon": 87.1330, "risk": RiskLevel.CRITICAL},
    {"name": "Asansol South", "lat": 23.6739, "lon": 86.9524, "risk": RiskLevel.MEDIUM},
    {"name": "Durgapur Steel Plant Area", "lat": 23.5500, "lon": 87.3160, "risk": RiskLevel.LOW},
    {"name": "Jharia Border", "lat": 23.7380, "lon": 86.4170, "risk": RiskLevel.CRITICAL},
    {"name": "Burnpur Industrial", "lat": 23.6667, "lon": 86.9333, "risk": RiskLevel.MEDIUM},
    {"name": "Andal East", "lat": 23.5855, "lon": 87.1852, "risk": RiskLevel.LOW},
    {"name": "Kulti North", "lat": 23.7333, "lon": 86.8500, "risk": RiskLevel.MEDIUM},
    {"name": "Ukhra Outskirts", "lat": 23.6333, "lon": 87.2333, "risk": RiskLevel.LOW}
]

def create_square_polygon(lat: float, lon: float, size: float = 0.02) -> str:
    """
    Helper to generate a WKT POLYGON (as a MULTIPOLYGON) around a central point.
    """
    min_lat, max_lat = lat - size, lat + size
    min_lon, max_lon = lon - size, lon + size
    
    # Polygon points must be closed (last point = first point)
    polygon = f"(({min_lon} {min_lat}, {min_lon} {max_lat}, {max_lon} {max_lat}, {max_lon} {min_lat}, {min_lon} {min_lat}))"
    return f"SRID=4326;MULTIPOLYGON({polygon})"

async def seed_db():
    print("Seeding database with mock zones and reports...")
    async with AsyncSessionLocal() as db:
        try:
            # 1. Seed Zones
            inserted_zones = []
            for z_data in MOCK_ZONES_DATA:
                zone = Zone(
                    name=z_data["name"],
                    boundary=create_square_polygon(z_data["lat"], z_data["lon"]),
                    risk_level=z_data["risk"],
                    requires_review=False
                )
                db.add(zone)
                inserted_zones.append(zone)
            
            await db.flush() # flush to get zone IDs
            print(f"Inserted {len(inserted_zones)} zones.")

            # 2. Seed Reports
            # Add some reports to Raniganj Central to test ST_Contains
            raniganj = inserted_zones[0]
            
            reports = [
                Report(
                    zone_id=raniganj.id,
                    latitude=23.6170,
                    longitude=87.1340,
                    location=f"SRID=4326;POINT(87.1340 23.6170)",
                    issue_type=IssueType.CRACK,
                    status="new",
                    photo_url="https://res.cloudinary.com/demo/image/upload/sample.jpg"
                ),
                Report(
                    zone_id=raniganj.id,
                    latitude=23.6150,
                    longitude=87.1320,
                    location=f"SRID=4326;POINT(87.1320 23.6150)",
                    issue_type=IssueType.UNEVEN_GROUND,
                    status="new"
                ),
                # A report outside any zone
                Report(
                    zone_id=None,
                    latitude=24.0000,
                    longitude=88.0000,
                    location=f"SRID=4326;POINT(88.0000 24.0000)",
                    issue_type=IssueType.OTHER,
                    status="new"
                )
            ]
            
            db.add_all(reports)
            await db.commit()
            print(f"Inserted {len(reports)} reports.")
            print("Database seeding completed successfully!")
            
        except Exception as e:
            await db.rollback()
            print(f"Error seeding database: {e}")

if __name__ == "__main__":
    asyncio.run(seed_db())
