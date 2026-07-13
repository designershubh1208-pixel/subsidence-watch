from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime
import uuid

class ReportCreate(BaseModel):
    latitude: float
    longitude: float
    issue_type: Literal["crack", "uneven_ground", "other"]
    photo_url: Optional[str] = None
    phone_number: Optional[str] = None

class ReportResponse(BaseModel):
    id: uuid.UUID
    zone_id: Optional[uuid.UUID] = None
    latitude: float
    longitude: float
    issue_type: Literal["crack", "uneven_ground", "other"]
    photo_url: Optional[str] = None
    phone_number: Optional[str] = None
    status: Literal["new", "reviewed"]
    created_at: datetime
    
    class Config:
        from_attributes = True
