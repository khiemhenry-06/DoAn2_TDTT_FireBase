# ============================================
# Firebase Service - Xác thực token và thao tác Firestore
# ============================================

import firebase_admin
from firebase_admin import credentials, auth, firestore
from datetime import datetime, timezone
import os


# === Khởi tạo Firebase Admin SDK ===
def init_firebase():
    """
    Khởi tạo Firebase Admin SDK với Service Account Key.
    File key đặt tại: backend/serviceAccountKey.json
    """
    if not firebase_admin._apps:
        # Đường dẫn đến file service account key
        key_path = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
        
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            print("  ✅ Firebase Admin SDK đã khởi tạo thành công!")
        else:
            print("  ⚠️  Không tìm thấy serviceAccountKey.json")
            print("  Hãy tải từ Firebase Console > Project Settings > Service Accounts")
            # Khởi tạo không có credentials (sẽ giới hạn chức năng)
            firebase_admin.initialize_app()


# Khởi tạo khi import module
init_firebase()


# === Xác thực Firebase ID Token ===
def verify_token(id_token: str) -> dict:
    """
    Xác thực Firebase ID token và trả về thông tin user.
    Trả về dict: {"uid": ..., "email": ...}
    """
    try:
        decoded = auth.verify_id_token(id_token)
        return {
            "uid": decoded.get("uid"),
            "email": decoded.get("email", "unknown")
        }
    except Exception as e:
        raise ValueError(f"Token không hợp lệ: {str(e)}")


# === Lấy Firestore client ===
def get_db():
    """Trả về Firestore client instance"""
    return firestore.client()


# === Lưu kết quả phân tích vào Firestore ===
def save_analysis(uid: str, image_name: str, english: str, vietnamese: str):
    """
    Lưu kết quả phân tích ảnh vào Firestore.
    Cấu trúc: analyses/{uid}/history/{auto_id}
    """
    db = get_db()
    doc_data = {
        "image_name": image_name,
        "english": english,
        "vietnamese": vietnamese,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # Lưu vào collection theo user
    db.collection("analyses").document(uid).collection("history").add(doc_data)


# === Đọc lịch sử phân tích từ Firestore ===
def get_history(uid: str, limit: int = 20) -> list:
    """
    Đọc lịch sử phân tích ảnh của user từ Firestore.
    Sắp xếp theo thời gian mới nhất.
    """
    db = get_db()
    
    query = (
        db.collection("analyses")
        .document(uid)
        .collection("history")
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )
    
    docs = list(query.stream())
    
    return [
        {
            "image_name": doc.to_dict().get("image_name", ""),
            "english": doc.to_dict().get("english", ""),
            "vietnamese": doc.to_dict().get("vietnamese", ""),
            "timestamp": doc.to_dict().get("timestamp", "")
        }
        for doc in docs
    ]
