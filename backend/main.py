from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from PIL import Image
from dotenv import load_dotenv

import io
import os
import sys
import json
import re
import numpy as np

# Ensure backend directory is on sys.path
_backend_dir = os.path.dirname(os.path.abspath(__file__))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

# Import Unified Crop Health ML Pipeline & Modules
from pipeline.unified_pipeline import UnifiedCropHealthPipeline
from pipeline.feedback_loop import ActiveLearningFeedbackLoop
from geospatial.hotspot_analyzer import GeospatialHotspotAnalyzer
from models.risk_forecaster import WeatherRiskForecaster
from config import IMAGE_VALIDATION_CONFIG


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
        print(f"[OK] Gemini Client initialized as optional assistant with model: {MODEL_NAME}")
    except Exception as e:
        print(f"[WARN] Warning initializing Gemini Client: {e}")
else:
    print("[INFO] GEMINI_API_KEY not set. Running with native PyTorch EfficientNet-B0 Engine.")


# ============================================================
# ML ENGINE INITIALIZATION (EfficientNet-B0 38 Classes)
# ============================================================
ml_pipeline = UnifiedCropHealthPipeline()
feedback_loop = ActiveLearningFeedbackLoop()
hotspot_analyzer = GeospatialHotspotAnalyzer()
risk_forecaster = WeatherRiskForecaster()


# ============================================================
# FASTAPI APP & CORS SETUP
# ============================================================
app = FastAPI(
    title="KrishiRakshak EfficientNet-B0 ML & AI Backend",
    description="SIH 2026 PS 26131 PyTorch EfficientNet-B0 (38 Classes) Crop Health & Disease Classification API",
    version="5.0.0"
)

# Production & Local Allowed Origins for CORS
DEFAULT_ALLOWED_ORIGINS = [
    "https://aryan1238.github.io",
    "https://krushiraksha.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    custom_origins = [o.strip() for o in env_origins.split(",") if o.strip()]
    ALLOWED_ORIGINS = list(set(DEFAULT_ALLOWED_ORIGINS + custom_origins))
else:
    ALLOWED_ORIGINS = DEFAULT_ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.github\.io|https://.*\.vercel\.app",
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
        "message": "KrishiRakshak EfficientNet-B0 ML & AI Backend is running 🚀",
        "problem_statement": "SIH 2026 PS 26131 - Govt of Maharashtra",
        "ml_engine": "PyTorch EfficientNet-B0 Transfer Learning Engine (38 Classes)",
        "gemini_active": client is not None
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy",
        "backend": "online",
        "ai_model": MODEL_NAME,
        "ml_engine": "PyTorch EfficientNet-B0 (38 Classes, 224x224 ImageNet Norm, Grad-CAM)"
    }


from fastapi.responses import StreamingResponse

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False


@app.get("/stream_proxy")
def stream_proxy(url: str):
    """RTSP / HTTP camera stream relay transcoding for native in-browser display."""
    if not HAS_CV2:
        raise HTTPException(status_code=503, detail="OpenCV not available on server")

    def generate_frames():
        cap = cv2.VideoCapture(url)
        if not cap.isOpened():
            return
        while True:
            success, frame = cap.read()
            if not success:
                break
            h, w = frame.shape[:2]
            if w > 640:
                frame = cv2.resize(frame, (640, int(h * 640 / w)))
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        cap.release()

    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


