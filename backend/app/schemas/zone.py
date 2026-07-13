from pydantic import BaseModel, Field
from typing import Literal

class Zone(BaseModel):
    zone_id: str
    name: str
    latitude: float
    longitude: float
    risk_level: str = Field(description="Must be 'green', 'yellow', or 'red'")
    last_updated: str

class ZoneApproveRequest(BaseModel):
    risk_level: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]
