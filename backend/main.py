from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional
from PIL import Image
from dotenv import load_dotenv

import io
import gc
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
from models.yolo_manager import YOLOManager
from models.wildlife_alert_engine import WildlifeAlertEngine
from config import IMAGE_VALIDATION_CONFIG


# ============================================================
# LOAD ENVIRONMENT VARIABLES & CONFIGURATION
# ============================================================
load_dotenv()


# ============================================================
# ML & VISION ENGINE INITIALIZATION (EfficientNet-B0 + YOLO)
# ============================================================
ml_pipeline = UnifiedCropHealthPipeline()
feedback_loop = ActiveLearningFeedbackLoop()
hotspot_analyzer = GeospatialHotspotAnalyzer()
risk_forecaster = WeatherRiskForecaster()
yolo_manager = YOLOManager()
wildlife_alert_engine = WildlifeAlertEngine()


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


class HooterTriggerRequest(BaseModel):
    threat_type: Optional[str] = "manual_trigger"
    source: Optional[str] = "farm_sensor"
    duration_seconds: Optional[int] = 5


# ============================================================
# HOME & HEALTH ENDPOINTS
# ============================================================
@app.get("/")
@app.head("/")
def home():
    return {
        "success": True,
        "message": "KrishiRakshak EfficientNet-B0 ML Backend is running 🚀",
        "problem_statement": "SIH 2026 PS 26131 - Govt of Maharashtra",
        "ai_model": "PyTorch EfficientNet-B0",
        "ml_engine": "PyTorch EfficientNet-B0 Transfer Learning Engine (38 Classes)",
        "classes": 38,
        "grad_cam": True
    }


