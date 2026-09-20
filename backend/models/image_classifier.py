"""
Plant & Crop Disease Classifier Engine
Powered exclusively by PyTorch EfficientNet-B0 (38 Classes)
ImageNet-1K Preprocessing: 224x224, Normalized, Eval Mode, Genuine Grad-CAM
"""

import os
import io
import gc
import sys
import base64
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image

from config import ALL_CLASSES, EFFICIENTNET_CHECKPOINT_PATH, PREPROCESSING_CONFIG


def parse_class_name(class_key: str):
    """Parses unified class key into human-readable crop and disease names."""
    if "___" in class_key:
        parts = class_key.split("___")
        crop = parts[0].replace("_", " ").replace("(maize)", "").strip().title()
        disease = parts[1].replace("_", " ").strip().title()
    else:
        crop = "Crop Leaf"
        disease = class_key.replace("_", " ").title()

    if "healthy" in disease.lower():
        disease_title = f"Healthy {crop}"
    else:
        disease_title = disease

    return crop, disease_title


class CropDiseaseClassifier:
    """Production Crop Disease Classifier using frozen EfficientNet-B0 checkpoint."""

    def __init__(self, model_path=None):
        force_cpu = os.getenv("FORCE_CPU", "0") == "1"
        if force_cpu:
            self.device = torch.device("cpu")
        elif torch.cuda.is_available():
            self.device = torch.device("cuda")
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps")
        else:
            self.device = torch.device("cpu")

        self.classes = list(ALL_CLASSES)
        self.model = None
        self.checkpoint_path = None

        # Production Preprocessing Matching Evaluation: Resize(256) -> CenterCrop(224) -> ToTensor() -> ImageNet Normalization
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=PREPROCESSING_CONFIG["mean"],
                std=PREPROCESSING_CONFIG["std"]
            )
        ])

        self._load_model(model_path)
        self._verify_startup()

    def _load_model(self, model_path=None):
        target_path = model_path or EFFICIENTNET_CHECKPOINT_PATH

        if not os.path.exists(target_path):
            raise FileNotFoundError(
                f"[FATAL] EfficientNet-B0 checkpoint not found at: {target_path}\n"
                f"Cannot proceed with inference. ResNet fallback is disabled."
            )

        print(f"📦 [PyTorch] Loading EfficientNet-B0 checkpoint: {target_path} on {self.device}...")
        checkpoint = torch.load(target_path, map_location="cpu", weights_only=False)

        # Confirm 38-class mapping from checkpoint
        if "class_to_idx" in checkpoint:
            class_to_idx = checkpoint["class_to_idx"]
            idx_to_class = {v: k for k, v in class_to_idx.items()}
            self.classes = [idx_to_class[i] for i in range(len(idx_to_class))]
            assert len(self.classes) == 38, f"Expected 38 classes, found {len(self.classes)}"

        # Instantiate torchvision EfficientNet-B0
        self.model = models.efficientnet_b0(weights=None)
        in_features = self.model.classifier[1].in_features
        self.model.classifier = nn.Sequential(
            nn.Dropout(p=0.2, inplace=True),
            nn.Linear(in_features, len(self.classes))
        )

        state_dict = checkpoint.get("model_state_dict", checkpoint)
        load_result = self.model.load_state_dict(state_dict, strict=True)
        print(f"✅ [PyTorch] Checkpoint loaded successfully: {load_result}")

        self.model.to(self.device)
        self.model.eval()
        self.checkpoint_path = target_path

    def _verify_startup(self):
        """Validates that model is in eval mode and produces (1, 38) logits."""
        assert self.model is not None, "Model failed to initialize."
        assert not self.model.training, "Model is not in eval() mode."
        with torch.inference_mode():
            dummy = torch.zeros((1, 3, 224, 224), device=self.device)
            out = self.model(dummy)
            assert out.shape == (1, 38), f"Expected output shape (1, 38), got {out.shape}"
            del dummy, out
        gc.collect()
        print(f"🚀 [PyTorch] EfficientNet-B0 startup check verified (38 classes, eval mode, {self.device}).")

    def predict(self, image_input, crop_hint=None, generate_cam=True):
        """
        Runs deterministic EfficientNet-B0 inference on image_input (bytes, path, or PIL.Image).
        Returns predicted disease class, softmax confidence, top-5 probabilities, and genuine Grad-CAM.
        """
        if isinstance(image_input, bytes):
            image = Image.open(io.BytesIO(image_input)).convert("RGB")
        elif isinstance(image_input, str):
            image = Image.open(image_input).convert("RGB")
        elif isinstance(image_input, Image.Image):
            image = image_input.convert("RGB")
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")

        tensor = self.transform(image).unsqueeze(0).to(self.device)

        # 1. Primary Model Prediction with torch.inference_mode()
        with torch.inference_mode():
            outputs = self.model(tensor)
            probs = F.softmax(outputs, dim=1)[0]
            topk_probs, topk_indices = torch.topk(probs, min(5, len(self.classes)))

            top_idx = int(topk_indices[0].item())
            top_prob = float(topk_probs[0].item())
            top5_indices_list = [int(idx.item()) for idx in topk_indices]
            top5_probs_list = [float(p.item()) for p in topk_probs]

        predicted_class = self.classes[top_idx]
        crop_name, disease_name = parse_class_name(predicted_class)

        # Build Top-5 Predictions with exact softmax percentages
        top5_predictions = {}
        top5_list = []
        for i in range(len(top5_indices_list)):
            idx_val = top5_indices_list[i]
            prob_val = round(top5_probs_list[i] * 100, 2)
            cls_name = self.classes[idx_val]
            c_name, d_name = parse_class_name(cls_name)
            top5_predictions[cls_name] = f"{prob_val}%"
            top5_list.append({
                "class_index": idx_val,
                "unified_class": cls_name,
                "crop": c_name,
                "disease": d_name,
                "confidence": prob_val
            })

        # 2. Genuine Gradient-Based Grad-CAM Generation
        heatmap_b64 = ""
        if generate_cam:
            heatmap_b64 = self.generate_gradcam(image, tensor, top_idx)

        del tensor, image
        gc.collect()

        return {
            "predicted_class": predicted_class,
            "crop": crop_name,
            "disease": disease_name,
            "confidence": round(top_prob, 4),
            "confidence_percent": f"{round(top_prob * 100, 2)}%",
            "is_healthy": "healthy" in predicted_class.lower(),
            "top5_predictions": top5_predictions,
            "top5_list": top5_list,
            "heatmap_base64": heatmap_b64,
            "model_architecture": "EfficientNet-B0",
            "checkpoint_path": self.checkpoint_path
        }

    def generate_gradcam(self, original_image: Image.Image, input_tensor: torch.Tensor, target_class_idx: int) -> str:
        """
        Generates genuine gradient-weighted class activation mapping (Grad-CAM).
        Hooks the final convolutional feature layer of EfficientNet-B0 (model.features[-1]).
        Memory-safe: hooks registered and removed in try...finally, gradients zeroed with set_to_none=True,
        intermediate tensors and large numpy arrays explicitly freed, and gc.collect() invoked.
        """
        handle_fwd = None
        handle_bwd = None
        activations = None
        gradients = None
        x = None
        output = None
        target_score = None
        weights = None
        cam = None
        try:
            target_layer = self.model.features[-1]

            def forward_hook(module, inp, outp):
                nonlocal activations
                activations = outp

            def backward_hook(module, grad_in, grad_out):
                nonlocal gradients
                gradients = grad_out[0]

            handle_fwd = target_layer.register_forward_hook(forward_hook)
            handle_bwd = target_layer.register_full_backward_hook(backward_hook)

            # Grad-CAM requires gradient tracking through target convolutional features
            x = input_tensor.clone().detach().requires_grad_(True)
            self.model.zero_grad(set_to_none=True)
            output = self.model(x)
            target_score = output[0, target_class_idx]
            target_score.backward()

            if activations is None or gradients is None:
                return ""

            # Global average pooling of gradients over spatial dimensions (H, W)
            weights = torch.mean(gradients, dim=(2, 3), keepdim=True)
            cam = torch.sum(weights * activations.detach(), dim=1).squeeze()
            cam = F.relu(cam)

            cam_max = torch.max(cam)
            if cam_max > 0:
                cam = cam / cam_max

            cam_np = cam.cpu().numpy().astype(np.float32)

            # Resize CAM for overlay (bound max dimension to 640px to eliminate memory spikes on large uploads)
            orig_w, orig_h = original_image.size
            max_dim = 640
            if max(orig_w, orig_h) > max_dim:
                scale = max_dim / float(max(orig_w, orig_h))
                target_w, target_h = int(orig_w * scale), int(orig_h * scale)
                overlay_base = original_image.convert("RGB").resize((target_w, target_h), resample=Image.BILINEAR)
            else:
                target_w, target_h = orig_w, orig_h
                overlay_base = original_image.convert("RGB")

            cam_img = Image.fromarray((cam_np * 255).astype(np.uint8)).resize((target_w, target_h), resample=Image.BILINEAR)
            cam_norm = np.array(cam_img, dtype=np.float32) / 255.0

            # Jet colormap formula in pure NumPy
            r = np.clip(1.5 - np.abs(4.0 * cam_norm - 3.0), 0.0, 1.0)
            g = np.clip(1.5 - np.abs(4.0 * cam_norm - 2.0), 0.0, 1.0)
            b = np.clip(1.5 - np.abs(4.0 * cam_norm - 1.0), 0.0, 1.0)
            heatmap_rgb = (np.stack([r, g, b], axis=-1) * 255).astype(np.uint8)

            orig_rgb = np.array(overlay_base, dtype=np.uint8)
            overlay = (orig_rgb * 0.55 + heatmap_rgb * 0.45).astype(np.uint8)

            out_img = Image.fromarray(overlay)
            buf = io.BytesIO()
            out_img.save(buf, format="JPEG", quality=85)
            encoded = base64.b64encode(buf.getvalue()).decode("utf-8")

            del cam_np, cam_img, cam_norm, r, g, b, heatmap_rgb, orig_rgb, overlay, out_img, buf, overlay_base
            return encoded

        except Exception as e:
            print(f"⚠️ [Grad-CAM Warning] Grad-CAM generation encountered an error: {e}")
            return ""
        finally:
            if handle_fwd is not None:
                handle_fwd.remove()
            if handle_bwd is not None:
                handle_bwd.remove()
            self.model.zero_grad(set_to_none=True)
            del activations, gradients, x, output, target_score, weights, cam
            gc.collect()


# Compatibility aliases
PlantDiseaseClassifier = CropDiseaseClassifier