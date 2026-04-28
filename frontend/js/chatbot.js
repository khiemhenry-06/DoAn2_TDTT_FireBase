// ============================================
// Chatbot Hướng Dẫn Sử Dụng
// Chatbot đơn giản dùng từ khóa, không cần API
// ============================================

// === Danh sách câu trả lời theo từ khóa ===
const chatbotResponses = [
    {
        keywords: ["xin chào", "xin chao", "hello", "hi", "chào", "chao", "hey"],
        reply: "Xin chào bạn! 👋 Tôi là trợ lý ảo của VisionAI. Tôi có thể giúp bạn:\n• Hướng dẫn upload ảnh\n• Hướng dẫn phân tích ảnh\n• Xem lịch sử\n• Đăng nhập / đăng xuất\n\nBạn cần hỗ trợ gì?"
    },
    {
        keywords: ["upload", "tải ảnh", "up ảnh", "đăng ảnh", "chọn ảnh", "kéo thả"],
        reply: "📤 Hướng dẫn upload ảnh:\n\n1. Ở tab 'Phân Tích Ảnh', bạn sẽ thấy khu vực 'Kéo thả ảnh vào đây'.\n2. Cách 1: Kéo thả ảnh trực tiếp từ máy tính vào ô đó.\n3. Cách 2: Click vào ô đó để mở cửa sổ chọn file.\n4. Ảnh hỗ trợ: JPG, PNG, WEBP (tối đa 4MB).\n5. Sau khi chọn, ảnh sẽ hiện ở khung xem trước bên phải."
    },
    {
        keywords: ["phân tích", "analyze", "nhận diện", "mô tả", "caption", "ai"],
        reply: "🔍 Hướng dẫn phân tích ảnh:\n\n1. Upload ảnh lên (kéo thả hoặc click chọn).\n2. Bấm nút '🔍 Phân tích ảnh' (màu tím).\n3. Chờ AI xử lý (khoảng 5-15 giây).\n4. Kết quả sẽ hiện ra bên dưới gồm:\n   • 🇬🇧 Mô tả tiếng Anh\n   • 🇻🇳 Mô tả tiếng Việt\n\nAI sử dụng mô hình BLIP của Salesforce để nhìn ảnh."
    },
    {
        keywords: ["lịch sử", "history", "đã phân tích", "xem lại"],
        reply: "📋 Xem lịch sử phân tích:\n\n1. Click vào tab '📋 Lịch Sử' trên thanh điều hướng.\n2. Tất cả ảnh bạn đã phân tích sẽ hiện ra theo thứ tự mới nhất.\n3. Mỗi mục gồm: tên ảnh, mô tả tiếng Anh, tiếng Việt và thời gian.\n\nDữ liệu được lưu trên Firebase Firestore nên bạn có thể xem lại bất cứ lúc nào!"
    },
    {
        keywords: ["đăng nhập", "login", "đăng ký", "signup", "tài khoản", "account"],
        reply: "🔐 Hướng dẫn đăng nhập:\n\n• Đăng nhập Email: Nhập email + mật khẩu → Bấm 'Đăng nhập'.\n• Đăng ký: Chuyển sang tab 'Đăng ký', nhập email + mật khẩu → 'Tạo tài khoản'.\n• Google: Bấm 'Đăng nhập với Google' → Chọn tài khoản Google.\n\nSau khi đăng nhập, bạn sẽ được chuyển sang trang Dashboard."
    },
    {
        keywords: ["đăng xuất", "logout", "thoát"],
        reply: "🚪 Để đăng xuất:\n\nBấm nút 'Đăng xuất' (màu đỏ) ở góc trên bên phải thanh điều hướng. Bạn sẽ được chuyển về trang đăng nhập."
    },
    {
        keywords: ["lỗi", "error", "không được", "sai", "bug", "hỏng"],
        reply: "🔧 Xử lý sự cố thường gặp:\n\n• Lỗi 'AI đang tải': Chờ 1-2 phút cho AI model load xong.\n• Lỗi kết nối server: Kiểm tra backend đã chạy chưa (port 8000).\n• Lỗi đăng nhập: Kiểm tra email/mật khẩu đúng chưa.\n• Ảnh quá lớn: Giảm kích thước ảnh xuống dưới 4MB.\n• Không thấy lịch sử: Thử tải lại trang (F5)."
    },
    {
        keywords: ["tính năng", "feature", "làm được gì", "chức năng"],
        reply: "✨ Các tính năng của VisionAI:\n\n1. 🔐 Đăng nhập Firebase (Email + Google)\n2. 📤 Upload ảnh (kéo thả / chọn file)\n3. 🤖 Phân tích ảnh bằng AI (BLIP model)\n4. 🌐 Dịch mô tả sang tiếng Việt\n5. 💾 Lưu lịch sử vào Firestore\n6. 📋 Xem lại lịch sử phân tích\n7. 👤 Quản lý tài khoản cá nhân"
    },
    {
        keywords: ["cảm ơn", "thanks", "thank", "ok", "được rồi"],
        reply: "Không có gì! 😊 Nếu bạn cần hỗ trợ thêm, cứ nhắn cho tôi nhé. Chúc bạn sử dụng VisionAI vui vẻ! 🔮"
    }
];

// Câu trả lời mặc định khi không tìm thấy từ khóa
const defaultReply = "Xin lỗi, tôi chưa hiểu câu hỏi của bạn 😅\n\nBạn có thể hỏi tôi về:\n• Cách upload ảnh\n• Cách phân tích ảnh\n• Xem lịch sử\n• Đăng nhập / đăng xuất\n• Các tính năng\n• Xử lý lỗi";

// === Tìm câu trả lời theo từ khóa ===
function findReply(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    for (const item of chatbotResponses) {
        for (const keyword of item.keywords) {
            if (msg.includes(keyword)) {
                return item.reply;
            }
        }
    }

    return defaultReply;
}

// === Trạng thái chatbot ===
let chatOpen = false;

// === Toggle mở/đóng chatbot ===
function toggleChatbot() {
    const panel = document.getElementById('chatbot-panel');
    const badge = document.getElementById('chatbot-badge');
    chatOpen = !chatOpen;

    if (chatOpen) {
        panel.classList.add('open');
        if (badge) badge.style.display = 'none';
    } else {
        panel.classList.remove('open');
    }
}

// === Thêm tin nhắn vào khung chat ===
function addChatMessage(text, sender) {
    const messages = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;

    // Chuyển \n thành <br> để hiển thị xuống dòng
    div.innerHTML = text.replace(/\n/g, '<br>');

    messages.appendChild(div);

    // Tự cuộn xuống tin mới nhất
    messages.scrollTop = messages.scrollHeight;
}

// === Xử lý khi user gửi tin nhắn ===
function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const text = input.value.trim();

    if (!text) return;

    // Hiển thị tin nhắn của user
    addChatMessage(text, 'user');
    input.value = '';

    // Giả lập "đang gõ..." rồi trả lời sau 500ms
    setTimeout(() => {
        const reply = findReply(text);
        addChatMessage(reply, 'bot');
    }, 500);
}

// === Khởi tạo chatbot khi trang load ===
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chatbot-input');
    if (input) {
        // Cho phép gửi bằng phím Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    // Hiện badge thông báo sau 3 giây
    setTimeout(() => {
        const badge = document.getElementById('chatbot-badge');
        if (badge && !chatOpen) {
            badge.style.display = 'block';
        }
    }, 3000);
});
