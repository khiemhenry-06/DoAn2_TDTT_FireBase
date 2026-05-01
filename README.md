# 🔮 VisionAI - Phân Tích Ảnh Bằng Trí Tuệ Nhân Tạo

> Ứng dụng web cho phép người dùng upload ảnh và nhận mô tả tự động bằng AI, hỗ trợ cả tiếng Anh lẫn tiếng Việt.

---

## 📋 Thông tin sinh viên

| Thông tin | Chi tiết |
|-----------|----------|
| **Họ và tên** | Lê Phạm Đăng Khiêm |
| **MSSV** | 24120341 |
| **Lớp** | 24CTT3 |
| **Môn học** | Tư Duy Tính Toán |
| **Bài thực hành** | Lab 2 - API & Firebase |

---

## 🎯 Mô tả ứng dụng

VisionAI là ứng dụng web full-stack sử dụng kiến trúc **Frontend (HTML/CSS/JS) + Backend (FastAPI/Python)**, tích hợp **Firebase** để xác thực người dùng và lưu trữ dữ liệu, kết hợp **AI** để phân tích nội dung ảnh.

### Mô hình AI sử dụng

| Chức năng | Model | Nguồn |
|-----------|-------|-------|
| Phân tích ảnh → Caption tiếng Anh | `Salesforce/blip-image-captioning-base` | [HuggingFace](https://huggingface.co/Salesforce/blip-image-captioning-base) |
| Dịch Caption sang tiếng Việt | `Helsinki-NLP/opus-mt-en-vi` | [HuggingFace](https://huggingface.co/Helsinki-NLP/opus-mt-en-vi) |

### Các tính năng chính

- ✅ **Xác thực Firebase** - Đăng nhập / Đăng ký bằng Email hoặc Google
- ✅ **Upload ảnh** - Hỗ trợ kéo thả (drag & drop) hoặc chọn file (JPG, PNG, WEBP)
- ✅ **Phân tích ảnh bằng AI** - Tạo mô tả tự động bằng tiếng Anh + dịch sang tiếng Việt
- ✅ **Lưu lịch sử** - Kết quả phân tích được lưu vào Firestore theo từng user
- ✅ **Xem lịch sử** - Tra cứu lại các ảnh đã phân tích trước đó
- ✅ **Chatbot hướng dẫn** - Trợ lý ảo hỗ trợ hướng dẫn sử dụng ứng dụng
- ✅ **Giao diện hiện đại** - Dark theme, glassmorphism, responsive trên mọi thiết bị
- ✅ **Docker** - Hỗ trợ triển khai bằng Docker Compose

---

## 🏗️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/ML** | HuggingFace Transformers, PyTorch, PIL |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore |
| **Containerization** | Docker, Docker Compose, Nginx |

### 📐 Kiến trúc hệ thống

```
┌─────────────────────────┐     HTTP Request     ┌─────────────────────────┐
│       FRONTEND          │ ──────────────────►   │        BACKEND          │
│  HTML / CSS / JS        │                       │   FastAPI (Python)      │
│  Firebase Auth SDK      │ ◄──────────────────   │   AI Models (PyTorch)   │
│  Port: 3000             │     JSON Response     │   Port: 8000            │
└─────────┬───────────────┘                       └──────────┬──────────────┘
          │                                                  │
          │  Firebase Auth Token                             │  Firebase Admin SDK
          ▼                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FIREBASE (Google Cloud)                              │
│   ┌─────────────────────────┐    ┌──────────────────────────────────┐      │
│   │  Firebase Authentication│    │  Cloud Firestore                 │      │
│   │  - Email/Password       │    │  analyses/{uid}/history/{doc_id} │      │
│   │  - Google Sign-In       │    │  - image_name                    │      │
│   └─────────────────────────┘    │  - english (caption)             │      │
│                                  │  - vietnamese (dịch)             │      │
│                                  │  - timestamp                     │      │
│                                  └──────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc dự án

```
VisionAI/
├── frontend/                      # Giao diện người dùng (HTML/CSS/JS)
│   ├── index.html                 # Trang đăng nhập / đăng ký
│   ├── dashboard.html             # Trang chính (upload, lịch sử, tài khoản)
│   ├── css/
│   │   └── style.css              # Toàn bộ stylesheet (dark theme + chatbot)
│   └── js/
│       ├── firebase-config.js     # Cấu hình Firebase SDK
│       ├── auth.js                # Xử lý đăng nhập / đăng ký / đăng xuất
│       ├── app.js                 # Logic upload ảnh, gọi API, hiển thị kết quả
│       └── chatbot.js             # Chatbot hướng dẫn sử dụng
│
├── backend/                       # Server API (Python FastAPI)
│   ├── main.py                    # Entry point - khởi tạo FastAPI server
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                # API xác thực token Firebase
│   │   ├── analyze.py             # API upload + phân tích ảnh bằng AI
│   │   └── history.py             # API đọc lịch sử từ Firestore
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py          # Module AI: BLIP (caption) + Helsinki (dịch)
│   │   └── firebase_service.py    # Module Firebase Admin SDK + Firestore CRUD
│   └── serviceAccountKey.json     # 🔒 File khóa Firebase (KHÔNG push lên Git)
│
├── Dockerfile.backend             # Docker image cho backend (Python)
├── Dockerfile.frontend            # Docker image cho frontend (Nginx)
├── docker-compose.yml             # Orchestration cả 2 container
├── requirements.txt               # Thư viện Python cần cài đặt
├── .gitignore                     # Danh sách file/thư mục không push lên Git
└── README.md                      # File hướng dẫn này
```

---

## ⚙️ Hướng dẫn cài đặt & chạy

### Yêu cầu hệ thống
- Python 3.10 trở lên
- Node.js (để serve frontend bằng `npx serve`)
- Docker & Docker Compose (nếu chạy bằng Docker)

### Bước 1: Clone dự án
```bash
git clone https://github.com/khiemhenry-06/DoAn2_TDTT_FireBase.git
cd DoAn2_TDTT_FireBase
```

### Bước 2: Cấu hình Firebase (⚠️ BẮT BUỘC - Mỗi người dùng key riêng)

> **Lưu ý quan trọng:** Dự án này **KHÔNG** đính kèm key Firebase. Mỗi người clone về cần tạo Firebase project riêng và lấy key của mình.

1. Truy cập [Firebase Console](https://console.firebase.google.com/) → Tạo project mới
2. Bật **Authentication** → Bật provider: `Email/Password` + `Google`
3. Tạo **Cloud Firestore** → Chọn chế độ `test mode`
4. **Cấu hình Frontend:**
   - Vào **Project Settings** → **General** → Tạo Web App → Lấy config
   - Sao chép file `frontend/js/firebase-config.example.js` thành `frontend/js/firebase-config.js`
   - Thay thế các giá trị `YOUR_...` bằng config vừa lấy
5. **Cấu hình Backend:**
   - Vào **Project Settings** → **Service Accounts** → **Generate new private key**
   - Tải file JSON về và lưu thành `backend/serviceAccountKey.json`
   - *(Tham khảo cấu trúc mẫu tại `backend/serviceAccountKey.example.json`)*

### Bước 3: Cài đặt thư viện Python (Sử dụng Môi trường ảo - Khuyến nghị)
Để hệ thống chạy ổn định và tránh lỗi xung đột phiên bản, bạn nên tạo môi trường ảo (virtual environment) trước khi cài đặt:

```bash
# 1. Tạo môi trường ảo (venv)
python -m venv venv

# 2. Kích hoạt môi trường ảo
# - Trên Windows (dùng Command Prompt hoặc PowerShell):
.\venv\Scripts\activate
# - Trên macOS/Linux:
source venv/bin/activate

# 3. Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

> ⚠️ **Lưu ý:** Lần đầu chạy, hệ thống sẽ tự động tải 2 mô hình AI (~1-2GB). Vui lòng đảm bảo kết nối internet ổn định và chờ quá trình này hoàn tất.

---

## 🚀 Cách chạy ứng dụng

### Cách 1: Chạy thủ công (2 Terminal)

**Terminal 1 - Chạy Backend:**
```bash
cd backend
# Nếu chưa kích hoạt môi trường ảo, hãy chạy lệnh kích hoạt trước: .\venv\Scripts\activate (Windows)
python main.py
```
→ Server API chạy tại: `http://localhost:8000`
→ Trang API docs: `http://localhost:8000/docs`

**Terminal 2 - Chạy Frontend:**
```bash
cd frontend
npx serve -p 3000
```
→ Mở trình duyệt tại: `http://localhost:3000`

---

### Cách 2: Chạy bằng Docker (khuyến nghị)
```bash
docker-compose up -d --build
```
→ Frontend: `http://localhost:3000`
→ Backend: `http://localhost:8000`

Để dừng:
```bash
docker-compose down
```

---

## 📡 API Endpoints

| Method | URL | Mô tả | Auth |
|--------|-----|--------|------|
| `GET` | `/` | Giới thiệu hệ thống | Không |
| `GET` | `/health` | Kiểm tra trạng thái AI | Không |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại | ✅ Bearer Token |
| `POST` | `/api/analyze` | Upload ảnh + phân tích bằng AI | ✅ Bearer Token |
| `GET` | `/api/history` | Xem lịch sử phân tích | ✅ Bearer Token |

### Ví dụ: POST /api/analyze

**Request:**
- Content-Type: `multipart/form-data`
- Header: `Authorization: Bearer <firebase_id_token>`
- Body: field `file` chứa file ảnh (JPG/PNG/WEBP, tối đa 4MB)

**Response thành công (200):**
```json
{
    "english": "a dog laying in the sand on a beach",
    "vietnamese": "Một con chó nằm trên cát ở bãi biển",
    "image_name": "photo.jpg"
}
```

---

## 🔒 Bảo mật

Các file/thư mục sau **KHÔNG** được push lên GitHub (đã cấu hình trong `.gitignore`):
- `serviceAccountKey.json` — Khóa bảo mật Firebase (Cần tự tạo)
- `firebase-config.js` — Cấu hình Firebase Frontend (Cần tự tạo)
- `__pycache__/` — File cache Python
- `*.bin`, `*.safetensors` — Cache mô hình AI
- `node_modules/` — Thư viện Node.js
- `.vscode/`, `.idea/` — Cấu hình IDE

---

Bạn có thể xem video demo đơn giản tại đây:

### YouTube
[![Xem video demo](https://img.youtube.com/vi/99HdM95WKAI/0.jpg)](https://youtu.be/99HdM95WKAI)

Hoặc mở trực tiếp qua link: [https://youtu.be/7s5cMaNOnK8](https://youtu.be/99HdM95WKAI)

---

## 📄 License

Dự án được phát triển phục vụ mục đích học tập tại **Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (HCMUS)**.
