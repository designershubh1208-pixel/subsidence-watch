import uuid
import enum
from typing import List, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Enum
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.report import Report

class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Zone(Base, TimestampMixin):
    __tablename__ = "zones"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), index=True)
    # Using MultiPolygon for complex boundaries, SRID 4326 (WGS84)
    boundary: Mapped[str] = mapped_column(Geometry("MULTIPOLYGON", srid=4326))
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel, name="risk_level_enum", native_enum=False), default=RiskLevel.LOW)
    requires_review: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="zone")
