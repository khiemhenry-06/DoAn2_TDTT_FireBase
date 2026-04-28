# ============================================
# Router: Analyze - Phân tích ảnh
# Endpoint chính của ứng dụng
# ============================================

from fastapi import APIRouter, UploadFile, File, Header, HTTPException, Request
from routers.auth import get_current_user
from services.firebase_service import save_analysis

router = APIRouter(prefix="/api", tags=["analyze"])


# === POST /api/analyze - Phân tích ảnh ===
@router.post("/analyze")
async def analyze_image(
    request: Request,
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    """
    Nhận file ảnh, phân tích bằng AI, lưu kết quả vào Firestore.
    - Input: file ảnh (multipart/form-data)
    - Output: caption tiếng Anh + tiếng Việt
    """
    # Xác thực user
    user = get_current_user(authorization)

    # Kiểm tra file ảnh hợp lệ
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File không phải ảnh")

    # Đọc bytes ảnh
    image_bytes = await file.read()

    # Kiểm tra kích thước (tối đa 4MB)
    if len(image_bytes) > 4 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File ảnh quá lớn (tối đa 4MB)")

    # Lấy AI instance từ app state
    ai = request.app.state.ai

    # Kiểm tra AI đã sẵn sàng chưa
    if not ai.health_check():
        raise HTTPException(status_code=503, detail="AI đang được nạp, vui lòng thử lại sau")

    # Phân tích ảnh bằng AI
    result = ai.analyze_image(image_bytes)

    # Kiểm tra lỗi từ AI
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    # Lưu kết quả vào Firestore
    try:
        save_analysis(
            uid=user["uid"],
            image_name=file.filename or "unknown.jpg",
            english=result["english"],
            vietnamese=result["vietnamese"]
        )
    except Exception as e:
        # Nếu Firestore lỗi, vẫn trả kết quả (không block user)
        print(f"  ⚠️ Lỗi lưu Firestore: {e}")

    return {
        "english": result["english"],
        "vietnamese": result["vietnamese"],
        "image_name": file.filename
    }
