"""
Unified Class Schema Builder for PlantDoc & Plant Disease Expert Datasets
"""
import json

# Plant Disease Expert (58 classes) standard taxonomy
PLANT_DISEASE_EXPERT_58 = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cassava___Bacterial_blight",
    "Cassava___Brown_streak_disease",
    "Cassava___Green_mottle",
    "Cassava___Mosaic_disease",
    "Cassava___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Cotton___Bacterial_blight",
    "Cotton___Curl_virus",
    "Cotton___Fussarium_wilt",
    "Cotton___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Guava___Anthracnose",
    "Guava___Canker",
    "Guava___Dot",
    "Guava___Mummification",
    "Guava___Rust",
    "Guava___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Rice___Brown_spot",
    "Rice___Hispa",
    "Rice___Leaf_Blast",
    "Rice___Neck_Blast",
    "Rice___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Sugarcane___Bacterial_blight",
    "Sugarcane___Red_Rot",
    "Sugarcane___Rust",
    "Sugarcane___Yellow_leaf",
    "Sugarcane___healthy",
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

def build_unified_schema():
    classes = sorted(list(set(PLANT_DISEASE_EXPERT_58)))
    print(f"Total Unified Classes: {len(classes)}")
    return classes

if __name__ == "__main__":
    classes = build_unified_schema()
    with open("backend/unified_classes.json", "w") as f:
        json.dump(classes, f, indent=2)
    print("Saved backend/unified_classes.json")
