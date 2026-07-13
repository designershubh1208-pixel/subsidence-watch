from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_admin_user
from app.schemas.zone import ZoneApproveRequest
from app.services.zone import ZoneService
from app.models.zone import RiskLevel

router = APIRouter()

@router.post("/zones/{zone_id}/approve", status_code=status.HTTP_200_OK)
async def approve_zone(
    zone_id: str,
    data: ZoneApproveRequest,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(get_current_admin_user)
):
    """
    Admin-only endpoint to approve a flagged zone.
    Overrides the risk level manually and clears the requires_review flag.
    """
    service = ZoneService(db)
    try:
        new_risk = RiskLevel(data.risk_level)
        await service.approve_zone_review(zone_id, new_risk)
        return {"message": "Zone approved and risk level updated."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to approve zone: {str(e)}")

@router.post("/zones/{zone_id}/reject", status_code=status.HTTP_200_OK)
async def reject_zone(
    zone_id: str,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(get_current_admin_user)
):
    """
    Admin-only endpoint to reject a flagged zone.
    Clears the requires_review flag without changing the risk level.
    """
    service = ZoneService(db)
    try:
        await service.reject_zone_review(zone_id)
        return {"message": "Zone review rejected."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to reject zone: {str(e)}")
