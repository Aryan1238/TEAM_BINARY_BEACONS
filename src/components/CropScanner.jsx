import React, { useState, useRef } from "react";
import "./CropScanner.css";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

function CropScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setResult(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10 MB.");
      return;
    }

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const analyzeCrop = async () => {
    if (!selectedFile) {
      setError("Please upload a crop image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      // IMPORTANT:
      // Backend FastAPI expects "file"
      formData.append("file", selectedFile);

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Failed to analyze image.";

        try {
          const errorData = await response.json();
          message =
            errorData?.detail ||
            errorData?.message ||
            message;
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(
          data?.message || "Analysis failed. Please try again."
        );
      }

      setResult(data);
    } catch (err) {
      console.error("Crop analysis error:", err);

      setError(
        err?.message ||
          "Unable to connect with backend. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreview("");
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAnalysis = () => {
    return result?.analysis || {};
  };

  const getConfidence = () => {
    const value = Number(getAnalysis()?.confidence);

    if (Number.isNaN(value)) return 0;

    return Math.min(Math.max(value, 0), 100);
  };

  const getRiskLevel = () => {
    const analysis = getAnalysis();

    if (analysis?.risk_level) {
      return String(analysis.risk_level).toUpperCase();
    }

    const disease = String(analysis?.disease || "").toLowerCase();

    if (
      disease.includes("healthy") ||
      disease.includes("no disease") ||
      disease === "none"
    ) {
      return "LOW";
    }

    const confidence = getConfidence();

    if (confidence >= 85) return "HIGH";
    if (confidence >= 60) return "MEDIUM";

    return "LOW";
  };

  const getRiskClass = () => {
    const risk = getRiskLevel();

    if (risk === "HIGH") return "risk-high";
    if (risk === "MEDIUM") return "risk-medium";

    return "risk-low";
  };

  const analysis = getAnalysis();
  const confidence = getConfidence();
  const risk = getRiskLevel();

  const recommendations = Array.isArray(analysis?.recommendations)
    ? analysis.recommendations
    : [];

  return (
    <section className="crop-scanner" id="ai-diagnosis">
      <div className="scanner-container">

        {/* HEADER */}
        <div className="scanner-header">
          <div className="scanner-badge">
            🌱 AI CROP SCANNER
          </div>

          <h1>
            Detect Crop Problems
            <span> Before They Spread.</span>
          </h1>

          <p>
            Upload a clear image of your crop and our AI system will
            analyze it for diseases, pests and crop health problems.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="scanner-error">
            <div className="error-icon">⚠️</div>

            <div>
              <strong>Analysis Error</strong>
              <p>{error}</p>
            </div>

            <button
              className="error-close"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="scanner-grid">

          {/* UPLOAD CARD */}
          <div className="upload-card">

            <div className="upload-card-top">
              <div>
                <span className="mini-label">
                  AI-POWERED DIAGNOSIS
                </span>

                <h2>Upload Crop Image</h2>

                <p>
                  JPG, PNG, JPEG or WEBP
                </p>
              </div>

              <div className="upload-icon">
                🌿
              </div>
            </div>

            {/* PREVIEW */}
            {preview ? (
              <div className="preview-area">

                <div className="preview-image-wrapper">
                  <img
                    src={preview}
                    alt="Selected crop"
                    className="preview-image"
                  />

                  <div className="image-check">
                    ✓
                  </div>
                </div>

                <div className="selected-status">
                  <span>✓</span>
                  Image selected successfully
                </div>

              </div>
            ) : (
              <button
                className="drop-zone"
                onClick={openFilePicker}
                type="button"
              >
                <div className="drop-icon">
                  📸
                </div>

                <h3>Upload your crop image</h3>

                <p>
                  Click to browse from your device
                </p>

                <span>
                  Maximum file size: 10 MB
                </span>
              </button>
            )}

            {/* HIDDEN INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              hidden
            />

            {/* FILE INFO */}
            {selectedFile && (
              <div className="file-info">
                <div className="file-icon">
                  🖼️
                </div>

                <div className="file-details">
                  <strong>{selectedFile.name}</strong>

                  <span>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <span className="file-success">
                  ✓
                </span>
              </div>
            )}

            {/* BUTTONS */}
            <div className="scanner-actions">

              <button
                type="button"
                className="choose-button"
                onClick={openFilePicker}
              >
                📁 {selectedFile ? "Choose Another Image" : "Choose Image"}
              </button>

              <button
                type="button"
                className="analyze-button"
                onClick={analyzeCrop}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    ✨ Analyze Crop
                  </>
                )}
              </button>

              <button
                type="button"
                className="reset-button"
                onClick={resetScanner}
                disabled={loading}
              >
                ↻ Reset
              </button>

            </div>

            <div className="privacy-note">
              🔒 Your image is securely sent to the AI analysis service.
            </div>

          </div>

          {/* QUICK INFO CARD */}
          <div className="scanner-info">

            <div className="info-heading">
              <span>🤖</span>
              <div>
                <span className="mini-label">
                  SMART ANALYSIS
                </span>

                <h3>
                  What our AI checks
                </h3>
              </div>
            </div>

            <div className="check-list">

              <div className="check-item">
                <span>🌱</span>
                <div>
                  <strong>Crop Identification</strong>
                  <p>
                    Identifies the crop visible in your image.
                  </p>
                </div>
              </div>

              <div className="check-item">
                <span>🦠</span>
                <div>
                  <strong>Disease Detection</strong>
                  <p>
                    Detects visible diseases and crop problems.
                  </p>
                </div>
              </div>

              <div className="check-item">
                <span>📊</span>
                <div>
                  <strong>AI Confidence</strong>
                  <p>
                    Shows how confident the AI is about its result.
                  </p>
                </div>
              </div>

              <div className="check-item">
                <span>💡</span>
                <div>
                  <strong>Recommended Actions</strong>
                  <p>
                    Provides practical next steps based on analysis.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="analysis-loading">

            <div className="loading-orbit">
              🌱
            </div>

            <h3>
              AI is analyzing your crop...
            </h3>

            <p>
              Please wait while KrishiRakshak AI processes the image.
            </p>

            <div className="loading-bar">
              <span></span>
            </div>

          </div>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div className="analysis-result">

            {/* RESULT HEADER */}
            <div className="result-header">

              <div>
                <span className="result-label">
                  ✓ AI DIAGNOSIS COMPLETE
                </span>

                <h2>
                  Crop Health Analysis
                </h2>
              </div>

              <div className="analyzed-badge">
                ✓ Analyzed
              </div>

            </div>

            {/* STAT CARDS */}
            <div className="result-stats">

              <div className="result-stat">
                <span>🌱 CROP</span>
                <strong>
                  {analysis?.crop_name || "Unknown"}
                </strong>
              </div>

              <div className="result-stat">
                <span>🦠 DISEASE</span>
                <strong>
                  {analysis?.disease || "Unknown"}
                </strong>
              </div>

              <div className="result-stat">
                <span>⚠️ RISK LEVEL</span>
                <strong className={getRiskClass()}>
                  {risk}
                </strong>
              </div>

              <div className="result-stat">
                <span>🎯 CONFIDENCE</span>
                <strong>
                  {confidence.toFixed(1)}%
                </strong>
              </div>

            </div>

            {/* CONFIDENCE */}
            <div className="confidence-card">

              <div className="confidence-top">
                <span>AI Confidence</span>

                <strong>
                  {confidence.toFixed(1)}%
                </strong>
              </div>

              <div className="confidence-track">
                <div
                  className="confidence-fill"
                  style={{
                    width: `${confidence}%`,
                  }}
                ></div>
              </div>

            </div>

            {/* DIAGNOSIS */}
            <div className="result-section diagnosis-section">

              <div className="section-title">
                <span>🔍</span>
                <h3>Diagnosis</h3>
              </div>

              <p>
                {analysis?.summary ||
                  `The AI system detected ${
                    analysis?.disease || "a crop health condition"
                  } in the uploaded crop image.`}
              </p>

            </div>

            {/* RECOMMENDATIONS */}
            <div className="result-section">

              <div className="section-title">
                <span>🌿</span>
                <h3>Recommended Actions</h3>
              </div>

              {recommendations.length > 0 ? (
                <div className="recommendation-list">

                  {recommendations.map((item, index) => (
                    <div
                      className="recommendation-item"
                      key={index}
                    >
                      <span>
                        {index + 1}
                      </span>

                      <p>{item}</p>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="no-recommendations">
                  No specific recommendations were provided.
                </p>
              )}

            </div>

            {/* RESULT FOOTER */}
            <div className="result-footer">

              <div>
                <span>Analysis Status</span>
                <strong>✓ Successfully Completed</strong>
              </div>

              <button
                type="button"
                onClick={resetScanner}
              >
                🔄 Scan Another Crop
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default CropScanner;