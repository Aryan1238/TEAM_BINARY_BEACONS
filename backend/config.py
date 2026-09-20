"""
Central Configuration for SIH PS 26131 Crop Health System
Contains Crop/Disease Taxonomies, IPM Database, Risk Thresholds, and Path Definitions.
"""

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
LOGS_DIR = os.path.join(BASE_DIR, "logs")

os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

# Exact 38 classes from trained EfficientNet-B0 checkpoint (PlantVillage + Cleaned Benchmark)
ALL_38_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

ALL_CLASSES = ALL_38_CLASSES

# Supported Crops and Diseases taxonomy for Maharashtra region (Application Level)
# Kept strictly separate from ALL_38_CLASSES (trained EfficientNet-B0 output mapping)
DISEASE_TAXONOMY = {
    "cotton": [
        "cotton_healthy",
        "cotton_bacterial_blight",
        "cotton_pink_bollworm_damage",
        "cotton_leaf_curl"
    ],
    "sugarcane": [
        "sugarcane_healthy",
        "sugarcane_red_rot",
        "sugarcane_smut",
        "sugarcane_rust"
    ],
    "soybean": [
        "soybean_healthy",
        "soybean_yellow_mosaic",
        "soybean_rust",
        "soybean_caterpillar_damage"
    ],
    "rice": [
        "rice_healthy",
        "rice_blast",
        "rice_brown_spot",
        "rice_sheath_blight"
    ],
    "tomato": [
        "tomato_healthy",
        "tomato_early_blight",
        "tomato_late_blight",
        "tomato_yellow_leaf_curl"
    ]
}

