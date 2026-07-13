import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.tasks.gee_sync import sync_all_zones_with_gee

logger = logging.getLogger(__name__)

# Initialize a global AsyncIOScheduler
scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Configures and starts the background task scheduler.
    """
    # For testing/demo purposes, as requested by the user, run this every 1 minute
    scheduler.add_job(
        sync_all_zones_with_gee,
        trigger=CronTrigger(minute="*"),  # Every minute
        id="gee_sync_job",
        name="Sync GEE Risk Levels",
        replace_existing=True,
    )
    
    scheduler.start()
    logger.info("APScheduler started. GEE sync job scheduled to run every 1 minute.")

def stop_scheduler():
    """
    Gracefully shuts down the scheduler.
    """
    scheduler.shutdown()
    logger.info("APScheduler stopped.")
