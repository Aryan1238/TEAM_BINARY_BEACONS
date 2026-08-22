from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from PIL import Image
from dotenv import load_dotenv

import io
import os
import json
import re

# Import ResNet18 Transfer Learning ML Pipeline
from pipeline.unified_pipeline import UnifiedCropHealthPipeline
from pipeline.feedback_loop import ActiveLearningFeedbackLoop
from geospatial.hotspot_analyzer import GeospatialHotspotAnalyzer
from models.risk_forecaster import WeatherRiskForecaster


# ============================================================
# LOAD ENVIRONMENT VARIABLES & GEMINI
# ============================================================
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        print(f"✅ Gemini Client initialized with model: {MODEL_NAME}")
    except Exception as e:
        print(f"⚠️ Warning initializing Gemini Client: {e}")
else:
    print("ℹ️ GEMINI_API_KEY not set. Running with native Pretrained ResNet18 Transfer Learning Engine.")


# ============================================================
# ML ENGINE INITIALIZATION
# ============================================================
ml_pipeline = UnifiedCropHealthPipeline()
feedback_loop = ActiveLearningFeedbackLoop()
hotspot_analyzer = GeospatialHotspotAnalyzer()
risk_forecaster = WeatherRiskForecaster()


# ============================================================
# FASTAPI APP & CORS SETUP
# ============================================================
app = FastAPI(
    title="KrishiRakshak ML & AI Backend",
    description="SIH 2026 PS 26131 Pretrained ResNet18 Crop Health & Disease Classification API",
    version="4.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PYDANTIC DATA MODELS
# ============================================================
class WeatherRiskRequest(BaseModel):
    temperature: float = 28.5
    humidity: float = 82.0
    rainfall: float = 18.0
    leaf_wetness_hours: float = 9.0
    crop_name: str = "corn"
    growth_stage: str = "vegetative"
    pest_history_score: float = 0.3


class FeedbackRequest(BaseModel):
    sample_id: str
    predicted_class: str
    expert_confirmed_class: str
    extension_worker_id: Optional[str] = "FARMER_SELF"
    notes: Optional[str] = ""


# ============================================================
# HOME & HEALTH ENDPOINTS
# ============================================================
@app.get("/")
def home():
    return {
        "success": True,
        "message": "KrishiRakshak ResNet18 ML & AI Backend is running 🚀",
        "problem_statement": "SIH 2026 PS 26131 - Govt of Maharashtra",
        "ml_engine": "Pretrained ResNet18 Transfer Learning Engine v4.0",
        "gemini_active": client is not None
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy",
        "backend": "online",
        "ai_model": MODEL_NAME,
        "ml_engine": "ResNet18 Transfer Learning Pipeline v4.0"
    }


# ============================================================
# HELPER: PARSE CROP & DISEASE FROM TAXONOMY
# ============================================================
def parse_resnet_class(class_key: str):
    if "___" in class_key:
        parts = class_key.split("___")
        raw_crop = parts[0].replace("_", " ").replace("(maize)", "").strip()
        raw_disease = parts[1].replace("_", " ").strip()
    else:
        raw_crop = "Crop Leaf"
        raw_disease = class_key.replace("_", " ")

    if "healthy" in raw_disease.lower():
        disease_title = f"Healthy {raw_crop}"
    else:
        disease_title = f"{raw_disease}"

    return raw_crop.title(), disease_title.title()


# ============================================================
# MAIN FRONTEND ANALYZE ENDPOINT (For CropScanner.jsx)
# ============================================================
@app.post("/analyze")
async def analyze_crop(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

    if file.content_type not in allowed_types:
        return {
            "success": False,
            "message": "Please upload a JPG, JPEG, PNG or WEBP image."
        }

    try:
        image_bytes = await file.read()
        if not image_bytes:
            return {"success": False, "message": "Uploaded file is empty."}

        # Run ResNet18 Transfer Learning Classifier
        visual_diag = ml_pipeline.image_classifier.predict(image_bytes)
        predicted_class_key = visual_diag.get("predicted_class", "Corn_(maize)___Northern_Leaf_Blight")
        confidence_val = int(visual_diag.get("confidence", 0.92) * 100)

        crop_name, disease_name = parse_resnet_class(predicted_class_key)

        # Run Multi-modal Weather & IPM Pipeline
        ml_res = ml_pipeline.process_full_diagnosis(
            image_input=image_bytes,
            crop_name=crop_name.lower(),
            growth_stage="flowering",
            temperature=28.5,
            humidity=82.0,
            rainfall=15.0,
            leaf_wetness_hours=9.0
        )

        advisory = ml_res.get("integrated_pest_management_advisory", {})
        ipm_steps = advisory.get("integrated_management_steps", {})
        risk_level = ml_res.get("weather_risk_forecasting", {}).get("risk_level", "HIGH")

        recommendations_list = [
            f"Cultural Practice: {ipm_steps.get('step1_cultural', 'Crop rotation with non-host crops. Destroy crop residue after harvest.')}",
            f"Biological Treatment: {ipm_steps.get('step2_biological', 'Apply Trichoderma harzianum @ 5g/L or Pseudomonas fluorescens @ 10g/L spray.')}",
            f"Chemical Spray: {ipm_steps.get('step3_chemical', 'Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L.')}",
            f"Safety Guideline: {advisory.get('safety_guidelines', 'Wear protective equipment. Observe 14 days pre-harvest interval (PHI).')}"
        ]

        width, height = 224, 224
        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            width, height = pil_img.size
        except Exception:
            pass

        return {
            "success": True,
            "message": "Crop image analyzed successfully by Pretrained ResNet18 Engine.",
            "image": {
                "filename": file.filename,
                "type": file.content_type,
                "width": width,
                "height": height
            },
            "analysis": {
                "is_crop": True,
                "crop_name": crop_name,
                "disease": disease_name,
                "confidence": confidence_val,
                "risk_level": risk_level,
                "summary": f"Detected {disease_name} on {crop_name} with {confidence_val}% confidence. Outbreak risk is rated as {risk_level}.",
                "recommendations": recommendations_list,
                "top5_predictions": visual_diag.get("top5_predictions", {}),
                "heatmap_base64": visual_diag.get("heatmap_base64", ""),
                "pest_trap_analysis": ml_res.get("pest_trap_analysis")
            }
        }

    except Exception as e:
        print("CROP ANALYSIS ERROR:", e)
        return {
            "success": False,
            "message": "Crop analysis failed.",
            "error": str(e)
        }


# ============================================================
# EXTENDED ML MICROSERVICE API ENDPOINTS
# ============================================================
@app.post("/api/v1/ml/diagnose-image")
async def ml_diagnose_image(
    file: UploadFile = File(...),
    crop_name: Optional[str] = Form("corn")
):
    try:
        contents = await file.read()
        res = ml_pipeline.image_classifier.predict(contents, crop_hint=crop_name)
        return {"status": "success", "diagnosis": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/ml/count-pests")
async def ml_count_pests(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        res = ml_pipeline.pest_detector.detect_and_count(contents)
        return {"status": "success", "pest_analysis": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/ml/predict-risk")
def ml_predict_risk(req: WeatherRiskRequest):
    try:
        res = risk_forecaster.predict_risk(
            temperature=req.temperature,
            humidity=req.humidity,
            rainfall=req.rainfall,
            leaf_wetness_hours=req.leaf_wetness_hours,
            crop_name=req.crop_name,
            growth_stage=req.growth_stage,
            pest_history_score=req.pest_history_score
        )
        return {"status": "success", "weather_risk": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/ml/full-diagnosis")
async def ml_full_diagnosis(
    file: Optional[UploadFile] = File(None),
    crop_name: str = Form("corn"),
    growth_stage: str = Form("vegetative"),
    temperature: float = Form(28.5),
    humidity: float = Form(82.0),
    rainfall: float = Form(18.0),
    leaf_wetness_hours: float = Form(9.0),
    latitude: float = Form(20.9374),
    longitude: float = Form(77.7796)
):
    try:
        img_bytes = await file.read() if file else None
        res = ml_pipeline.process_full_diagnosis(
            image_input=img_bytes,
            crop_name=crop_name,
            growth_stage=growth_stage,
            temperature=temperature,
            humidity=humidity,
            rainfall=rainfall,
            leaf_wetness_hours=leaf_wetness_hours,
            latitude=latitude,
            longitude=longitude
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/ml/hotspots")
def ml_get_hotspots():
    res = hotspot_analyzer.analyze_hotspots()
    return {"status": "success", "hotspots": res}


@app.post("/api/v1/ml/submit-feedback")
def ml_submit_feedback(req: FeedbackRequest):
    res = feedback_loop.submit_feedback(
        sample_id=req.sample_id,
        predicted_class=req.predicted_class,
        expert_confirmed_class=req.expert_confirmed_class,
        extension_worker_id=req.extension_worker_id,
        notes=req.notes
    )
    return res