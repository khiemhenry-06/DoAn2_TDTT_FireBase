// ============================================
// Firebase Configuration - TEMPLATE
// ============================================
// HƯỚNG DẪN: 
// 1. Sao chép file này thành "firebase-config.js"
// 2. Thay thế các giá trị "YOUR_..." bằng config của bạn
//    từ Firebase Console > Project Settings > Your apps > Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Tạo instance auth để dùng ở các file JS khác
const auth = firebase.auth();

// URL của Backend API (FastAPI)
const API_BASE = "http://localhost:8000";
