import os
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

MODEL_PATH = 'best_grapho_model.h5' 
model = tf.keras.models.load_model(MODEL_PATH)

LABELS = ['Tipe 1', 'Tipe 2', 'Tipe 3', 'Tipe 4', 'Tipe 5', 
          'Tipe 6', 'Tipe 7', 'Tipe 8', 'Tipe 9']

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'webp'}

def allowed_file(filename):
    """Validasi ekstensi file gambar."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_stream):
    """Preprocessing gambar untuk model prediksi."""
    file_bytes = np.frombuffer(image_stream.read(), np.uint8)
    
    if len(file_bytes) == 0:
        raise ValueError("File gambar kosong atau tidak dapat dibaca")
    
    img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        raise ValueError("Format gambar tidak valid atau file corrupt")
    
    img = cv2.resize(img, (128, 128))
    
    img = cv2.equalizeHist(img)
    img = cv2.bitwise_not(img) 
    
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    
    return img

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint dengan informasi status model."""
    return jsonify({
        'status': 'active',
        'service': 'Grapholyze AI Service',
        'model': MODEL_PATH,
        'labels': LABELS,
        'message': 'Server Grapholyze Aktif! (Histogram Equalization Ready)'
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file gambar. Kirim dengan field "file"'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Nama file kosong'}), 400
    
    if file.filename and not allowed_file(file.filename):
        return jsonify({'error': f'Format file tidak didukung. Gunakan: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
    
    try:
        processed_img = preprocess_image(file.stream)
        
        prediction = model.predict(processed_img)
        class_idx = np.argmax(prediction)
        confidence = float(np.max(prediction))
        
        result_label = LABELS[class_idx]
        
        print(f"[Predict] Result: {result_label}, Confidence: {confidence*100:.2f}%")
        
        return jsonify({
            'status': 'success',
            'prediction': result_label,
            'confidence': f"{confidence*100:.2f}%",
            'message': 'Analisis Grafologi Selesai'
        })
        
    except ValueError as ve:
        return jsonify({'error': f'Gambar tidak valid: {str(ve)}'}), 400
    except Exception as e:
        print(f"[Predict Error] {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
