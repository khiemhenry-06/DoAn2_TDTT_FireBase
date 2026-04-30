import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from datetime import datetime

# Khởi tạo Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def export_database():
    print("Downloading data from Firebase...")
    all_data = {}
    
    # Ta phải dùng collection_group để quét toàn bộ các collection tên là 'history'
    history_docs = db.collection_group('history').stream()
    
    for record in history_docs:
        doc_data = record.to_dict()
        # Lấy ID của user từ đường dẫn (analyses/user_id/history/doc_id)
        user_id = record.reference.parent.parent.id
        
        if user_id not in all_data:
            all_data[user_id] = []
            
        # Xử lý datetime để có thể lưu vào file JSON
        if 'created_at' in doc_data:
            doc_data['created_at'] = str(doc_data['created_at'])
            
        all_data[user_id].append(doc_data)
            
    # Lưu vào file JSON
    output_file = "database_export.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=4)
        
    print(f"Success! Data exported to: {output_file}")

if __name__ == "__main__":
    export_database()
