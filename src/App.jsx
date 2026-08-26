import React, { useState } from "react";
import "./App.css";
import CropScanner from "./components/CropScanner";

function App() {
  const [active, setActive] = useState("Home");
  const [role, setRole] = useState("Farmer");

  const navItems = [
    "Home",
    "AI Diagnosis",
    "Weather Risk",
    "Hotspot GIS",
    "CIBRC Dosage",
    "Role Hub",
  ];

  const scrollToScanner = () => {
    document
      .getElementById("ai-scanner")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setActive("AI Diagnosis");
  };

  const handleNavClick = (item) => {
    setActive(item);

    if (item === "Home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    if (item === "AI Diagnosis") {
      scrollToScanner();
    }
  };

  const features = [
    {
      icon: "🔬",
      title: "AI Disease Detection",
      text: "Upload a crop image and detect diseases with AI-powered visual analysis.",
      action: scrollToScanner,
    },
    {
      icon: "🗺️",
      title: "Hotspot GIS",
      text: "Track disease outbreaks, affected areas and containment zones geographically.",
    },
    {
      icon: "🌦️",
      title: "Weather Risk",
      text: "Analyze temperature, humidity, rainfall and leaf wetness for disease risk.",
    },
    {
      icon: "💊",
      title: "CIBRC Dosage",
      text: "Get crop-specific pesticide dosage and pre-harvest safety information.",
    },
  ];

  return (
    <div className="app">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="top-bar">

        <div className="top-left">
          <span className="sih-badge">
            SIH 2024
          </span>

          <span>
            Problem ID 26131 · Govt. of Maharashtra State Innovation Society
          </span>
        </div>

        <div className="top-right">
          <span>
            📱 Offline 2G SMS / IVR
          </span>

          <span>
            ☎ 1800-KRUSHI
          </span>
        </div>

      </div>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        {/* LOGO */}

        <div className="logo-section">

          <div className="logo-icon">
            🌱
          </div>

          <div>

            <div className="logo-title">
              KrishiRakshak
              <span>AI</span>
            </div>

            <div className="logo-subtitle">
              Crop Health & Outbreak GIS
            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <div className="nav-links">

          {navItems.map((item) => (

            <button
              key={item}
              className={`nav-link ${
                active === item ? "active" : ""
              }`}
              onClick={() => handleNavClick(item)}
            >

              {item === "Home" && "🌱 "}
              {item === "AI Diagnosis" && "📷 "}
              {item === "Weather Risk" && "☁️ "}
              {item === "Hotspot GIS" && "📍 "}
              {item === "CIBRC Dosage" && "🧪 "}
              {item === "Role Hub" && "▦ "}

              {item}

            </button>

          ))}

        </div>


        {/* RIGHT SIDE */}

        <div className="nav-actions">

          <div className="role-switcher">

            {["Farmer", "Officer", "Govt"].map(
              (item) => (

                <button
                  key={item}
                  className={`role-btn ${
                    role === item ? "active" : ""
                  }`}
                  onClick={() => setRole(item)}
                >

                  {item === "Farmer" && "🌾 "}
                  {item === "Officer" && "🧑‍🌾 "}
                  {item === "Govt" && "🏛️ "}

                  {item}

                </button>

              )
            )}

          </div>


          <button className="language-btn">
            🌐 EN ▾
          </button>


          <button
            className="yolo-btn"
            onClick={scrollToScanner}
          >
            📷 YOLO Live Vision
          </button>

        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            ⭐ SIH 2024 · AI Agriculture Platform
          </div>

          <h1>
            Detect Crop Disease
            <br />

            <span>
              Before It Spreads.
            </span>
          </h1>

          <p className="hero-description">
            An AI-powered platform for early detection and
            management of crop diseases and pest infestations —
            built for farmers, extension workers, and agriculture
            officials.
          </p>


          <div className="hero-buttons">

            {/* MAIN BUTTON */}

            <button
              className="primary-btn"
              onClick={scrollToScanner}
            >
              📷 Scan Your Crop
            </button>


            <button
              className="secondary-btn"
              onClick={() => {
                document
                  .getElementById("dashboard")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              View Dashboard →
            </button>

          </div>

        </div>


        {/* HERO LIVE VISION */}

        <div className="scanner-card">

          <div className="scanner-header">

            <div className="live-status">
              <span className="live-dot"></span>
              YOLOv8-AGRI LIVE STREAM
            </div>

            <div className="fps">
              ● 38.4 FPS · 12ms
            </div>

          </div>


          <div className="scanner-preview">

            <div className="scan-box">

              <div className="disease-label">
                Phytophthora Late Blight [94.8%]
              </div>

            </div>

          </div>


          <div className="scanner-footer">

            <span>
              〽 RTSP Stream · 1080p WebGL
            </span>

            <span>
              IP Cam & Drone Ready
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          AI CROP SCANNER
          THIS IS THE IMPORTANT PART
      ===================================================== */}

      <div
        id="ai-scanner"
        className="scanner-section-wrapper"
      >

        <CropScanner />

      </div>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="section">

        <div className="section-header">

          <div className="hero-badge">
            🌾 AI CROP PLATFORM
          </div>

          <h2>
            Everything You Need For Crop Health
          </h2>

          <p>
            KrishiRakshak AI combines disease detection,
            weather intelligence, GIS surveillance and
            agricultural recommendations.
          </p>

        </div>


        <div className="feature-grid">

          {features.map((feature) => (

            <div
              className="feature-card"
              key={feature.title}
              onClick={feature.action}
              style={{
                cursor: feature.action
                  ? "pointer"
                  : "default",
              }}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.text}
              </p>

              {feature.action && (
                <button
                  className="feature-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.action();
                  }}
                >
                  Start Scanning →
                </button>
              )}

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <section
        id="dashboard"
        className="section dashboard-section"
      >

        <div className="section-header">

          <div className="hero-badge">
            📊 FARM MONITORING
          </div>

          <h2>
            KrishiRakshak Dashboard
          </h2>

          <p>
            Monitor crop health, disease alerts and
            agricultural risks from one place.
          </p>

        </div>


        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h3>
              🌱 Crop Health Overview
            </h3>


            <div className="stat-grid">

              <div className="stat">

                <div className="stat-title">
                  Active Crops
                </div>

                <div className="stat-value">
                  12
                </div>

              </div>


              <div className="stat">

                <div className="stat-title">
                  Disease Alerts
                </div>

                <div className="stat-value">
                  04
                </div>

              </div>


              <div className="stat">

                <div className="stat-title">
                  Healthy Fields
                </div>

                <div className="stat-value">
                  86%
                </div>

              </div>

            </div>

          </div>


          <div className="dashboard-card">

            <h3>
              ⚠️ Current Risk Status
            </h3>

            <p>
              <strong>
                Weather Risk:
              </strong>{" "}
              Moderate
            </p>

            <br />

            <p>
              <strong>
                Disease Risk:
              </strong>{" "}
              High
            </p>

            <br />

            <p>
              <strong>
                Recommended Action:
              </strong>{" "}
              Scan crop
            </p>

            <button
              className="primary-btn dashboard-scan-btn"
              onClick={scrollToScanner}
            >
              🔬 Scan Crop Now
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <h3>
          🌱 KrishiRakshak AI
        </h3>

        <p>
          AI-powered crop disease detection &
          agricultural outbreak management platform.
        </p>

        <p style={{ marginTop: "15px" }}>
          SIH 2024 · Problem ID 26131
        </p>

      </footer>

    </div>
  );
}

export default App;