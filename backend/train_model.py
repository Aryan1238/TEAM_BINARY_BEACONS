import os
import copy
import torch
import torch.nn as nn
import torch.optim as optim

from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader


# ============================================================
# CONFIG
# ============================================================

TRAIN_DIR = "dataset/train"
VALID_DIR = "dataset/valid"

MODEL_PATH = "models/plant-disease-model-resnet18.pth"

BATCH_SIZE = 32
IMAGE_SIZE = 224

EPOCHS = 15
LEARNING_RATE = 1e-4

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", DEVICE)


# ============================================================
# TRANSFORMS
# ============================================================

train_transform = transforms.Compose([

    transforms.Resize((256, 256)),

    transforms.RandomResizedCrop(
        IMAGE_SIZE,
        scale=(0.75, 1.0)
    ),

    transforms.RandomHorizontalFlip(),

    transforms.RandomVerticalFlip(p=0.1),

    transforms.RandomRotation(20),

    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2,
        saturation=0.2,
        hue=0.05
    ),

    transforms.ToTensor(),

    # ImageNet normalization
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


valid_transform = transforms.Compose([

    transforms.Resize((256, 256)),

    transforms.CenterCrop(IMAGE_SIZE),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def train():
    if not os.path.exists(TRAIN_DIR) or not os.path.exists(VALID_DIR):
        print(f"⚠️ Dataset directories '{TRAIN_DIR}' or '{VALID_DIR}' not found.")
        print("Please place PlantVillage dataset in dataset/train and dataset/valid to execute full training.")
        return

    # ============================================================
    # DATASET
    # ============================================================

    train_dataset = datasets.ImageFolder(
        TRAIN_DIR,
        transform=train_transform
    )

    valid_dataset = datasets.ImageFolder(
        VALID_DIR,
        transform=valid_transform
    )

    print()
    print("Classes:", len(train_dataset.classes))
    print("Training images:", len(train_dataset))
    print("Validation images:", len(valid_dataset))

    print()
    print("Class mapping:")
    print(train_dataset.class_to_idx)

    # IMPORTANT
    assert train_dataset.class_to_idx == valid_dataset.class_to_idx

    # ============================================================
    # DATALOADERS
    # ============================================================

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=2,
        pin_memory=True if DEVICE.type == "cuda" else False
    )

    valid_loader = DataLoader(
        valid_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=2,
        pin_memory=True if DEVICE.type == "cuda" else False
    )

    # ============================================================
    # MODEL
    # ============================================================

    print()
    print("Loading pretrained ResNet18...")

    weights = models.ResNet18_Weights.DEFAULT
    model = models.resnet18(weights=weights)

    num_features = model.fc.in_features
    model.fc = nn.Linear(
        num_features,
        len(train_dataset.classes)
    )

    model = model.to(DEVICE)

    # ============================================================
    # LOSS & OPTIMIZER
    # ============================================================

    criterion = nn.CrossEntropyLoss()

    optimizer = optim.AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=1e-4
    )

    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer,
        mode="max",
        factor=0.3,
        patience=2
    )

    # ============================================================
    # TRAINING FUNCTIONS
    # ============================================================

    def train_one_epoch():
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predictions = torch.max(outputs, dim=1)
            correct += (predictions == labels).sum().item()
            total += labels.size(0)

        accuracy = 100 * correct / total
        return running_loss / len(train_loader), accuracy

    def validate():
        model.eval()
        running_loss = 0.0
        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in valid_loader:
                images = images.to(DEVICE)
                labels = labels.to(DEVICE)

                outputs = model(images)
                loss = criterion(outputs, labels)

                running_loss += loss.item()
                _, predictions = torch.max(outputs, dim=1)
                correct += (predictions == labels).sum().item()
                total += labels.size(0)

        accuracy = 100 * correct / total
        return running_loss / len(valid_loader), accuracy

    # ============================================================
    # TRAIN LOOP
    # ============================================================

    best_accuracy = 0.0
    best_weights = copy.deepcopy(model.state_dict())

    print()
    print("=" * 60)
    print("STARTING TRAINING")
    print("=" * 60)

    for epoch in range(EPOCHS):
        train_loss, train_acc = train_one_epoch()
        valid_loss, valid_acc = validate()

        scheduler.step(valid_acc)

        print()
        print(f"Epoch [{epoch + 1}/{EPOCHS}]")
        print(f"Train Loss: {train_loss:.4f}")
        print(f"Train Accuracy: {train_acc:.2f}%")
        print(f"Validation Loss: {valid_loss:.4f}")
        print(f"Validation Accuracy: {valid_acc:.2f}%")
        print(f"Learning Rate: {optimizer.param_groups[0]['lr']:.6f}")

        if valid_acc > best_accuracy:
            best_accuracy = valid_acc
            best_weights = copy.deepcopy(model.state_dict())
            print("🔥 New best model!")

    # ============================================================
    # RESTORE & SAVE BEST MODEL
    # ============================================================

    model.load_state_dict(best_weights)

    os.makedirs(
        os.path.dirname(MODEL_PATH),
        exist_ok=True
    )

    checkpoint = {
        "model_state_dict": model.state_dict(),
        "class_names": train_dataset.classes,
        "class_to_idx": train_dataset.class_to_idx,
        "image_size": IMAGE_SIZE,
        "model_name": "resnet18",
        "validation_accuracy": best_accuracy
    }

    torch.save(checkpoint, MODEL_PATH)

    print()
    print("=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)
    print(f"Best validation accuracy: {best_accuracy:.2f}%")
    print("Saved model:", MODEL_PATH)


if __name__ == "__main__":
    train()