# Explicit Translation Layer: EfficientNet 38-Class Prediction -> Application Concept
# Preserves all 38 classes distinctly without silent merging
EFFICIENTNET_TO_APPLICATION_TAXONOMY = {
    "Apple___Apple_scab": {"app_crop": "apple", "app_disease": "apple_scab", "ipm_key": "Apple___Apple_scab"},
    "Apple___Black_rot": {"app_crop": "apple", "app_disease": "apple_black_rot", "ipm_key": "Apple___Black_rot"},
    "Apple___Cedar_apple_rust": {"app_crop": "apple", "app_disease": "apple_cedar_rust", "ipm_key": "Apple___Cedar_apple_rust"},
    "Apple___healthy": {"app_crop": "apple", "app_disease": "apple_healthy", "ipm_key": "Apple___healthy"},
    "Blueberry___healthy": {"app_crop": "blueberry", "app_disease": "blueberry_healthy", "ipm_key": "Blueberry___healthy"},
    "Cherry_(including_sour)___Powdery_mildew": {"app_crop": "cherry", "app_disease": "cherry_powdery_mildew", "ipm_key": "Cherry_(including_sour)___Powdery_mildew"},
    "Cherry_(including_sour)___healthy": {"app_crop": "cherry", "app_disease": "cherry_healthy", "ipm_key": "Cherry_(including_sour)___healthy"},
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {"app_crop": "corn", "app_disease": "corn_gray_leaf_spot", "ipm_key": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot"},
    "Corn_(maize)___Common_rust_": {"app_crop": "corn", "app_disease": "corn_common_rust", "ipm_key": "Corn_(maize)___Common_rust_"},
    "Corn_(maize)___Northern_Leaf_Blight": {"app_crop": "corn", "app_disease": "corn_northern_leaf_blight", "ipm_key": "Corn_(maize)___Northern_Leaf_Blight"},
    "Corn_(maize)___healthy": {"app_crop": "corn", "app_disease": "corn_healthy", "ipm_key": "Corn_(maize)___healthy"},
    "Grape___Black_rot": {"app_crop": "grape", "app_disease": "grape_black_rot", "ipm_key": "Grape___Black_rot"},
    "Grape___Esca_(Black_Measles)": {"app_crop": "grape", "app_disease": "grape_esca", "ipm_key": "Grape___Esca_(Black_Measles)"},
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {"app_crop": "grape", "app_disease": "grape_leaf_blight", "ipm_key": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)"},
    "Grape___healthy": {"app_crop": "grape", "app_disease": "grape_healthy", "ipm_key": "Grape___healthy"},
    "Orange___Haunglongbing_(Citrus_greening)": {"app_crop": "orange", "app_disease": "orange_citrus_greening", "ipm_key": "Orange___Haunglongbing_(Citrus_greening)"},
    "Peach___Bacterial_spot": {"app_crop": "peach", "app_disease": "peach_bacterial_spot", "ipm_key": "Peach___Bacterial_spot"},
    "Peach___healthy": {"app_crop": "peach", "app_disease": "peach_healthy", "ipm_key": "Peach___healthy"},
    "Pepper,_bell___Bacterial_spot": {"app_crop": "pepper_bell", "app_disease": "pepper_bacterial_spot", "ipm_key": "Pepper,_bell___Bacterial_spot"},
    "Pepper,_bell___healthy": {"app_crop": "pepper_bell", "app_disease": "pepper_healthy", "ipm_key": "Pepper,_bell___healthy"},
    "Potato___Early_blight": {"app_crop": "potato", "app_disease": "potato_early_blight", "ipm_key": "Potato___Early_blight"},
    "Potato___Late_blight": {"app_crop": "potato", "app_disease": "potato_late_blight", "ipm_key": "Potato___Late_blight"},
    "Potato___healthy": {"app_crop": "potato", "app_disease": "potato_healthy", "ipm_key": "Potato___healthy"},
    "Raspberry___healthy": {"app_crop": "raspberry", "app_disease": "raspberry_healthy", "ipm_key": "Raspberry___healthy"},
    "Soybean___healthy": {"app_crop": "soybean", "app_disease": "soybean_healthy", "ipm_key": "Soybean___healthy"},
    "Squash___Powdery_mildew": {"app_crop": "squash", "app_disease": "squash_powdery_mildew", "ipm_key": "Squash___Powdery_mildew"},
    "Strawberry___Leaf_scorch": {"app_crop": "strawberry", "app_disease": "strawberry_leaf_scorch", "ipm_key": "Strawberry___Leaf_scorch"},
    "Strawberry___healthy": {"app_crop": "strawberry", "app_disease": "strawberry_healthy", "ipm_key": "Strawberry___healthy"},
    "Tomato___Bacterial_spot": {"app_crop": "tomato", "app_disease": "tomato_bacterial_spot", "ipm_key": "Tomato___Bacterial_spot"},
    "Tomato___Early_blight": {"app_crop": "tomato", "app_disease": "tomato_early_blight", "ipm_key": "Tomato___Early_blight"},
    "Tomato___Late_blight": {"app_crop": "tomato", "app_disease": "tomato_late_blight", "ipm_key": "Tomato___Late_blight"},
    "Tomato___Leaf_Mold": {"app_crop": "tomato", "app_disease": "tomato_leaf_mold", "ipm_key": "Tomato___Leaf_Mold"},
    "Tomato___Septoria_leaf_spot": {"app_crop": "tomato", "app_disease": "tomato_septoria_leaf_spot", "ipm_key": "Tomato___Septoria_leaf_spot"},
    "Tomato___Spider_mites Two-spotted_spider_mite": {"app_crop": "tomato", "app_disease": "tomato_spider_mites", "ipm_key": "Tomato___Spider_mites Two-spotted_spider_mite"},
    "Tomato___Target_Spot": {"app_crop": "tomato", "app_disease": "tomato_target_spot", "ipm_key": "Tomato___Target_Spot"},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {"app_crop": "tomato", "app_disease": "tomato_yellow_leaf_curl", "ipm_key": "Tomato___Tomato_Yellow_Leaf_Curl_Virus"},
    "Tomato___Tomato_mosaic_virus": {"app_crop": "tomato", "app_disease": "tomato_mosaic_virus", "ipm_key": "Tomato___Tomato_mosaic_virus"},
    "Tomato___healthy": {"app_crop": "tomato", "app_disease": "tomato_healthy", "ipm_key": "Tomato___healthy"}
}

# EfficientNet-B0 Model Checkpoint Path (100% Controlled Leakage-Safe Checkpoint)
def _resolve_checkpoint_path():
    env_path = os.environ.get("EFFICIENTNET_CHECKPOINT_PATH")
    if env_path and os.path.exists(env_path):
        return os.path.abspath(env_path)
    repo_model_path = os.path.abspath(os.path.join(BASE_DIR, "..", "models", "efficientnet_b0", "100pct_leakage_safe_experiment", "best_model_100pct_leakage_safe.pth"))
    if os.path.exists(repo_model_path):
        return repo_model_path
    scratch_model_path = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "models", "efficientnet_b0", "100pct_leakage_safe_experiment", "best_model_100pct_leakage_safe.pth"))
    if os.path.exists(scratch_model_path):
        return scratch_model_path
    return repo_model_path

EFFICIENTNET_CHECKPOINT_PATH = _resolve_checkpoint_path()

# Rollback Checkpoint Path (70% Leakage-Safe Baseline Checkpoint)
def _resolve_rollback_path():
    env_path = os.environ.get("EFFICIENTNET_ROLLBACK_CHECKPOINT_PATH")
    if env_path and os.path.exists(env_path):
        return os.path.abspath(env_path)
    repo_path = os.path.abspath(os.path.join(BASE_DIR, "..", "models", "efficientnet_b0", "70pct_leakage_safe_experiment", "best_model_70pct_leakage_safe.pth"))
    if os.path.exists(repo_path):
        return repo_path
    return os.path.abspath(os.path.join(BASE_DIR, "..", "..", "models", "efficientnet_b0", "70pct_leakage_safe_experiment", "best_model_70pct_leakage_safe.pth"))

EFFICIENTNET_ROLLBACK_CHECKPOINT_PATH = _resolve_rollback_path()

# Production Preprocessing Matching EfficientNet-B0 Evaluation Pipeline:
# Resize(256) -> CenterCrop(224) -> ToTensor() -> ImageNet Normalization
PREPROCESSING_CONFIG = {
    "resize_size": 256,
    "crop_size": 224,
    "image_size": (224, 224),
    "mean": [0.485, 0.456, 0.406],
    "std": [0.229, 0.224, 0.225]
}

