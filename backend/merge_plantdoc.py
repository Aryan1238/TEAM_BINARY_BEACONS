"""
Dataset Merger & Split Generator
Merges PlantDoc (field dataset) and Plant Disease Expert into standardized ImageFolder format.
"""
import os
import shutil
from pathlib import Path
from PIL import Image

PLANTDOC_TO_UNIFIED = {
    "Apple Scab Leaf": "Apple___Apple_scab",
    "Apple leaf": "Apple___healthy",
    "Apple rust leaf": "Apple___Cedar_apple_rust",
    "Bell_pepper leaf spot": "Pepper,_bell___Bacterial_spot",
    "Bell_pepper leaf": "Pepper,_bell___healthy",
    "Blueberry leaf": "Blueberry___healthy",
    "Cherry leaf": "Cherry_(including_sour)___healthy",
    "Corn Gray leaf spot": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn leaf blight": "Corn_(maize)___Northern_Leaf_Blight",
    "Corn rust leaf": "Corn_(maize)___Common_rust_",
    "Grape leaf black rot": "Grape___Black_rot",
    "Grape leaf": "Grape___healthy",
    "Peach leaf": "Peach___healthy",
    "Potato leaf early blight": "Potato___Early_blight",
    "Potato leaf late blight": "Potato___Late_blight",
    "Potato leaf": "Potato___healthy",
    "Raspberry leaf": "Raspberry___healthy",
    "Soyabean leaf": "Soybean___healthy",
    "Soybean leaf": "Soybean___healthy",
    "Squash Powdery mildew leaf": "Squash___Powdery_mildew",
    "Strawberry leaf": "Strawberry___healthy",
    "Tomato Early blight leaf": "Tomato___Early_blight",
    "Tomato Septoria leaf spot": "Tomato___Septoria_leaf_spot",
    "Tomato leaf bacterial spot": "Tomato___Bacterial_spot",
    "Tomato leaf late blight": "Tomato___Late_blight",
    "Tomato leaf mosaic virus": "Tomato___Tomato_mosaic_virus",
    "Tomato leaf yellow virus": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato leaf": "Tomato___healthy",
    "Tomato mold leaf": "Tomato___Leaf_Mold",
    "Tomato two spotted spider mites leaf": "Tomato___Spider_mites Two-spotted_spider_mite"
}

def merge_plantdoc():
    base_src = "dataset_raw/PlantDoc-Dataset"
    train_dest = "dataset/train"
    valid_dest = "dataset/valid"

    os.makedirs(train_dest, exist_ok=True)
    os.makedirs(valid_dest, exist_ok=True)

    copied = 0
    for split, dest in [("train", train_dest), ("test", valid_dest)]:
        split_path = os.path.join(base_src, split)
        if not os.path.exists(split_path):
            continue
        
        for folder_name in os.listdir(split_path):
            folder_path = os.path.join(split_path, folder_name)
            if not os.path.isdir(folder_path):
                continue
            
            target_class = PLANTDOC_TO_UNIFIED.get(folder_name)
            if not target_class:
                continue

            target_dir = os.path.join(dest, target_class)
            os.makedirs(target_dir, exist_ok=True)

            for img_name in os.listdir(folder_path):
                if img_name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    src_file = os.path.join(folder_path, img_name)
                    dest_file = os.path.join(target_dir, f"plantdoc_{img_name}")
                    try:
                        # Verify valid image file
                        with Image.open(src_file) as img:
                            img.verify()
                        shutil.copy2(src_file, dest_file)
                        copied += 1
                    except Exception:
                        pass

    print(f"✅ Successfully integrated {copied} PlantDoc field images into dataset/train and dataset/valid.")

if __name__ == "__main__":
    merge_plantdoc()
