"""
Production Training Pipeline for Merged Plant Disease Dataset
- Target Architecture: ResNet-9 (Matching browser WebGL/WASM ONNX spec)
- Hardware: Apple Silicon Metal Performance Shaders (MPS)
- Hard Time Limit: 90 Minutes with early stopping and 15-minute telemetry checkpoints
"""
import os
import sys
import time
import json
import copy
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

sys.path.insert(0, os.path.dirname(__file__))
from models.image_classifier import ResNet9

TRAIN_DIR = "dataset/train"
VALID_DIR = "dataset/valid"
SAVED_MODEL_PATH = "models/plant-disease-model-merged.pth"

BATCH_SIZE = 64
IMAGE_SIZE = 256
MAX_TRAIN_TIME_SECONDS = 90 * 60  # Strict 90-minute hard cutoff
TELEMETRY_INTERVAL_SECONDS = 15 * 60  # 15-minute telemetry report
EPOCHS = 30
LEARNING_RATE = 4e-4

if torch.backends.mps.is_available():
    DEVICE = torch.device("mps")
elif torch.cuda.is_available():
    DEVICE = torch.device("cuda")
else:
    DEVICE = torch.device("cpu")

print(f"🔥 [Training Engine] Initialized on device: {DEVICE}")

train_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
    transforms.ToTensor()
])

valid_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor()
])

def run_training():
    if not os.path.exists(TRAIN_DIR) or not os.path.exists(VALID_DIR):
        print(f"⚠️ Directories {TRAIN_DIR} or {VALID_DIR} not found.")
        return

    train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=train_transform)
    valid_dataset = datasets.ImageFolder(VALID_DIR, transform=valid_transform)
    
    num_classes = len(train_dataset.classes)
    print(f"✅ Loaded dataset: {len(train_dataset)} training images, {len(valid_dataset)} validation images across {num_classes} classes.")

    with open("backend/trained_class_names.json", "w") as f:
        json.dump(train_dataset.classes, f, indent=2)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=2)
    valid_loader = DataLoader(valid_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=2)

    model = ResNet9(in_channels=3, num_classes=num_classes).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=2)

    best_acc = 0.0
    best_weights = copy.deepcopy(model.state_dict())
    start_time = time.time()
    last_telemetry_time = start_time

    print("\n" + "="*70)
    print("🚀 STARTING 90-MINUTE TIME-BOUND RESNET-9 TRAINING")
    print("="*70 + "\n")

    for epoch in range(1, EPOCHS + 1):
        elapsed_total = time.time() - start_time
        if elapsed_total >= MAX_TRAIN_TIME_SECONDS:
            print(f"\n⏰ HARD TIME LIMIT REACHED ({elapsed_total/60:.1f} min >= 90 min). Stopping training safely.")
            break

        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            if time.time() - start_time >= MAX_TRAIN_TIME_SECONDS:
                break
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

        # Validation pass
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
            print(f"⭐ Epoch {epoch:2d}/{EPOCHS} | Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f} Val Acc: {val_acc:.2f}% (BEST) | Elapsed: {elapsed_min:.1f}m")
        else:
            print(f"  Epoch {epoch:2d}/{EPOCHS} | Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f} Val Acc: {val_acc:.2f}% | Elapsed: {elapsed_min:.1f}m")

        # Telemetry check every 15 minutes
        if curr_time - last_telemetry_time >= TELEMETRY_INTERVAL_SECONDS:
            print(f"\n📡 [15-MIN TELEMETRY CHECKPOINT]: Current Epoch: {epoch}, Best Val Accuracy: {best_acc:.2f}%, Total Elapsed: {elapsed_min:.1f} minutes\n")
            last_telemetry_time = curr_time

    # Save best checkpoint
    model.load_state_dict(best_weights)
    os.makedirs(os.path.dirname(SAVED_MODEL_PATH), exist_ok=True)
    torch.save({
        "model_state_dict": model.state_dict(),
        "class_names": train_dataset.classes,
        "num_classes": num_classes,
        "validation_accuracy": best_acc
    }, SAVED_MODEL_PATH)
    print(f"\n✅ Training Complete. Best Checkpoint Saved to {SAVED_MODEL_PATH} (Accuracy: {best_acc:.2f}%)")

if __name__ == "__main__":
    run_training()
