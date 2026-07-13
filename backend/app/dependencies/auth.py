from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()

def get_current_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify the Firebase token provided in the Authorization header.
    Returns the decoded token (which contains user uid, email, etc.) if valid.
    Otherwise, raises a 401 Unauthorized exception.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.warning(f"Failed to verify Firebase token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