# ============================================================
# IMAGE VALIDATION ENGINE (Pre-Inference Quality Gate)
# ============================================================
def validate_uploaded_image(image_bytes: bytes, content_type: str):
    """
    Validates uploaded image prior to model inference.
    Checks:
      1. MIME type against allowed image formats
      2. File size against max allowed bytes
      3. Image integrity / corruption detection
      4. Minimum image width and height
      5. Underexposure / dark image detection
      6. Overexposure / washed out image detection
      7. Blur detection via Laplacian variance
    Returns: (is_valid: bool, error_dict: Optional[dict], pil_image: Optional[Image.Image])
    """
    cfg = IMAGE_VALIDATION_CONFIG

    # 1. Content-type check
    if content_type not in cfg["allowed_mime_types"]:
        return False, {
            "success": False,
            "error_code": "INVALID_FILE_TYPE",
            "message": f"Invalid file format '{content_type}'. Please upload a standard JPG, JPEG, PNG, or WEBP image.",
            "validation_status": "FAILED"
        }, None

    # 2. File size check
    if not image_bytes or len(image_bytes) == 0:
        return False, {
            "success": False,
            "error_code": "EMPTY_FILE",
            "message": "Uploaded image file is empty (0 bytes). Please upload a valid image file.",
            "validation_status": "FAILED"
        }, None

    if len(image_bytes) > cfg["max_file_size_bytes"]:
        max_mb = cfg["max_file_size_bytes"] // (1024 * 1024)
        return False, {
            "success": False,
            "error_code": "FILE_TOO_LARGE",
            "message": f"Image file size ({len(image_bytes) // 1024} KB) exceeds the {max_mb} MB limit.",
            "validation_status": "FAILED"
        }, None

    # 3. Readability and corruption check
    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img.verify()
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return False, {
            "success": False,
            "error_code": "CORRUPTED_IMAGE",
            "message": f"Image file is unreadable or corrupted: {str(e)}. Please select another photo.",
            "validation_status": "FAILED"
        }, None

    # 4. Dimension check
    w, h = pil_img.size
    if w < cfg["min_width"] or h < cfg["min_height"]:
        return False, {
            "success": False,
            "error_code": "IMAGE_TOO_SMALL",
            "message": f"Image resolution ({w}x{h} px) is too low. Minimum required resolution is {cfg['min_width']}x{cfg['min_height']} pixels.",
            "validation_status": "FAILED"
        }, None

    # Grayscale array for photometric and blur inspection
    gray_arr = np.array(pil_img.convert("L"), dtype=np.float64)

    # 5. Brightness / exposure check (0-255 scale)
    mean_brightness = float(np.mean(gray_arr))
    if mean_brightness < cfg["min_brightness"]:
        return False, {
            "success": False,
            "error_code": "IMAGE_TOO_DARK",
            "message": f"Image is underexposed/too dark (mean brightness: {mean_brightness:.1f} < {cfg['min_brightness']}). Please photograph the leaf with adequate lighting.",
            "validation_status": "FAILED"
        }, None

    if mean_brightness > cfg["max_brightness"]:
        return False, {
            "success": False,
            "error_code": "IMAGE_OVEREXPOSED",
            "message": f"Image is washed out / overexposed (mean brightness: {mean_brightness:.1f} > {cfg['max_brightness']}). Please avoid direct harsh glare and recapture.",
            "validation_status": "FAILED"
        }, None

    # 6. Blur detection via Laplacian variance
    if gray_arr.shape[0] >= 3 and gray_arr.shape[1] >= 3:
        lap = gray_arr[:-2, 1:-1] + gray_arr[2:, 1:-1] + gray_arr[1:-1, :-2] + gray_arr[1:-1, 2:] - 4.0 * gray_arr[1:-1, 1:-1]
        lap_var = float(np.var(lap))
        if lap_var < cfg["blur_variance_threshold"]:
            return False, {
                "success": False,
                "error_code": "IMAGE_TOO_BLURRY",
                "message": f"Image is too blurry (Laplacian variance: {lap_var:.1f} < {cfg['blur_variance_threshold']}). Please hold the camera steady and focus on the leaf symptoms.",
                "validation_status": "FAILED"
            }, None

    return True, None, pil_img


