from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.repositories.report import report_repo
from app.repositories.zone import zone_repo
from app.schemas.report import ReportCreate, ReportResponse

class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_and_process_report(self, data: ReportCreate) -> ReportResponse:
        """
        Business logic for creating a new report:
        1. Save it to DB
        2. Assign it to a zone if it falls in one
        3. Trigger escalation logic if necessary
        """
        # 1. Create report
        report = await report_repo.create_with_geometry(self.db, obj_in=data)
        
        # 2. Assign to zone via spatial query
        zone_id = await report_repo.assign_zone(self.db, report)
        
        # 3. Escalation logic (Human-in-the-loop)
        if zone_id:
            recent_count = await report_repo.count_reports_in_zone_last_14_days(self.db, zone_id)
            if recent_count >= 3:
                await zone_repo.set_review_flag(self.db, zone_id, requires_review=True)
                
        # Return formatted response (SQLAlchemy object easily translates to Pydantic since we set from_attributes=True)
        return report

    async def get_all_reports(self) -> List[ReportResponse]:
        """
        Fetches all reports for the admin dashboard.
        """
        # using the get_multi from CRUDBase
        reports = await report_repo.get_multi(self.db)
        return reports
