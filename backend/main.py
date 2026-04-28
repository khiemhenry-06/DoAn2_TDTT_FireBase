# ============================================
# VisionAI Backend - FastAPI Server
# Tác giả: Lê Phạm Đăng Khiêm - 24120341
# Mô tả: Backend xử lý xác thực, phân tích ảnh AI,
#         và thao tác database Firestore
# ============================================

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers.auth import router as auth_router
from routers.analyze import router as analyze_router
from routers.history import router as history_router
from services.ai_service import ImageAnalyzer

# Khởi tạo FastAPI app
app = FastAPI(
    title="VisionAI Backend",
    description="API phân tích ảnh bằng AI - Đồ án Lab 2 TDTT",
    version="1.0.0"
)

# Cho phép frontend (chạy ở port khác) gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router
app.include_router(auth_router)
app.include_router(analyze_router)
app.include_router(history_router)

# Khởi tạo AI model (chạy khi server start)
ai = ImageAnalyzer()


# === Endpoint gốc: Giới thiệu hệ thống ===
@app.get("/")
async def root():
    return {
        "system": "VisionAI - Hệ thống phân tích ảnh bằng trí tuệ nhân tạo",
        "author": "Lê Phạm Đăng Khiêm - 24120341",
        "ai_model": "Salesforce/blip-image-captioning-base",
        "translate_model": "Helsinki-NLP/opus-mt-en-vi",
        "endpoints": {
            "root": "GET /",
            "health": "GET /health",
            "analyze": "POST /api/analyze",
            "history": "GET /api/history",
            "auth_me": "GET /auth/me"
        }
    }


# === Endpoint kiểm tra trạng thái hệ thống ===
@app.get("/health")
async def health():
    if ai.health_check():
        return {
            "status": "ok",
            "message": "Hệ thống AI đã tải thành công và đang hoạt động!"
        }
    else:
        return {
            "status": "loading",
            "message": "AI đang được nạp, vui lòng đợi..."
        }


# Để các router có thể truy cập AI instance
app.state.ai = ai


# === Chạy server ===
if __name__ == "__main__":
    print("=" * 50)
    print("  VisionAI Backend đang khởi động...")
    print("  Server: http://localhost:8000")
    print("  Docs:   http://localhost:8000/docs")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8000)
