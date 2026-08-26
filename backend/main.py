import os
import json
import base64
import mimetypes
import urllib.request
import urllib.error

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware


# =========================================================
# APP CONFIG
# =========================================================

app = FastAPI(
    title="KrishiRakshak AI",
    description="AI based crop disease detection API",
    version="1.0.0"
)

# Frontend ports
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# GEMINI CONFIG
# =========================================================

GEMINI_API_KEY = (
    os.getenv("GEMINI_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
    or os.getenv("API_KEY")
)

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)


# =========================================================
# LOAD .ENV MANUALLY
# =========================================================

def load_env_file():
    """
    Loads simple KEY=VALUE pairs from backend/.env
    if environment variables are not already available.
    """

    global GEMINI_API_KEY, GEMINI_MODEL

    env_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        ".env"
    )

    if not os.path.exists(env_path):
        return

    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()

                if not line:
                    continue

                if line.startswith("#"):
                    continue

                if "=" not in line:
                    continue

                key, value = line.split("=", 1)

                key = key.strip()
                value = value.strip().strip('"').strip("'")

                if key == "GEMINI_API_KEY" and not GEMINI_API_KEY:
                    GEMINI_API_KEY = value

                elif key == "GOOGLE_API_KEY" and not GEMINI_API_KEY:
                    GEMINI_API_KEY = value

                elif key == "API_KEY" and not GEMINI_API_KEY:
                    GEMINI_API_KEY = value

                elif key == "GEMINI_MODEL":
                    GEMINI_MODEL = value

    except Exception as e:
        print("Warning: Could not read .env:", e)


load_env_file()


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
async def root():
    return {
        "success": True,
        "message": "KrishiRakshak AI backend is running",
        "backend": "online"
    }


@app.get("/health")
async def health():
    return {
        "success": True,
        "status": "healthy",
        "backend": "online",
        "ai_model": GEMINI_MODEL
    }


# =========================================================
# GEMINI API CALL
# =========================================================

def call_gemini(image_bytes: bytes, mime_type: str):
    """
    Sends image to Gemini REST API.
    """

    if not GEMINI_API_KEY:
        raise Exception(
            "Gemini API key not found. "
            "Add GEMINI_API_KEY=YOUR_KEY inside backend/.env"
        )

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    prompt = """
You are an expert agricultural AI crop disease detection system.

Analyze the uploaded crop/plant image carefully.

Return ONLY valid JSON.
Do not use markdown.
Do not add ```json.
Do not add explanations outside JSON.

Use exactly this structure:

{
  "is_crop": true,
  "crop_name": "Soybean",
  "disease": "Frogeye Leaf Spot",
  "confidence": 92,
  "risk_level": "MEDIUM",
  "summary": "Short explanation of the visible symptoms.",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3",
    "Recommendation 4"
  ]
}

Rules:

1. is_crop must be true or false.
2. confidence must be an integer from 0 to 100.
3. risk_level must be LOW, MEDIUM, HIGH or UNKNOWN.
4. If the image is not a crop/plant image:
   - is_crop = false
   - crop_name = "Unknown"
   - disease = "Not a crop image"
   - confidence = 0
   - risk_level = "UNKNOWN"
   - give useful recommendations explaining that a crop image is required.
5. Identify the crop and visible disease/problem as accurately as possible.
6. Do not invent extremely specific information if the image is unclear.
7. Recommendations should be practical for farmers.
"""


    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    },
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_base64
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    request_data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=request_data,
        headers={
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=90
        ) as response:

            response_data = response.read().decode("utf-8")

            return json.loads(response_data)

    except urllib.error.HTTPError as e:

        error_body = e.read().decode("utf-8", errors="ignore")

        print("Gemini HTTP Error:", e.code)
        print("Gemini Error Body:", error_body)

        raise Exception(
            f"Gemini API error ({e.code}): {error_body}"
        )

    except urllib.error.URLError as e:

        print("Gemini connection error:", e)

        raise Exception(
            "Could not connect to Gemini API."
        )

    except Exception as e:

        print("Gemini request failed:", e)

        raise Exception(
            f"Gemini request failed: {str(e)}"
        )


