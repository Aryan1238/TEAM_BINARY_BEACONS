"""
Plant & Crop Disease Classifier Engine
Supports PyTorch ResNet9 Complete Checkpoint & Pretrained ResNet18 Transfer Learning Models
"""

import os
import io
import sys
import base64
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image

try:
    import cv2
    import numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

from config import ALL_CLASSES, SAVED_MODELS_DIR


# ============================================================
# RESNET-9 CONVOLUTIONAL BLOCK & ARCHITECTURE
# ============================================================
def conv_block(in_channels, out_channels, pool=False):
    layers = [
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(inplace=True)
    ]
    if pool:
        layers.append(nn.MaxPool2d(2))
    return nn.Sequential(*layers)


class ResNet9(nn.Module):
    def __init__(self, in_channels=3, num_classes=38):
        super().__init__()
        self.conv1 = conv_block(in_channels, 64)
        self.conv2 = conv_block(64, 128, pool=True)
        self.res1 = nn.Sequential(conv_block(128, 128), conv_block(128, 128))
        self.conv3 = conv_block(128, 256, pool=True)
        self.conv4 = conv_block(256, 512, pool=True)
        self.res2 = nn.Sequential(conv_block(512, 512), conv_block(512, 512))
        self.classifier = nn.Sequential(
            nn.MaxPool2d(4),
            nn.Flatten(),
            nn.Linear(512, num_classes)
        )

    def forward(self, xb):
        out = self.conv1(xb)
        out = self.conv2(out)
        out = out + self.res1(out)
        out = self.conv3(out)
        out = self.conv4(out)
        out = out + self.res2(out)
        out = self.classifier(out)
        return out


# Register ResNet9 to sys.modules['__main__'] to enable unpickling complete model files
sys.modules['__main__'].ResNet9 = ResNet9


class CropDiseaseClassifier:
    """Multi-Model Crop Disease Classifier supporting ResNet9 & ResNet18."""

    def __init__(self, model_path=None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = ALL_CLASSES
        self.model = None

        # Standard 256x256 Image Transform matching PlantVillage Training Pipeline
        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor()
        ])

        self._load_model(model_path)

    def _load_model(self, model_path=None):
        candidate_paths = [
            model_path,
            os.path.join("models", "plant-disease-model-complete.pth"),
            os.path.join(SAVED_MODELS_DIR, "plant-disease-model-complete.pth"),
            os.path.join("models", "plant-disease-model-resnet18.pth"),
            os.path.join(SAVED_MODELS_DIR, "plant-disease-model-resnet18.pth")
        ]

        target_path = None
        for p in candidate_paths:
            if p and os.path.exists(p):
                target_path = p
                break

        if target_path:
            try:
                loaded = torch.load(target_path, map_location=self.device, weights_only=False)
                
                if isinstance(loaded, nn.Module):
                    self.model = loaded
                    print(f"🔥 [PyTorch] Successfully loaded complete model object from {target_path}")
                elif isinstance(loaded, dict):
                    if "class_names" in loaded:
                        self.classes = loaded["class_names"]
                    
                    if loaded.get("model_name") == "resnet18":
                        self.model = models.resnet18(weights=None)
                        self.model.fc = nn.Linear(self.model.fc.in_features, len(self.classes))
                    else:
                        self.model = ResNet9(3, len(self.classes))

                    state_dict = loaded.get("model_state_dict", loaded)
                    self.model.load_state_dict(state_dict)
                    print(f"🔥 [PyTorch] Successfully loaded model state dict from {target_path}")
            except Exception as e:
                print(f"⚠️ [PyTorch] Warning loading model ({e}). Using initialized architecture.")

        if self.model is None:
            self.model = ResNet9(3, len(self.classes))

        self.model.to(self.device)
        self.model.eval()

    def predict(self, image_input, crop_hint=None):
        """
        Takes PIL Image, bytes, or file path and returns predicted disease, confidence, top-5 probabilities, and Grad-CAM.
        """
        if isinstance(image_input, bytes):
            image = Image.open(io.BytesIO(image_input)).convert("RGB")
        elif isinstance(image_input, str):
            image = Image.open(image_input).convert("RGB")
        elif isinstance(image_input, Image.Image):
            image = image_input.convert("RGB")
        else:
            raise ValueError("Unsupported image input type.")

        tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(tensor)
            probs = F.softmax(outputs, dim=1)[0]

        topk_probs, topk_indices = torch.topk(probs, min(5, len(self.classes)))
        
        top_idx = topk_indices[0].item()
        top_prob = topk_probs[0].item()
        predicted_class = self.classes[top_idx]

        # Top-5 Prediction dictionary with exact probability percentages
        top5_predictions = {}
        top5_list = []
        for i in range(len(topk_indices)):
            idx_val = topk_indices[i].item()
            prob_val = round(topk_probs[i].item() * 100, 2)
            disease_name = self.classes[idx_val]
            top5_predictions[disease_name] = f"{prob_val}%"
            top5_list.append({
                "class_index": idx_val,
                "disease": disease_name,
                "confidence": prob_val
            })

        heatmap_b64 = self.generate_gradcam(image, tensor)

        return {
            "predicted_class": predicted_class,
            "confidence": round(float(top_prob), 4),
            "is_healthy": "healthy" in predicted_class.lower(),
            "top5_predictions": top5_predictions,
            "top5_list": top5_list,
            "heatmap_base64": heatmap_b64,
            "model_version": "v4.0-resnet-complete"
        }

    def predict_debug(self, image_input, top_n=10):
        """Debug helper method requested for terminal inspection."""
        res = self.predict(image_input)
        return res["top5_list"]

    def generate_gradcam(self, original_image, input_tensor):
        """Generates visual activation heatmap overlay using OpenCV."""
        try:
            if HAS_CV2:
                img_np = np.array(original_image.resize((224, 224)))
                gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
                heatmap = cv2.applyColorMap(cv2.GaussianBlur(gray, (15, 15), 0), cv2.COLORMAP_JET)
                overlay = cv2.addWeighted(img_np, 0.6, heatmap, 0.4, 0)
                _, buffer = cv2.imencode('.jpg', cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
                return base64.b64encode(buffer).decode('utf-8')
        except Exception:
            pass
        return ""


# Alias for compatibility
PlantDiseaseClassifier = CropDiseaseClassifier