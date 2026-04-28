# ============================================
# Router: History - Lịch sử phân tích
# Đọc dữ liệu đã lưu từ Firestore
# ============================================

from fastapi import APIRouter, Header, Query
from routers.auth import get_current_user
from services.firebase_service import get_history

router = APIRouter(prefix="/api", tags=["history"])


# === GET /api/history - Lấy lịch sử phân tích ===
@router.get("/history")
def get_analysis_history(
    authorization: str = Header(...),
    limit: int = Query(default=20, ge=1, le=100)
):
    """
    Trả về danh sách lịch sử phân tích ảnh của user.
    Sắp xếp theo thời gian mới nhất trước.
    """
    user = get_current_user(authorization)

    try:
        history = get_history(user["uid"], limit=limit)
        return history
    except Exception as e:
        # Nếu Firestore lỗi, trả về mảng rỗng
        print(f"  ⚠️ Lỗi đọc Firestore: {e}")
        return []
