"""
Phase 1: Classifier-Head-Only Fine-Tuning & Temperature Scaling Optimization
- Freezes all convolutional/backbone feature extractors
- Trains ONLY the Linear classification head (fast, lightweight, memory-efficient)
- Strong data augmentation (Rotation +-30 deg, ColorJitter, RandomResizedCrop, HorizontalFlip)
- Temperature scaling calibration on validation set
"""
import os
import sys
import json
import time
import copy
import random
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from models.image_classifier import ResNet9

PLANTVILLAGE_38_CLASSES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

CLASS_NAME_MAPPINGS = {
    'Apple___Apple_scab': ['Apple Apple scab', 'Apple Scab Leaf'],
    'Apple___Black_rot': ['Apple Black rot'],
    'Apple___Cedar_apple_rust': ['Apple Cedar apple rust', 'Apple rust leaf'],
    'Apple___healthy': ['Apple healthy', 'Apple leaf'],
    'Blueberry___healthy': ['Blueberry healthy', 'Blueberry leaf'],
    'Cherry_(including_sour)___Powdery_mildew': ['Cherry (including sour) Powdery mildew', 'Cherry Powdery mildew'],
    'Cherry_(including_sour)___healthy': ['Cherry (including_sour) healthy', 'Cherry healthy', 'Cherry leaf'],
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': ['Gray Leaf Spot in corn Leaf', 'Cercospora leaf spot', 'Corn Gray leaf spot'],
    'Corn_(maize)___Common_rust_': ['Common Rust in corn Leaf', 'Corn rust leaf'],
    'Corn_(maize)___Northern_Leaf_Blight': ['Blight in corn Leaf', 'Corn leaf blight'],
    'Corn_(maize)___healthy': ['Corn (maize) healthy', 'corn crop'],
    'Grape___Black_rot': ['Grape Black rot', 'grape leaf black rot'],
    'Grape___Esca_(Black_Measles)': ['Grape Esca Black Measles'],
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': ['Grape Leaf blight Isariopsis Leaf Spot'],
    'Grape___healthy': ['Grape healthy', 'grape leaf', 'Grape leaf'],
    'Orange___Haunglongbing_(Citrus_greening)': ['Orange Haunglongbing Citrus greening'],
    'Peach___Bacterial_spot': ['Peach healthy', 'Peach leaf'],
    'Peach___healthy': ['Peach healthy', 'Peach leaf'],
    'Pepper,_bell___Bacterial_spot': ['Pepper bell Bacterial spot', 'Bell_pepper leaf spot'],
    'Pepper,_bell___healthy': ['Pepper bell healthy', 'Bell_pepper leaf'],
    'Potato___Early_blight': ['Potato Early blight', 'Potato leaf early blight'],
    'Potato___Late_blight': ['Potato Late blight', 'Potato leaf late blight'],
    'Potato___healthy': ['Potato healthy', 'Potato leaf', 'potato crop'],
    'Raspberry___healthy': ['Raspberry healthy', 'Raspberry leaf'],
    'Soybean___healthy': ['Soybean healthy', 'Soybean leaf', 'Soyabean leaf'],
    'Squash___Powdery_mildew': ['Squash Powdery mildew leaf'],
    'Strawberry___Leaf_scorch': ['Strawberry Leaf scorch'],
    'Strawberry___healthy': ['Strawberry healthy', 'Strawberry leaf'],
    'Tomato___Bacterial_spot': ['Tomato Bacterial spot', 'Tomato leaf bacterial spot'],
    'Tomato___Early_blight': ['Tomato Early blight', 'Tomato Early blight leaf'],
    'Tomato___Late_blight': ['Tomato Late blight', 'Tomato leaf late blight'],
    'Tomato___Leaf_Mold': ['Tomato Leaf Mold', 'Tomato mold leaf'],
    'Tomato___Septoria_leaf_spot': ['Tomato Septoria leaf spot'],
    'Tomato___Spider_mites Two-spotted_spider_mite': ['Tomato Spider mites Two spotted spider mite', 'Tomato two spotted spider mites leaf'],
    'Tomato___Target_Spot': ['Tomato Target Spot'],
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': ['Tomato leaf yellow virus'],
    'Tomato___Tomato_mosaic_virus': ['Tomato Tomato mosaic virus', 'Tomato leaf mosaic virus'],
    'Tomato___healthy': ['Tomato healthy', 'Tomato leaf']
}

KAGGLE_DB = '/Users/aryanmishra/.cache/kagglehub/datasets/sadmansakibmahi/plant-disease-expert/versions/17/Image Data base/Image Data base'
PLANTDOC_DIR = 'dataset_raw/PlantDoc-Dataset'

BATCH_SIZE = 32
IMAGE_SIZE = 256
DEVICE = torch.device('cpu')  # Stable, fast CPU execution for head-only fine-tuning

print(f'🔥 [Optimization Engine] Initialized on device: {DEVICE}')

class FastImageDataset(Dataset):
    def __init__(self, samples, transform=None):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        try:
            with Image.open(path) as img:
                img = img.convert('RGB')
                if self.transform:
                    img = self.transform(img)
                return img, label
        except Exception:
            blank = torch.zeros(3, IMAGE_SIZE, IMAGE_SIZE)
            return blank, label

