// ============================================
// Firebase Configuration
// Tác giả: Lê Phạm Đăng Khiêm - 24120341
// ============================================
// HƯỚNG DẪN: Thay thế các giá trị bên dưới bằng config 
// từ Firebase Console > Project Settings > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyC-FndAOK429iDleD7z7iEnjKlApyrnvHU",
  authDomain: "visionai-lab2.firebaseapp.com",
  projectId: "visionai-lab2",
  storageBucket: "visionai-lab2.firebasestorage.app",
  messagingSenderId: "257389696969",
  appId: "1:257389696969:web:be7b18e28aa6800faafa18"
};
// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Tạo instance auth để dùng ở các file JS khác
const auth = firebase.auth();

// URL của Backend API (FastAPI)
const API_BASE = "http://localhost:8000";
