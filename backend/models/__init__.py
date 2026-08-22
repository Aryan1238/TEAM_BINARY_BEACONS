"""
ML Models Package
"""

from .image_classifier import CropDiseaseClassifier

# Alias for backwards compatibility
PlantDiseaseClassifier = CropDiseaseClassifier

__all__ = [
    "CropDiseaseClassifier",
    "PlantDiseaseClassifier",
]