# ============================================================
# MAIN FRONTEND ANALYZE ENDPOINT (Powered by EfficientNet-B0)
# ============================================================
@app.post("/analyze")
async def analyze_crop(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        # Step 1: Pre-Inference Quality & Validation Gate
        is_valid, validation_err, pil_img = validate_uploaded_image(image_bytes, file.content_type)
        if not is_valid:
            return validation_err

        # Step 2: Primary Diagnosis via Frozen PyTorch EfficientNet-B0
        visual_diag = ml_pipeline.image_classifier.predict(image_bytes, generate_cam=True)
        crop_name = visual_diag["crop"]
        disease_name = visual_diag["disease"]
        confidence_float = visual_diag["confidence"]
        confidence_pct = visual_diag["confidence_percent"]
        predicted_class_key = visual_diag["predicted_class"]

        # Step 3: Run Weather-based Risk & IPM Engine
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
        risk_level = ml_res.get("weather_risk_forecasting", {}).get("risk_level", "MODERATE")

        recommendations_list = [
            f"Cultural Practice: {ipm_steps.get('step1_cultural', 'Crop rotation with non-host crops. Destroy crop residue after harvest.')}",
            f"Biological Treatment: {ipm_steps.get('step2_biological', 'Apply Trichoderma harzianum @ 5g/L or Pseudomonas fluorescens @ 10g/L spray.')}",
            f"Chemical Spray: {ipm_steps.get('step3_chemical', 'Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L.')}",
            f"Safety Guideline: {advisory.get('safety_guidelines', 'Wear protective equipment. Observe pre-harvest interval (PHI).')}"
        ]

        # Step 4: Optional Gemini Supplementary Advice (Strictly Auxiliary; Never Overrides Model Diagnosis)
        supplementary_advice = None
        if client:
            try:
                aux_prompt = (
                    f"A farmer photographed a {crop_name} leaf diagnosed with {disease_name} "
                    f"(confidence: {confidence_pct}). Provide a concise, empathetic 2-sentence farmer advisory "
                    f"in simple language highlighting immediate steps."
                )
                gemini_res = client.models.generate_content(
                    model=MODEL_NAME,
                    contents=aux_prompt
                )
                supplementary_advice = gemini_res.text.strip()
            except Exception as gemini_err:
                print(f"[Gemini Auxiliary Notice] Supplementary advisory skipped: {gemini_err}")

        width, height = pil_img.size

        return {
            "success": True,
            "message": "Crop image analyzed successfully by PyTorch EfficientNet-B0 Engine.",
            "validation_status": "PASSED",
            "image": {
                "filename": file.filename,
                "type": file.content_type,
                "width": width,
                "height": height
            },
            "analysis": {
                "is_crop": True,
                "predicted_class": predicted_class_key,
                "crop_name": crop_name,
                "disease": disease_name,
                "confidence": confidence_float,
                "confidence_percent": confidence_pct,
                "risk_level": risk_level,
                "summary": f"Detected {disease_name} on {crop_name} with {confidence_pct} confidence. Outbreak risk is rated as {risk_level}.",
                "recommendations": recommendations_list,
                "top5_predictions": visual_diag.get("top5_predictions", {}),
                "heatmap_base64": visual_diag.get("heatmap_base64", ""),
                "gradcam_image": visual_diag.get("heatmap_base64", ""),
                "pest_trap_analysis": ml_res.get("pest_trap_analysis"),
                "supplementary_advice": supplementary_advice,
                "model_architecture": "EfficientNet-B0",
                "checkpoint_path": visual_diag.get("checkpoint_path")
            }
        }

    except Exception as e:
        print("CROP ANALYSIS ERROR:", e)
        return {
            "success": False,
            "error_code": "INFERENCE_ERROR",
            "message": "Crop analysis failed during neural execution.",
            "error": str(e),
            "validation_status": "ERROR"
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


class DiseaseEventRequest(BaseModel):
    crop: str = "Tomato"
    disease: str = "Late Blight"
    lat: float = 20.0820
    lng: float = 73.9120
    confidence: float = 92.0
    severity: str = "High"
    district: Optional[str] = "Nashik"
    taluka: Optional[str] = "Niphad"
    source: Optional[str] = "Farmer App"
    timestamp: Optional[str] = None


# Persistent event store initialized with seed events
in_memory_disease_events = hotspot_analyzer.get_seed_maharashtra_events()


@app.get("/api/geospatial/hotspots")
@app.get("/api/v1/ml/hotspots")
def get_geospatial_hotspots(
    crop: Optional[str] = None,
    district: Optional[str] = None,
    disease: Optional[str] = None,
    eps_km: Optional[float] = None,
    min_samples: Optional[int] = None
):
    """
    Returns real-time DBSCAN epidemiological outbreak clusters, spatiotemporal velocity, and GeoJSON.
    """
    res = hotspot_analyzer.analyze_hotspots(
        events=in_memory_disease_events,
        crop_filter=crop,
        district_filter=district,
        eps_km=eps_km,
        min_samples=min_samples
    )
    return res


@app.get("/api/geospatial/events")
def get_disease_events(crop: Optional[str] = None, district: Optional[str] = None):
    """Returns all geotagged disease detection events."""
    evs = in_memory_disease_events
    if crop and crop.lower() != 'all':
        evs = [e for e in evs if crop.lower() in e.get('crop', '').lower()]
    if district and district.lower() != 'all':
        evs = [e for e in evs if district.lower() in e.get('district', '').lower()]
    return {"success": True, "count": len(evs), "events": evs}


@app.post("/api/geospatial/events")
def ingest_disease_event(req: DiseaseEventRequest):
    """
    Ingests a new geotagged disease event (from farmer scanner, drone, or scout) and updates GIS telemetry.
    """
    import datetime
    event_id = f"EVT-LIVE-{len(in_memory_disease_events) + 1:03d}"
    ts = req.timestamp or datetime.datetime.now(datetime.timezone.utc).isoformat()

    new_event = {
        "id": event_id,
        "lat": round(req.lat, 5),
        "lng": round(req.lng, 5),
        "crop": req.crop,
        "disease": req.disease,
        "confidence": req.confidence,
        "severity": req.severity,
        "timestamp": ts,
        "district": req.district,
        "taluka": req.taluka,
        "source": req.source
    }
    in_memory_disease_events.append(new_event)

    # Re-run clustering to return updated status
    analysis = hotspot_analyzer.analyze_hotspots(events=in_memory_disease_events, crop_filter=req.crop)
    
    return {
        "success": True,
        "message": f"Disease event {event_id} logged to GIS Surveillance Network.",
        "event": new_event,
        "updated_hotspots_count": analysis.get("active_hotspot_clusters", 0)
    }


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