from fastapi import APIRouter, Depends, status, Request
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.report import ReportCreate, ReportResponse
from app.dependencies import get_db, get_current_admin_user
from app.services.report import ReportService
from app.core.limiter import limiter

router = APIRouter()

@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def submit_report(request: Request, data: ReportCreate, db: AsyncSession = Depends(get_db)):
    """
    Public endpoint to submit a citizen report.
    Automatically flags the associated zone for review if 3+ reports land within 14 days.
    """
    service = ReportService(db)
    return await service.create_and_process_report(data)

@router.get("/reports", response_model=List[ReportResponse])
async def get_reports(
    db: AsyncSession = Depends(get_db)
):
    """
    Admin-only endpoint to fetch all citizen reports.
    Requires a valid Firebase JWT token.
    """
    service = ReportService(db)
    return await service.get_all_reports()
