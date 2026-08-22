"""
Agro-Climatic & Weather-Based Crop Disease Risk Forecaster
Lead Developer: Arjun (ML Specialist)
"""

import os

try:
    import joblib
    import numpy as np
    from sklearn.ensemble import RandomForestClassifier
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

from config import WEATHER_RISK_THRESHOLDS, SAVED_MODELS_DIR


class WeatherRiskForecaster:
    """Forecasting engine that evaluates outbreak risks before visible symptoms appear."""

    def __init__(self, model_path=None):
        self.model_path = model_path or os.path.join(SAVED_MODELS_DIR, "risk_forecaster.joblib")
        self.rf_model = None
        if HAS_SKLEARN:
            self._load_or_initialize_model()

    def _load_or_initialize_model(self):
        if os.path.exists(self.model_path) and HAS_SKLEARN:
            try:
                self.rf_model = joblib.load(self.model_path)
                print(f"[WeatherRiskForecaster] Loaded model from {self.model_path}")
            except Exception:
                self._train_synthetic_model()
        else:
            self._train_synthetic_model()

    def _train_synthetic_model(self):
        if not HAS_SKLEARN:
            return

        np.random.seed(42)
        n_samples = 500
        X = np.zeros((n_samples, 6))
        X[:, 0] = np.random.uniform(15, 38, n_samples)
        X[:, 1] = np.random.uniform(40, 98, n_samples)
        X[:, 2] = np.random.uniform(0, 50, n_samples)
        X[:, 3] = np.random.uniform(0, 14, n_samples)
        X[:, 4] = np.random.randint(1, 5, n_samples)
        X[:, 5] = np.random.uniform(0.1, 0.9, n_samples)

        y = []
        for i in range(n_samples):
            temp, hum, rain, wet, stage, hist = X[i]
            score = 0
            if hum > 75: score += 30
            if 20 <= temp <= 30: score += 25
            if rain > 10 or wet > 8: score += 25
            if stage in [2, 3]: score += 10
            score += hist * 10

            if score < 35: y.append(0)
            elif score < 60: y.append(1)
            elif score < 80: y.append(2)
            else: y.append(3)

        self.rf_model = RandomForestClassifier(n_estimators=50, max_depth=6, random_state=42)
        self.rf_model.fit(X, y)
        try:
            joblib.dump(self.rf_model, self.model_path)
        except Exception:
            pass

    def predict_risk(self, temperature, humidity, rainfall, leaf_wetness_hours,
                     crop_name="cotton", growth_stage="vegetative", pest_history_score=0.3):
        """
        Calculates disease outbreak risk score (0-100) and risk level.
        """
        stage_map = {"seedling": 1, "vegetative": 2, "flowering": 3, "fruiting": 4, "harvest": 2}
        stage_num = stage_map.get(growth_stage.lower(), 2)

        rule_score = 0.0
        contributing_factors = []

        if humidity >= WEATHER_RISK_THRESHOLDS["high_humidity_min"]:
            rule_score += 35.0
            contributing_factors.append(f"High relative humidity ({humidity}%) promotes fungal spore germination.")

        if WEATHER_RISK_THRESHOLDS["favorable_temp_min"] <= temperature <= WEATHER_RISK_THRESHOLDS["favorable_temp_max"]:
            rule_score += 25.0
            contributing_factors.append(f"Optimal temperature range ({temperature}°C) accelerates pathogen incubation.")

        if rainfall >= WEATHER_RISK_THRESHOLDS["heavy_rainfall_mm"]:
            rule_score += 20.0
            contributing_factors.append(f"Recent rainfall ({rainfall} mm) enhances soil moisture and foliage wetness.")

        if leaf_wetness_hours >= WEATHER_RISK_THRESHOLDS["leaf_wetness_hours_min"]:
            rule_score += 15.0
            contributing_factors.append(f"Extended leaf wetness ({leaf_wetness_hours} hrs) creates high risk for bacterial infection.")

        rule_score += float(pest_history_score) * 10.0

        ml_score = rule_score
        if HAS_SKLEARN and self.rf_model is not None:
            feature_vector = np.array([[temperature, humidity, rainfall, leaf_wetness_hours, stage_num, pest_history_score]])
            probs = self.rf_model.predict_proba(feature_vector)[0]
            ml_score = float(np.sum(probs * np.array([15, 45, 75, 95])))

        final_risk_score = round(min(100.0, max(0.0, 0.4 * rule_score + 0.6 * ml_score)), 2)

        if final_risk_score < 30.0:
            risk_level = "LOW"
            color_code = "#28a745"
            primary_threats = ["Low risk of fungal/bacterial outbreak."]
        elif final_risk_score < 60.0:
            risk_level = "MODERATE"
            color_code = "#ffc107"
            primary_threats = [f"{crop_name.capitalize()} Leaf Spot", "Early Blight / Rust risk"]
        elif final_risk_score < 80.0:
            risk_level = "HIGH"
            color_code = "#fd7e14"
            primary_threats = [f"{crop_name.capitalize()} Bacterial Blight", "Pest outbreak alert", "Powdery Mildew"]
        else:
            risk_level = "SEVERE"
            color_code = "#dc3545"
            primary_threats = [f"{crop_name.capitalize()} Red Rot / Blast", "Severe Pink Bollworm alert", "Rapid disease spread"]

        return {
            "crop_name": crop_name,
            "growth_stage": growth_stage,
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "color_code": color_code,
            "forecasted_threats": primary_threats,
            "contributing_factors": contributing_factors,
            "preventive_window_days": 3 if risk_level in ["HIGH", "SEVERE"] else 7
        }
