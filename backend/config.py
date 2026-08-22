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

# Supported Crops and Diseases taxonomy for Maharashtra region
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

ALL_CLASSES = []
for crop, diseases in DISEASE_TAXONOMY.items():
    ALL_CLASSES.extend(diseases)

# IPM Knowledge Base for Advisory Generation
IPM_DATABASE = {
    "cotton_bacterial_blight": {
        "disease_name": "Bacterial Blight (Xanthomonas citri pv. malvacearum)",
        "symptoms": "Water-soaked angular spots on leaves, veins turning black, boll rot.",
        "biological_control": "Apply Pseudomonas fluorescens @ 10g/L spray.",
        "chemical_control": "Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L.",
        "cultural_practices": "Destroy crop residue after harvest. Use certified disease-free seeds.",
        "severity_level": "HIGH",
        "safe_input_usage": "Wear protective mask and gloves. Observe 14 days pre-harvest interval (PHI).",
        "referral_needed": False
    },
    "cotton_pink_bollworm_damage": {
        "disease_name": "Pink Bollworm Infestation (Pectinophora gossypiella)",
        "symptoms": "Rosetted flowers, damaged bolls with entry holes filled with frass.",
        "biological_control": "Install Pheromone traps @ 5 traps/acre. Release Trichogramma chilonis @ 60,000/acre.",
        "chemical_control": "Spray Profenofos 50% EC @ 2 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L.",
        "cultural_practices": "Avoid extended cotton cropping. Destroy gin waste.",
        "severity_level": "SEVERE",
        "safe_input_usage": "Avoid spraying during peak bee activity (early morning).",
        "referral_needed": True
    },
    "sugarcane_red_rot": {
        "disease_name": "Red Rot (Colletotrichum falcatum)",
        "symptoms": "Reddening of internal pith tissues with white transverse patches, alcoholic odor.",
        "biological_control": "Treat setts with Trichoderma viride @ 10g/L before planting.",
        "chemical_control": "Sett treatment with Carbendazim 50% WP @ 2 g/L for 15 mins.",
        "cultural_practices": "Crop rotation with rice or green manure crops. Use resistant varieties (Co 86032).",
        "severity_level": "SEVERE",
        "safe_input_usage": "Rogue out infected clumps immediately and burn them outside the field.",
        "referral_needed": True
    },
    "tomato_early_blight": {
        "disease_name": "Early Blight (Alternaria solani)",
        "symptoms": "Concentric rings (target board pattern) on lower leaves, leaf yellowing.",
        "biological_control": "Foliar spray of Trichoderma harzianum @ 5g/L.",
        "chemical_control": "Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L.",
        "cultural_practices": "Stake plants and mulch soil to prevent fungal spores splashing from soil.",
        "severity_level": "MODERATE",
        "safe_input_usage": "Maintain 7 days wait time before harvesting fruits.",
        "referral_needed": False
    },
    "rice_blast": {
        "disease_name": "Rice Blast (Magnaporthe oryzae)",
        "symptoms": "Spindle-shaped lesions with gray/white centers and reddish-brown margins.",
        "biological_control": "Apply Pseudomonas fluorescens @ 10g/kg seed treatment & 2.5kg/ha foliar.",
        "chemical_control": "Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L.",
        "cultural_practices": "Avoid excessive Nitrogen fertilizers. Maintain standing water layer.",
        "severity_level": "HIGH",
        "safe_input_usage": "Apply at early symptom appearance before neck blast stage occurs.",
        "referral_needed": True
    }
}

# Weather Risk Weights and Factors
WEATHER_RISK_THRESHOLDS = {
    "high_humidity_min": 75.0,        # Relative humidity %
    "favorable_temp_min": 20.0,       # Celsius
    "favorable_temp_max": 32.0,       # Celsius
    "heavy_rainfall_mm": 15.0,        # mm/day
    "leaf_wetness_hours_min": 8.0     # Hours
}
