import uuid
import enum
from typing import Optional, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum, Float
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.zone import Zone

class ReportStatus(str, enum.Enum):
    NEW = "new"
    REVIEWED = "reviewed"

class IssueType(str, enum.Enum):
    CRACK = "crack"
    UNEVEN_GROUND = "uneven_ground"
    OTHER = "other"

class Report(Base, TimestampMixin):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    zone_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("zones.id", ondelete="SET NULL"), nullable=True)
    
    # Store raw lat/long for easy JSON serialization without PostGIS functions
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    
    # Store geometry point for spatial queries (SRID 4326)
    location: Mapped[str] = mapped_column(Geometry("POINT", srid=4326), index=True)
    
    issue_type: Mapped[IssueType] = mapped_column(Enum(IssueType, name="issue_type_enum", native_enum=False), index=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus, name="report_status_enum", native_enum=False), default=ReportStatus.NEW)
    
    # Relationships
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="reports")
