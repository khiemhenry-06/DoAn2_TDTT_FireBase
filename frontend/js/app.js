// ============================================
// Dashboard App Logic
// Xử lý upload ảnh, gọi API phân tích, lịch sử
// ============================================

let selectedFile = null;    // File ảnh đã chọn
let currentUser = null;     // User hiện tại

// === Khởi tạo khi trang load ===
document.addEventListener('DOMContentLoaded', () => {
    setupUploadZone();
    
    // Chờ Firebase auth sẵn sàng rồi mới load data
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            updateUserUI(user);
            loadHistory();
            checkAIStatus();
        }
    });
});

// === Cập nhật giao diện user trên navbar ===
function updateUserUI(user) {
    const email = user.email || 'Unknown';
    const initial = email.charAt(0).toUpperCase();
    
    document.getElementById('user-email').textContent = email;
    document.getElementById('user-avatar').textContent = initial;
    document.getElementById('profile-email').textContent = email;
    document.getElementById('profile-uid').textContent = user.uid;
    document.getElementById('profile-avatar').textContent = initial;
    
    // Xác định phương thức đăng nhập
    const providerData = user.providerData;
    let providerName = 'Email/Password';
    if (providerData && providerData.length > 0) {
        if (providerData[0].providerId === 'google.com') providerName = 'Google';
    }
    document.getElementById('profile-provider').textContent = providerName;
    document.getElementById('profile-login-time').textContent = new Date().toLocaleString('vi-VN');
}

// === Chuyển đổi giữa các tab ===
function switchSection(section) {
    // Ẩn tất cả tab content
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    
    // Hiện tab được chọn
    document.getElementById(`section-${section}`).classList.add('active');
    event.target.classList.add('active');
    
    // Load lại history khi chuyển sang tab lịch sử
    if (section === 'history') loadHistory();
}

// === Thiết lập upload zone (drag & drop + click) ===
function setupUploadZone() {
    const zone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');

    // Click vào zone để mở file picker
    zone.addEventListener('click', () => fileInput.click());
    
    // Khi user chọn file
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    // Drag & Drop events
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });
}

// === Xử lý file ảnh đã chọn ===
function handleFile(file) {
    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh (JPG, PNG, WEBP)', 'error');
        return;
    }

    // Kiểm tra kích thước (4MB max)
    if (file.size > 4 * 1024 * 1024) {
        showToast('File ảnh quá lớn! Tối đa 4MB', 'error');
        return;
    }

    selectedFile = file;

    // Hiển thị preview ảnh
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('preview-img');
        img.src = e.target.result;
        img.style.display = 'block';
        document.getElementById('no-image').style.display = 'none';
        document.getElementById('preview-filename').style.display = 'block';
        document.getElementById('preview-filename').textContent = file.name;
    };
    reader.readAsDataURL(file);

    // Enable nút phân tích
    document.getElementById('btn-analyze').disabled = false;
    document.getElementById('btn-clear').style.display = 'block';
    
    // Ẩn kết quả cũ
    document.getElementById('results-section').style.display = 'none';
}

// === Xóa ảnh đã chọn ===
function clearImage() {
    selectedFile = null;
    document.getElementById('preview-img').style.display = 'none';
    document.getElementById('no-image').style.display = 'block';
    document.getElementById('preview-filename').style.display = 'none';
    document.getElementById('btn-analyze').disabled = true;
    document.getElementById('btn-clear').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('file-input').value = '';
}

// === Gửi ảnh lên backend để phân tích ===
async function analyzeImage() {
    if (!selectedFile || !currentUser) return;

    const btn = document.getElementById('btn-analyze');
    const overlay = document.getElementById('loading-overlay');

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Đang phân tích...';
    overlay.classList.add('show');

    try {
        // Lấy Firebase ID token để xác thực
        const idToken = await currentUser.getIdToken();

        // Tạo FormData để gửi file ảnh
        const formData = new FormData();
        formData.append('file', selectedFile);

        // Gọi API backend
        const response = await fetch(`${API_BASE}/api/analyze`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && !data.error) {
            // Hiển thị kết quả
            document.getElementById('result-en').textContent = data.english || '--';
            document.getElementById('result-vi').textContent = data.vietnamese || '--';
            document.getElementById('results-section').style.display = 'block';
            
            // Cập nhật thống kê
            updateStats();
            showToast('Phân tích ảnh thành công!', 'success');
        } else {
            showToast(data.error || 'Lỗi phân tích ảnh', 'error');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        showToast('Không thể kết nối đến server. Hãy kiểm tra backend đã chạy chưa.', 'error');
    } finally {
        overlay.classList.remove('show');
        btn.disabled = false;
        btn.innerHTML = '🔍 Phân tích ảnh';
    }
}

// === Kiểm tra trạng thái AI server ===
async function checkAIStatus() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        const statusEl = document.getElementById('stat-status');
        if (data.status === 'ok') {
            statusEl.textContent = '🟢 Sẵn sàng';
            statusEl.style.color = 'var(--success)';
        } else {
            statusEl.textContent = '🟡 Đang tải...';
            statusEl.style.color = 'var(--warning)';
        }
    } catch {
        const statusEl = document.getElementById('stat-status');
        statusEl.textContent = '🔴 Offline';
        statusEl.style.color = 'var(--error)';
    }
}

// === Load lịch sử phân tích từ backend ===
async function loadHistory() {
    if (!currentUser) return;

    try {
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`${API_BASE}/api/history`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data) && data.length > 0) {
            renderHistory(data);
            document.getElementById('stat-total').textContent = data.length;
            
            // Đếm số lần phân tích hôm nay
            const today = new Date().toDateString();
            const todayCount = data.filter(item => {
                return new Date(item.timestamp).toDateString() === today;
            }).length;
            document.getElementById('stat-today').textContent = todayCount;
        } else {
            document.getElementById('stat-total').textContent = '0';
            document.getElementById('stat-today').textContent = '0';
        }
    } catch (error) {
        console.error('Lỗi load history:', error);
    }
}

// === Render danh sách lịch sử ===
function renderHistory(items) {
    const list = document.getElementById('history-list');
    const empty = document.getElementById('empty-history');
    
    if (!items || items.length === 0) {
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    
    // Xóa items cũ (giữ lại empty state)
    const existingItems = list.querySelectorAll('.history-item');
    existingItems.forEach(el => el.remove());

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const time = new Date(item.timestamp).toLocaleString('vi-VN');
        
        div.innerHTML = `
            <div class="history-index">${index + 1}</div>
            <div class="history-content">
                <div class="history-filename">📁 ${item.image_name || 'Ảnh'}</div>
                <div class="history-caption">🇬🇧 ${item.english || '--'}</div>
                <div class="history-caption">🇻🇳 ${item.vietnamese || '--'}</div>
            </div>
            <div class="history-time">${time}</div>
        `;
        
        list.appendChild(div);
    });
}

// === Cập nhật lại thống kê ===
function updateStats() {
    loadHistory();
}

// === Hiển thị toast notification ===
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Tự động ẩn sau 4 giây
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