def load_data():
    class_to_idx = {c: i for i, c in enumerate(PLANTVILLAGE_38_CLASSES)}
    class_images = {c: [] for c in PLANTVILLAGE_38_CLASSES}

    # 1. From Kaggle Database
    if os.path.exists(KAGGLE_DB):
        for folder in os.listdir(KAGGLE_DB):
            folder_path = os.path.join(KAGGLE_DB, folder)
            if not os.path.isdir(folder_path):
                continue
            for std_cls, aliases in CLASS_NAME_MAPPINGS.items():
                if folder in aliases or folder.lower() in [a.lower() for a in aliases]:
                    for f in os.listdir(folder_path):
                        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                            class_images[std_cls].append(os.path.join(folder_path, f))

    # 2. From PlantDoc
    for split in ['train', 'test']:
        sp = os.path.join(PLANTDOC_DIR, split)
        if os.path.exists(sp):
            for folder in os.listdir(sp):
                folder_path = os.path.join(sp, folder)
                if not os.path.isdir(folder_path):
                    continue
                for std_cls, aliases in CLASS_NAME_MAPPINGS.items():
                    if folder in aliases or folder.lower() in [a.lower() for a in aliases]:
                        for f in os.listdir(folder_path):
                            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                                class_images[std_cls].append(os.path.join(folder_path, f))

    train_samples = []
    valid_samples = []

    random.seed(42)
    for c, files in class_images.items():
        random.shuffle(files)
        selected = files[:60]  # Fast 60 images/class for lightweight 5-minute head calibration
        if len(selected) == 0:
            continue
        n_val = max(3, int(len(selected) * 0.20))
        val_f = selected[:n_val]
        train_f = selected[n_val:]

        for f in train_f:
            train_samples.append((f, class_to_idx[c]))
        for f in val_f:
            valid_samples.append((f, class_to_idx[c]))

    random.shuffle(train_samples)
    random.shuffle(valid_samples)
    print(f'✅ Loaded {len(train_samples)} training samples and {len(valid_samples)} validation samples across 38 classes.')
    return train_samples, valid_samples

def evaluate(model, loader, criterion, temp=1.0):
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            logits = model(images) / temp
            loss = criterion(logits, labels)
            total_loss += loss.item() * images.size(0)
            _, preds = torch.max(logits, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    acc = 100.0 * correct / max(1, total)
    loss = total_loss / max(1, total)
    return acc, loss

def run_optimization():
    train_samples, valid_samples = load_data()

    train_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(30),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor()
    ])

    valid_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor()
    ])

    train_ds = FastImageDataset(train_samples, transform=train_transform)
    valid_ds = FastImageDataset(valid_samples, transform=valid_transform)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    valid_loader = DataLoader(valid_ds, batch_size=BATCH_SIZE, shuffle=False)

    # 1. Load existing trained checkpoint
    model_path = 'backend/models/plant-disease-model-complete.pth'
    print(f'📦 Loading base model from {model_path}...')
    model = torch.load(model_path, map_location=DEVICE, weights_only=False)

    criterion = nn.CrossEntropyLoss()

    # Initial Validation Accuracy
    val_acc_before, val_loss_before = evaluate(model, valid_loader, criterion)
    print(f'📊 [BEFORE FINE-TUNE] Validation Accuracy: {val_acc_before:.2f}% | Loss: {val_loss_before:.4f}')

    # Freeze all conv backbone layers; unfreeze only classifier head
    for name, param in model.named_parameters():
        if 'classifier' in name:
            param.requires_grad = True
        else:
            param.requires_grad = False

    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f'🔒 Backbone frozen. Trainable parameters in classifier head: {trainable_params}')

    optimizer = optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3, weight_decay=1e-4)

    print('\n🚀 Fine-tuning classifier head with robust data augmentation (4 epochs)...')
    for epoch in range(1, 5):
        model.train()
        r_loss = 0.0
        r_correct = 0
        r_total = 0
        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            r_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            r_correct += (preds == labels).sum().item()
            r_total += labels.size(0)

        t_acc = 100.0 * r_correct / max(1, r_total)
        v_acc, v_loss = evaluate(model, valid_loader, criterion)
        print(f'  Epoch {epoch}/4 | Train Acc: {t_acc:.2f}% | Val Acc: {v_acc:.2f}% (Loss: {v_loss:.4f})')

    val_acc_after, val_loss_after = evaluate(model, valid_loader, criterion)
    print(f'\n📊 [AFTER FINE-TUNE] Validation Accuracy: {val_acc_after:.2f}% | Loss: {val_loss_after:.4f}')

    # Phase 2: Temperature Scaling Calibration
    print('\n🌡️ [PHASE 2] Calibrating Temperature Scaling parameter (T)...')
    best_temp = 1.0
    best_nll = float('inf')
    for t_val in [0.8, 1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.5]:
        _, nll = evaluate(model, valid_loader, criterion, temp=t_val)
        if nll < best_nll:
            best_nll = nll
            best_temp = t_val

    print(f'✅ Optimal Temperature Parameter: T = {best_temp:.2f} (Calibrated NLL: {best_nll:.4f})')

    # Save calibrated model
    os.makedirs('backend/models', exist_ok=True)
    save_path = 'backend/models/plant-disease-model-calibrated.pth'
    torch.save({
        'model_state_dict': model.state_dict(),
        'temperature': best_temp,
        'val_accuracy_before': val_acc_before,
        'val_accuracy_after': val_acc_after,
        'class_names': PLANTVILLAGE_38_CLASSES
    }, save_path)
    print(f'💾 Saved calibrated checkpoint to {save_path}')

    return model, best_temp, val_acc_before, val_acc_after

if __name__ == '__main__':
    run_optimization()