@app.get("/health")
@app.head("/health")
def health():
    yolo_stat = yolo_manager.get_status()
    return {
        "success": True,
        "status": "healthy",
        "backend": "online",
        "ai_model": "PyTorch EfficientNet-B0",
        "ml_engine": "PyTorch EfficientNet-B0",
        "classes": 38,
        "grad_cam": True,
        "yolo_leaf_status": yolo_stat["yolo_leaf"]["status"],
        "yolo_pest_status": yolo_stat["yolo_pest"]["status"],
        "yolo_wildlife_status": yolo_stat["yolo_wildlife"]["status"]
    }

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

    # Lightweight standardized 256x256 buffer for photometric and blur inspection
    # Standardizing to 256x256 prevents 300-400MB memory spikes from high-resolution phone camera uploads
    check_img = pil_img.resize((256, 256), resample=Image.Resampling.BILINEAR)
    gray_arr = np.array(check_img.convert("L"), dtype=np.float32)

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

        # Cap image resolution to max 1024px before classification and Grad-CAM
        # to guarantee execution stays safely within Render free tier's 512MB RAM limit
        max_dim = 1024
        if max(pil_img.width, pil_img.height) > max_dim:
            scale = max_dim / float(max(pil_img.width, pil_img.height))
            new_w, new_h = int(pil_img.width * scale), int(pil_img.height * scale)
            pil_img = pil_img.resize((new_w, new_h), resample=Image.Resampling.BILINEAR)
            buf = io.BytesIO()
            pil_img.save(buf, format="JPEG", quality=90)
            image_bytes = buf.getvalue()
            del buf

        # Step 2: Primary Diagnosis via Frozen PyTorch EfficientNet-B0
        visual_diag = ml_pipeline.image_classifier.predict(image_bytes, generate_cam=True)
        crop_name = visual_diag["crop"]
        disease_name = visual_diag["disease"]
        confidence_float = visual_diag["confidence"]
        confidence_pct = visual_diag["confidence_percent"]
        predicted_class_key = visual_diag["predicted_class"]

        # Step 3: Run Weather-based Risk & IPM Engine (pass precomputed_diagnosis to eliminate duplicate forward pass)
        ml_res = ml_pipeline.process_full_diagnosis(
            precomputed_diagnosis=visual_diag,
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

        # Step 4: Deterministic Agronomic Farmer Advisory (Local Expert Rules; Zero External LLM Dependency)
        if "healthy" in predicted_class_key.lower():
            supplementary_advice = f"Foliage displays healthy {crop_name} growth patterns. Maintain regular scouting and balanced nutrition."
        else:
            cultural = ipm_steps.get('step1_cultural', 'Maintain field sanitation and remove infected foliage.')
            chemical = ipm_steps.get('step3_chemical', 'Follow recommended local agricultural extension guidelines.')
            supplementary_advice = f"Immediate management for {disease_name} on {crop_name}: {cultural} Targeted treatment: {chemical}"

        width, height = pil_img.size

        response_payload = {
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

        # Explicitly free memory
        del image_bytes, pil_img, visual_diag, ml_res
        gc.collect()

        return response_payload

    except Exception as e:
        print("CROP ANALYSIS ERROR:", e)
        gc.collect()
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
        del contents
        gc.collect()
        return {"status": "success", "diagnosis": res}
    except Exception as e:
        gc.collect()
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


# ============================================================
# YOLO & REAL-TIME VISION ENDPOINTS
# ============================================================
@app.get("/api/v1/yolo/status")
def get_yolo_status():
    """Returns configuration and availability status for all YOLO pipelines."""
    return {
        "success": True,
        **yolo_manager.get_status()
    }


@app.post("/api/v1/yolo/detect-leaf")
async def yolo_detect_leaf(file: UploadFile = File(...)):
    """
    Detects leaf bounding box ROI in live camera frame or image.
    Honest reporting: returns model_not_configured if weights are absent.
    """
    contents = await file.read()
    res = yolo_manager.detect_leaf(contents)
    return {
        "success": True,
        **res
    }


@app.post("/api/v1/yolo/diagnose-roi")
async def yolo_diagnose_roi(file: UploadFile = File(...)):
    """
    Two-stage inference:
    1. Leaf detection/localization via YOLO (if available, else full frame)
    2. Disease classification via authoritative PyTorch EfficientNet-B0
    """
    contents = await file.read()
    res = yolo_manager.diagnose_roi(contents, ml_pipeline.image_classifier)
    return {
        "success": res.get("status") == "success",
        **res
    }


@app.post("/api/v1/yolo/detect-pest")
async def yolo_detect_pest(file: UploadFile = File(...)):
    """
    Pest detection on trap images.
    If YOLO weights absent, honestly routes to OpenCV contour heuristic.
    """
    contents = await file.read()
    res = yolo_manager.detect_pest(contents)
    return {
        "success": True,
        **res
    }


@app.post("/api/v1/yolo/detect-wildlife")
async def yolo_detect_wildlife(file: UploadFile = File(...)):
    """
    Detects wildlife threats (deer, boar, bull, nilgai) in field perimeter images.
    Honest reporting: returns model_not_configured if weights are absent.
    """
    contents = await file.read()
    res = yolo_manager.detect_wildlife(contents)
    return {
        "success": True,
        **res
    }


# ============================================================
# WILDLIFE ALERT & IOT HOOTER ENDPOINTS
# ============================================================
@app.get("/api/v1/alerts/status")
def get_alerts_status():
    """Returns status of the wildlife alert engine, cooldown state, and recent alerts."""
    return {
        "success": True,
        **wildlife_alert_engine.get_status()
    }


@app.post("/api/v1/alerts/trigger-hooter")
def trigger_hooter_endpoint(
    req: Optional[HooterTriggerRequest] = None,
    x_hooter_token: Optional[str] = Header(None, alias="X-Hooter-Token"),
    authorization: Optional[str] = Header(None, alias="Authorization")
):
    """
    Secure hooter trigger endpoint.
    Requires authentication via X-Hooter-Token or Authorization header.
    Enforces cooldown debounce and triggers ESP32 or browser alarm fallback.
    """
    token = x_hooter_token or authorization
    threat = req.threat_type if req else "manual_trigger"
    source = req.source if req else "farm_sensor"
    duration = req.duration_seconds if req else 5

    res = wildlife_alert_engine.trigger_hooter(
        auth_token=token,
        threat_type=threat,
        source=source,
        custom_duration_s=duration
    )

    if not res.get("success") and res.get("error") == "UNAUTHORIZED":
        return JSONResponse(status_code=401, content=res)

    if not res.get("success") and res.get("debounced"):
        return JSONResponse(status_code=429, content=res)

    return res