# ============================================
# AI Service - Phân tích ảnh bằng BLIP + Dịch thuật
# Tích hợp từ do-an-api-tdtt/api_AI.py
# ============================================

from transformers import AutoProcessor, AutoModelForImageTextToText, AutoTokenizer, AutoModelForSeq2SeqLM
from PIL import Image
import io


class ImageAnalyzer:
    """
    Lớp xử lý AI: 
    - Nhìn ảnh tạo mô tả bằng tiếng Anh (BLIP)
    - Dịch sang tiếng Việt (Helsinki-NLP)
    """

    def __init__(self):
        self.check_health = False

        # Tên các mô hình AI
        self.model_image_id = "Salesforce/blip-image-captioning-base"
        self.model_translate_id = "Helsinki-NLP/opus-mt-en-vi"

        print("=" * 50)
        print("  Đang nạp AI Số 1 (Nhìn ảnh)...")
        print("  Model: " + self.model_image_id)
        print("=" * 50)

        try:
            # 1. Nạp AI Nhìn ảnh (BLIP)
            self.processor_image = AutoProcessor.from_pretrained(self.model_image_id)
            self.model_image = AutoModelForImageTextToText.from_pretrained(self.model_image_id)

            # 2. Nạp AI Dịch thuật (Helsinki)
            print("  Đang nạp AI Số 2 (Dịch thuật)...")
            print("  Model: " + self.model_translate_id)
            self.processor_translate = AutoTokenizer.from_pretrained(self.model_translate_id)
            self.model_translate = AutoModelForSeq2SeqLM.from_pretrained(self.model_translate_id)

            self.check_health = True
            print("=" * 50)
            print("  ✅ Nạp 2 AI thành công! Sẵn sàng phân tích.")
            print("=" * 50)

        except Exception as e:
            print(f"  ❌ Lỗi khi nạp mô hình AI: {str(e)}")

    def health_check(self):
        """Kiểm tra AI đã sẵn sàng chưa"""
        return self.check_health

    def analyze_image(self, image_bytes: bytes) -> dict:
        """
        Phân tích ảnh: nhận bytes ảnh, trả về caption tiếng Anh + tiếng Việt
        """
        if not self.check_health:
            return {"error": "Hệ thống AI hiện không khả dụng."}

        try:
            # Mở ảnh từ bytes
            raw_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

            # BLIP: Tạo caption tiếng Anh
            inputs_image = self.processor_image(raw_image, return_tensors="pt")
            outputs_image = self.model_image.generate(**inputs_image)
            english_caption = self.processor_image.decode(outputs_image[0], skip_special_tokens=True)

            # Helsinki: Dịch sang tiếng Việt
            inputs_translate = self.processor_translate(english_caption, return_tensors="pt")
            outputs_translate = self.model_translate.generate(**inputs_translate)
            vietnamese_caption = self.processor_translate.decode(outputs_translate[0], skip_special_tokens=True)

            return {
                "english": english_caption,
                "vietnamese": vietnamese_caption
            }
        except Exception as e:
            return {"error": f"Lỗi xử lý ảnh: {str(e)}"}
