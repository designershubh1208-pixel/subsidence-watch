import firebase_admin
from firebase_admin import credentials
import os
import logging

logger = logging.getLogger(__name__)

def init_firebase():
    """
    Initialize Firebase Admin SDK.
    Uses GOOGLE_APPLICATION_CREDENTIALS environment variable natively.
    If not set or in a dev environment without credentials, it handles gracefully.
    """
    if not firebase_admin._apps:
        # Check if credentials are provided
        cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized with certificate.")
        else:
            # Initialize with default app (useful for GCP environments)
            try:
                firebase_admin.initialize_app()
                logger.info("Firebase Admin initialized with default credentials.")
            except Exception as e:
                logger.warning(f"Could not initialize Firebase Admin: {e}")
