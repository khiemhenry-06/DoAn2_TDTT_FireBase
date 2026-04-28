# ============================================
# Router: Authentication
# Xử lý xác thực người dùng
# ============================================

from fastapi import APIRouter, HTTPException, Header
from services.firebase_service import verify_token

router = APIRouter(prefix="/auth", tags=["auth"])


# === Dependency: Lấy user từ token ===
def get_current_user(authorization: str = Header(...)):
    """
    Dependency xác thực: kiểm tra header Authorization
    và trả về thông tin user từ Firebase token.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Header Authorization không hợp lệ")

    token = authorization.replace("Bearer ", "").strip()

    try:
        user = verify_token(token)
        return user
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


# === GET /auth/me - Thông tin user hiện tại ===
@router.get("/me")
def me(authorization: str = Header(...)):
    """Trả về thông tin user đang đăng nhập"""
    user = get_current_user(authorization)
    return {
        "email": user["email"],
        "uid": user["uid"]
    }
