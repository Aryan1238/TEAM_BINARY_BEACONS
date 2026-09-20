"""
Export trained PlantVillage ResNet-9 PyTorch model to ONNX format.
Saves to public/models/plant_disease_resnet9.onnx for ONNX Runtime Web.
"""

import os
import sys
import torch

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from models.image_classifier import ResNet9
from config import ALL_CLASSES

sys.modules['__main__'].ResNet9 = ResNet9

def export_model():
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'plant-disease-model-complete.pth')
    if not os.path.exists(model_path):
        print(f"❌ Model checkpoint not found at {model_path}")
        return False

    print(f"📦 Loading PyTorch model from {model_path}...")
    model = torch.load(model_path, map_location='cpu', weights_only=False)
    model.eval()

    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'models')
    os.makedirs(output_dir, exist_ok=True)
    onnx_output_path = os.path.join(output_dir, 'plant_disease_resnet9.onnx')

    dummy_input = torch.randn(1, 3, 256, 256)

    print(f"🚀 Exporting to ONNX format at {onnx_output_path}...")
    torch.onnx.export(
        model,
        dummy_input,
        onnx_output_path,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}},
        opset_version=14
    )

    size_mb = os.path.getsize(onnx_output_path) / (1024 * 1024)
    print(f"✅ Successfully generated {onnx_output_path} ({size_mb:.2f} MB)")
    return True

if __name__ == '__main__':
    export_model()