# Image Validation Thresholds (Pre-Inference)
IMAGE_VALIDATION_CONFIG = {
    "allowed_mime_types": ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    "max_file_size_bytes": 10 * 1024 * 1024,  # 10 MB limit
    "min_width": 100,                         # Minimum width in pixels
    "min_height": 100,                        # Minimum height in pixels
    "blur_variance_threshold": 30.0,          # Below 30 is severely blurry
    "min_brightness": 25.0,                   # Grayscale mean: below 25 is severely underexposed / dark
    "max_brightness": 240.0                   # Grayscale mean: above 240 is severely overexposed / white
}

# IPM Knowledge Base for Key Diseases
IPM_DATABASE = {
    "Tomato___Late_blight": {
        "disease_name": "Tomato Late Blight (Phytophthora infestans)",
        "symptoms": "Water-soaked dark lesions on leaves and stems, white mold on underside in humid weather.",
        "biological_control": "Apply Trichoderma harzianum @ 5g/L or Pseudomonas fluorescens @ 10g/L.",
        "chemical_control": "Spray Mancozeb 75% WP @ 2.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L.",
        "cultural_practices": "Avoid overhead irrigation. Remove and destroy infected foliage immediately.",
        "severity_level": "SEVERE",
        "safe_input_usage": "Wear protective gear. Observe 7 days pre-harvest interval (PHI).",
        "referral_needed": True
    },
    "Tomato___Early_blight": {
        "disease_name": "Tomato Early Blight (Alternaria solani)",
        "symptoms": "Concentric dark rings (target-board pattern) on lower foliage with chlorotic halos.",
        "biological_control": "Foliar spray of Trichoderma harzianum @ 5g/L.",
        "chemical_control": "Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L.",
        "cultural_practices": "Stake vines and mulch soil to prevent soil splashing onto lower foliage.",
        "severity_level": "MODERATE",
        "safe_input_usage": "Maintain 7 days wait time before harvesting fruits.",
        "referral_needed": False
    },
    "Tomato___Bacterial_spot": {
        "disease_name": "Tomato Bacterial Spot (Xanthomonas spp.)",
        "symptoms": "Small, dark, water-soaked circular lesions with greasy appearance on foliage.",
        "biological_control": "Apply Bacillus subtilis or Pseudomonas fluorescens spray @ 5g/L.",
        "chemical_control": "Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L.",
        "cultural_practices": "Use certified pathogen-free seed. Clean farm implements between rows.",
        "severity_level": "HIGH",
        "safe_input_usage": "Do not enter field during wet foliage conditions to avoid spreading bacteria.",
        "referral_needed": True
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "disease_name": "Corn Northern Leaf Blight (Exserohilum turcicum)",
        "symptoms": "Long, elliptical cigar-shaped grayish-green lesions on leaves.",
        "biological_control": "Apply Trichoderma viride foliar spray @ 5g/L.",
        "chemical_control": "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L.",
        "cultural_practices": "Practice 2-year crop rotation with non-cereal crops; till under residue.",
        "severity_level": "HIGH",
        "safe_input_usage": "Spray early morning or late afternoon to avoid drift.",
        "referral_needed": True
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "disease_name": "Corn Gray Leaf Spot (Cercospora zeae-maydis)",
        "symptoms": "Rectangular, tan-to-gray lesions restricted by leaf veins.",
        "biological_control": "Foliar spray of Pseudomonas fluorescens @ 10g/L.",
        "chemical_control": "Spray Pyraclostrobin 20% WG @ 1 g/L or Mancozeb 75% WP @ 2.5 g/L.",
        "cultural_practices": "Plant resistant hybrids. Manage crop residue.",
        "severity_level": "MODERATE",
        "safe_input_usage": "Wear protective gear during chemical mixing and application.",
        "referral_needed": False
    },
    "Grape___Black_rot": {
        "disease_name": "Grape Black Rot (Guignardia bidwellii)",
        "symptoms": "Circular reddish-brown spots with dark borders on leaves; shriveled black berries.",
        "biological_control": "Apply Bacillus amyloliquefaciens foliar spray.",
        "chemical_control": "Spray Myclobutanil 10% WP @ 1 g/L or Mancozeb 75% WP @ 2.5 g/L.",
        "cultural_practices": "Prune canopies to increase sunlight and air movement. Remove mummies.",
        "severity_level": "HIGH",
        "safe_input_usage": "Observe 14 days pre-harvest interval.",
        "referral_needed": True
    }
}

# Weather Risk Thresholds
WEATHER_RISK_THRESHOLDS = {
    "high_humidity_min": 75.0,        # Relative humidity %
    "favorable_temp_min": 20.0,       # Celsius
    "favorable_temp_max": 32.0,       # Celsius
    "heavy_rainfall_mm": 15.0,        # mm/day
    "leaf_wetness_hours_min": 8.0     # Hours
}
