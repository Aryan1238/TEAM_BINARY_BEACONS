"""
Complete Fast Image Loader & Train Pipeline
- Merges 58-class Plant Disease Expert + PlantDoc into balanced class-sampled dataset
- Direct Training on Apple Silicon MPS
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

KAGGLE_DB_DIR = "/Users/aryanmishra/.cache/kagglehub/datasets/sadmansakibmahi/plant-disease-expert/versions/17/Image Data base/Image Data base"
PLANTDOC_DIR = "dataset_raw/PlantDoc-Dataset"

BATCH_SIZE = 64
IMAGE_SIZE = 256
SAMPLES_PER_CLASS = 180  # Balanced sampling for fast 30-min convergence
VALID_SPLIT = 0.20
MAX_TRAIN_TIME_SECONDS = 90 * 60

if torch.backends.mps.is_available():
    DEVICE = torch.device("mps")
elif torch.cuda.is_available():
    DEVICE = torch.device("cuda")
else:
    DEVICE = torch.device("cpu")

print(f"🔥 [Training Engine] Using hardware device: {DEVICE}")

# Map folders to standardized class names
def standardize_name(raw):
    name = raw.replace(" in corn Leaf", "").replace(" in rice leaf", "").replace(" in tea", "")
    name = name.replace(" (including sour)", "").replace(" (including_sour)", "").replace(" (maize)", "")
    name = name.replace(" ", "_").strip()
    return name

class DirectPlantDataset(Dataset):
    def __init__(self, items, transform=None):
        self.items = items
        self.transform = transform

    def __len__(self):
        return len(self.items)

    def __getitem__(self, idx):
        path, label = self.items[idx]
        try:
            with Image.open(path) as img:
                img = img.convert('RGB')
                if self.transform:
                    img = self.transform(img)
                return img, label
        except Exception:
            # Return blank if corrupted
            blank = Image.new('RGB', (IMAGE_SIZE, IMAGE_SIZE), (0, 0, 0))
            if self.transform:
                blank = self.transform(blank)
            return blank, label

def prepare_data():
    class_to_files = {}

    # 1. Load from Kaggle Database
    if os.path.exists(KAGGLE_DB_DIR):
        for folder in sorted(os.listdir(KAGGLE_DB_DIR)):
            p = os.path.join(KAGGLE_DB_DIR, folder)
            if not os.path.isdir(p):
                continue
            std_name = standardize_name(folder)
            if std_name not in class_to_files:
                class_to_files[std_name] = []
            for f in os.listdir(p):
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    class_to_files[std_name].append(os.path.join(p, f))

    # 2. Load from PlantDoc
    for split in ['train', 'test']:
        sp = os.path.join(PLANTDOC_DIR, split)
        if os.path.exists(sp):
            for folder in os.listdir(sp):
                p = os.path.join(sp, folder)
                if not os.path.isdir(p):
                    continue
                std_name = standardize_name(folder)
                if std_name not in class_to_files:
                    class_to_files[std_name] = []
                for f in os.listdir(p):
                    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                        class_to_files[std_name].append(os.path.join(p, f))

    classes = sorted(list(class_to_files.keys()))
    class_to_idx = {c: i for i, c in enumerate(classes)}

    train_items = []
    valid_items = []

    random.seed(42)
    for c, files in class_to_files.items():
        random.shuffle(files)
        selected = files[:SAMPLES_PER_CLASS]
        n_val = max(5, int(len(selected) * VALID_SPLIT))
        val_f = selected[:n_val]
        train_f = selected[n_val:]

        for f in train_f:
            train_items.append((f, class_to_idx[c]))
        for f in val_f:
            valid_items.append((f, class_to_idx[c]))

    random.shuffle(train_items)
    random.shuffle(valid_items)

    print(f"✅ Prepared {len(classes)} classes | Train: {len(train_items)} | Valid: {len(valid_items)}")
    
    with open("backend/trained_classes_58.json", "w") as f:
        json.dump(classes, f, indent=2)

    return train_items, valid_items, classes

def train_expanded():
    train_items, valid_items, classes = prepare_data()
    num_classes = len(classes)

    train_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ToTensor()
    ])

    valid_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor()
    ])

    train_ds = DirectPlantDataset(train_items, transform=train_transform)
    valid_ds = DirectPlantDataset(valid_items, transform=valid_transform)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=2)
    valid_loader = DataLoader(valid_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=2)

    model = ResNet9(in_channels=3, num_classes=num_classes).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=5e-4, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=2)

    best_acc = 0.0
    best_weights = copy.deepcopy(model.state_dict())
    start_time = time.time()
    last_telemetry_time = start_time

    print("\n" + "="*70)
    print(f"🚀 TRAINING {num_classes}-CLASS MERGED RESNET-9 (HARD 90-MIN LIMIT)")
    print("="*70 + "\n")

    for epoch in range(1, 25):
        elapsed_total = time.time() - start_time
        if elapsed_total >= MAX_TRAIN_TIME_SECONDS:
            print(f"\n⏰ Time limit reached ({elapsed_total/60:.1f}m). Stopping.")
            break

        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = 100.0 * correct / max(1, total)
        train_loss = running_loss / max(1, total)

        model.eval()
        v_loss = 0.0
        v_correct = 0
        v_total = 0
        with torch.no_grad():
            for images, labels in valid_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, labels)
                v_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                v_correct += (preds == labels).sum().item()
                v_total += labels.size(0)

        val_acc = 100.0 * v_correct / max(1, v_total)
        val_loss = v_loss / max(1, v_total)
        scheduler.step(val_acc)

        curr_time = time.time()
        elapsed_min = (curr_time - start_time) / 60.0

        if val_acc > best_acc:
            best_acc = val_acc
            best_weights = copy.deepcopy(model.state_dict())
            print(f"⭐ Epoch {epoch:2d}/24 | Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f} Val Acc: {val_acc:.2f}% (BEST) | Elapsed: {elapsed_min:.1f}m")
        else:
            print(f"  Epoch {epoch:2d}/24 | Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f} Val Acc: {val_acc:.2f}% | Elapsed: {elapsed_min:.1f}m")

        if curr_time - last_telemetry_time >= 15 * 60:
            print(f"\n📡 [15-MIN TELEMETRY]: Epoch {epoch}, Best Val Acc: {best_acc:.2f}%, Elapsed: {elapsed_min:.1f}m\n")
            last_telemetry_time = curr_time

    # Save best checkpoint
    model.load_state_dict(best_weights)
    os.makedirs("models", exist_ok=True)
    save_path = "models/plant-disease-model-merged.pth"
    torch.save({
        "model_state_dict": model.state_dict(),
        "class_names": classes,
        "num_classes": num_classes,
        "validation_accuracy": best_acc
    }, save_path)
    print(f"\n✅ Finished! Best model saved to {save_path} with {best_acc:.2f}% Val Accuracy.")

if __name__ == "__main__":
    train_expanded()
