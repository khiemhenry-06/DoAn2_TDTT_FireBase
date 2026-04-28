// ============================================
// Authentication Logic
// Xử lý đăng nhập, đăng ký, đăng xuất
// ============================================

// === Chuyển đổi tab Đăng nhập / Đăng ký ===
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const msg = document.getElementById('auth-message');

    // Ẩn thông báo khi chuyển tab
    if (msg) { msg.className = 'message'; }

    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        tabLogin.classList.remove('active');
        tabSignup.classList.add('active');
    }
}

// === Hiển thị thông báo trên form ===
function showAuthMessage(text, type) {
    const msg = document.getElementById('auth-message');
    if (!msg) return;
    msg.textContent = text;
    msg.className = `message show ${type}`;
}

// === Đăng nhập bằng Email/Password ===
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Đang đăng nhập...';

    try {
        // Đăng nhập qua Firebase Auth
        await auth.signInWithEmailAndPassword(email, password);
        showAuthMessage('Đăng nhập thành công! Đang chuyển hướng...', 'success');
        
        // Chuyển sang trang dashboard sau 1 giây
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        // Hiển thị lỗi tiếng Việt
        let errorMsg = 'Đăng nhập thất bại';
        if (error.code === 'auth/user-not-found') errorMsg = 'Email chưa được đăng ký';
        else if (error.code === 'auth/wrong-password') errorMsg = 'Mật khẩu không đúng';
        else if (error.code === 'auth/invalid-email') errorMsg = 'Email không hợp lệ';
        else if (error.code === 'auth/invalid-credential') errorMsg = 'Thông tin đăng nhập không đúng';
        showAuthMessage(errorMsg, 'error');
        
        btn.disabled = false;
        btn.textContent = 'Đăng nhập';
    }
}

// === Đăng ký tài khoản mới ===
async function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const btn = document.getElementById('btn-signup');

    // Kiểm tra mật khẩu trùng khớp
    if (password !== confirm) {
        showAuthMessage('Mật khẩu xác nhận không khớp', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Đang tạo tài khoản...';

    try {
        // Tạo tài khoản qua Firebase Auth
        await auth.createUserWithEmailAndPassword(email, password);
        showAuthMessage('Tạo tài khoản thành công! Đang chuyển hướng...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        let errorMsg = 'Đăng ký thất bại';
        if (error.code === 'auth/email-already-in-use') errorMsg = 'Email đã được sử dụng';
        else if (error.code === 'auth/weak-password') errorMsg = 'Mật khẩu phải có ít nhất 6 ký tự';
        else if (error.code === 'auth/invalid-email') errorMsg = 'Email không hợp lệ';
        showAuthMessage(errorMsg, 'error');
        
        btn.disabled = false;
        btn.textContent = 'Tạo tài khoản';
    }
}

// === Đăng nhập bằng Google ===
async function handleGoogleLogin() {
    const btn = document.getElementById('btn-google');
    btn.disabled = true;

    try {
        // Tạo Google provider và mở popup đăng nhập
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        
        showAuthMessage('Đăng nhập Google thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            showAuthMessage('Đăng nhập Google thất bại: ' + error.message, 'error');
        }
        btn.disabled = false;
    }
}

// === Đăng xuất ===
async function handleLogout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
    }
}

// === Kiểm tra trạng thái đăng nhập khi trang load ===
auth.onAuthStateChanged((user) => {
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.endsWith('index.html') || currentPage.endsWith('/');
    const isDashboard = currentPage.endsWith('dashboard.html');

    if (user && isLoginPage) {
        // Đã đăng nhập mà đang ở trang login -> chuyển sang dashboard
        window.location.href = 'dashboard.html';
    } else if (!user && isDashboard) {
        // Chưa đăng nhập mà đang ở dashboard -> quay về login
        window.location.href = 'index.html';
    }
});