# =========================================================
# EXTRACT GEMINI TEXT
# =========================================================

def extract_gemini_text(result):
    """
    Extracts generated text from Gemini response.
    """

    try:
        candidates = result.get("candidates", [])

        if not candidates:
            raise Exception("Gemini returned no candidates.")

        content = candidates[0].get("content", {})

        parts = content.get("parts", [])

        if not parts:
            raise Exception("Gemini returned no response parts.")

        text = parts[0].get("text", "")

        if not text:
            raise Exception("Gemini returned an empty response.")

        return text.strip()

    except Exception as e:
        raise Exception(
            f"Could not read Gemini response: {str(e)}"
        )


# =========================================================
# CLEAN JSON
# =========================================================

def clean_json_text(text):
    """
    Removes accidental markdown wrappers.
    """

    text = text.strip()

    if text.startswith("```json"):
        text = text[7:]

    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


# =========================================================
# ANALYZE IMAGE
# =========================================================

@app.post("/analyze")
async def analyze_crop(file: UploadFile = File(...)):

    print("\n========================================")
    print("NEW CROP ANALYSIS REQUEST")
    print("Filename:", file.filename)
    print("Content Type:", file.content_type)
    print("========================================")

    # -----------------------------------------------------
    # Validate file
    # -----------------------------------------------------

    if not file:
        raise HTTPException(
            status_code=400,
            detail="No image file received."
        )

    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    content_type = file.content_type or ""

    if content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported image type. "
                "Please upload JPG, JPEG, PNG or WEBP."
            )
        )

    # -----------------------------------------------------
    # Read image
    # -----------------------------------------------------

    try:
        image_bytes = await file.read()

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Could not read uploaded image: {str(e)}"
        )

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    # 10 MB limit
    max_size = 10 * 1024 * 1024

    if len(image_bytes) > max_size:
        raise HTTPException(
            status_code=400,
            detail="Image is too large. Maximum size is 10 MB."
        )

    print("Image size:", len(image_bytes), "bytes")

    # -----------------------------------------------------
    # Gemini
    # -----------------------------------------------------

    try:

        gemini_response = call_gemini(
            image_bytes,
            content_type
        )

        print("Gemini response received.")

        generated_text = extract_gemini_text(
            gemini_response
        )

        generated_text = clean_json_text(
            generated_text
        )

        print("Gemini text:")
        print(generated_text)

        analysis = json.loads(
            generated_text
        )

    except json.JSONDecodeError as e:

        print("JSON parsing error:", e)

        raise HTTPException(
            status_code=500,
            detail=(
                "AI returned an invalid JSON response. "
                f"Raw response: {generated_text if 'generated_text' in locals() else 'N/A'}"
            )
        )

    except Exception as e:

        print("ANALYSIS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    # -----------------------------------------------------
    # Normalize response
    # -----------------------------------------------------

    is_crop = bool(
        analysis.get("is_crop", True)
    )

    crop_name = str(
        analysis.get("crop_name", "Unknown")
    )

    disease = str(
        analysis.get("disease", "Unknown")
    )

    try:
        confidence = int(
            analysis.get("confidence", 0)
        )
    except:
        confidence = 0

    confidence = max(
        0,
        min(100, confidence)
    )

    risk_level = str(
        analysis.get("risk_level", "UNKNOWN")
    ).upper()

    summary = str(
        analysis.get(
            "summary",
            "No summary available."
        )
    )

    recommendations = analysis.get(
        "recommendations",
        []
    )

    if not isinstance(
        recommendations,
        list
    ):
        recommendations = [
            str(recommendations)
        ]

    recommendations = [
        str(item)
        for item in recommendations
    ]

    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    response = {
        "success": True,

        "message": "Image analyzed successfully.",

        "image": {
            "filename": file.filename,
            "type": content_type,
            "size": len(image_bytes)
        },

        "analysis": {
            "is_crop": is_crop,
            "crop_name": crop_name,
            "disease": disease,
            "confidence": confidence,
            "risk_level": risk_level,
            "summary": summary,
            "recommendations": recommendations
        }
    }

    print("\nANALYSIS COMPLETE")
    print(json.dumps(response, indent=2))

    return response